from datetime import datetime
from flask import Blueprint, current_app, jsonify, request
from marshmallow import EXCLUDE

from ..entities.temperature import Temperature
from ..entities.reading import Reading
from ..proceedures.parameter_status import read_parameter_status, store_parameter_status
from ..proceedures.tank_readings import get_latest_readings, save_reading
from ..schema.parameter_status import ParameterStatusSchema
from ..schema.reading import complete_reading_schema, ReadingSchema
from ..validators.reading_validators import check_parameters

reading = Blueprint('reading', __name__, url_prefix="/")

@reading.route('/all-readings')
def all_readings():
    """ Returns serialized list of all tank_readings to caller"""
    # Retrieve all readings from tank_readings
    reading_objs = get_latest_readings()

    # Serialize and retun query results
    schema = ReadingSchema(many=True)
    readings = schema.dump(reading_objs)

    return jsonify(readings)

@reading.route('/latest-reading')
def latest_reading():
    """Returns serialized latest reading from tank_reading db to caller"""
    # Retrieve latest reading from tank_readings
    reading_obj = get_latest_readings(1)

    # Remove from list to return as single reading
    if(len(reading_obj) > 0):
        reading_obj = reading_obj[0]

    # Serialize and return query results
    schema = ReadingSchema()
    reading = schema.dump(reading_obj)

    return jsonify(reading)

@reading.route('/save-manual-reading', methods=['POST'])
def save_manual_reading():
    """ Saves a manually entered reading into tank_readings table"""

    # Deserialize request data
    posted_reading = ReadingSchema(exclude=("timestamp", "manual"), unknown=EXCLUDE).load(request.get_json())

    # Fill in blank values from user's request
    completed_reading = complete_reading_schema(posted_reading)

    # Load Reading object from the request into SQL entity
    reading = Reading(**completed_reading, manual=1, timestamp=datetime.now())

    # Save reading to table
    save_reading(reading)

    # Check if parameters from reading are in expected ranges and store
    results = check_parameters(completed_reading, current_app.config["tank_parameters"])
    store_parameter_status(reading.id, results["invalid_parameters"])

    # Return new reading
    return jsonify(completed_reading)


@reading.route('/check-parameter-status', methods=['POST'])
def check_parameter_status():
    # Deserialize request data
    posted_data = ParameterStatusSchema(unknown=EXCLUDE).load(request.get_json())

    # Pass reading_id to proceedure
    try:
        # Get status from database
        status_obj = read_parameter_status(posted_data["reading_id"])

        if status_obj is not None:
            # Create respnse schema and return
            schema = ParameterStatusSchema()
            status = schema.dump(status_obj)

            return jsonify(status), 200

        else:
            # Return 404 if reading cannot be found
            return jsonify("{}"), 404

    except KeyError as err:
        # Return 400 Error if reading_id was not specified.
        return jsonify("{}"), 400
    except LookupError:
        # Return 409 if multiple keys were found
        return jsonify("{}"), 409
