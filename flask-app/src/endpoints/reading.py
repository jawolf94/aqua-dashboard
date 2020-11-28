from datetime import datetime, timezone
from flask import Blueprint, current_app, jsonify, request
import json
from marshmallow import EXCLUDE, ValidationError

from ..app_config import config
from ..alerts.alert import send_param_alert
from ..common.error import handle_error
from ..entities.reading import Reading
from ..proceedures.parameter_status import read_parameter_status, store_parameter_status
from ..proceedures.tank_readings import get_latest_readings, get_readings_between, save_reading
from ..schema.date import DateSchema
from ..schema.parameter_status import ParameterStatusSchema
from ..schema.reading import complete_reading_schema, ReadingSchema
from ..common.reading_validators import validate_parameters

reading = Blueprint('reading', __name__, url_prefix="/")

@reading.route('/all-readings')
def all_readings():
    """ Returns serialized list of all tank_readings to caller"""
    # Retrieve all readings from tank_readings

    try:
        reading_objs = get_latest_readings()

        # Serialize and retun query results
        schema = ReadingSchema(many=True)
        readings = schema.dump(reading_objs)

        return jsonify(readings)

    except Exception as ex:
        # Handle generic errors
        return handle_error(ex)

@reading.route('/latest-reading')
def latest_reading():
    """Returns serialized latest reading from tank_reading db to caller"""

    try:
        # Retrieve latest reading from tank_readings
        reading_obj = get_latest_readings(1)

        # Remove from list to return as single reading
        if(len(reading_obj) > 0):
            reading_obj = reading_obj[0]

        # Serialize and return query results
        schema = ReadingSchema()
        reading = schema.dump(reading_obj)

        return jsonify(reading)

    except Exception as ex:
        # Handle generic errors
        return handle_error(ex)

@reading.route('/readings-between')
def readings_between():
    """Returns serialized list of readings between given timestamps"""

    try:
        # Parse request data from the query string
        start = request.args.get('start')
        end = request.args.get('end')

        if start is not None:

            # Deserialize start data
            start = json.loads(start)
            start = DateSchema().load(start)
            start = start["datetime"].replace(tzinfo=timezone.utc)

            if end is not None:
                # Deserialize end date if passed
                end = json.loads(end)
                end = DateSchema().load(end)
                end = end["datetime"].replace(tzinfo=timezone.utc)

            # Retreive readings
            readings = get_readings_between(start,end)
            
        else:
            raise ValueError("Please specify a starting timestamp.")

        # Serialize and return readings
        reading_schema = ReadingSchema(many=True)
        reading_schema = reading_schema.dump(readings)

        return jsonify(reading_schema)

    except ValidationError as err:
        # Return 400 error if request is mal-formed
        return handle_error(err,code=400)

    except ValueError as err:
        # Return 400 error if timestamp is missing
        message = str(err)
        return handle_error(err, code=400, message=message)
        
    except Exception as e:
        # Catch any exceptions thrown and return error code
        return handle_error(e)


@reading.route('/save-manual-reading', methods=['POST'])
def save_manual_reading():
    """ Saves a manually entered reading into tank_readings table"""

    try:
        # Deserialize request data
        posted_reading = ReadingSchema(exclude=("timestamp", "manual"), unknown=EXCLUDE).load(request.get_json())

        # Fill in blank values from user's request
        completed_reading = complete_reading_schema(posted_reading)

        # Load Reading object from the request into SQL entity
        reading = Reading(**completed_reading, manual=1, timestamp=datetime.now(tz=timezone.utc))

        # Save reading to table
        save_reading(reading)

        # Check if parameters from reading are in expected ranges, store, & alert
        results = validate_parameters(completed_reading, current_app.config["tank_parameters"])
        store_parameter_status(reading.id, results["invalid_parameters"])

        # Alert on any paramaters if specified by callers
        if not results["valid"] and config["ALERTS"]["ENABLED"]:
            send_param_alert(results["invalid_parameters"], completed_reading)

        # Return new reading
        return jsonify(completed_reading)
    
    except ValidationError as err:
        # Return 400 error if request is mal-formed
        return handle_error(err,code=400)

    except Exception as err:
        # Handle generic error
        return handle_error(err)


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

    except ValidationError as err:
        # Return 400 error if request is mal-formed
        return handle_error(err,code=400)

    except KeyError as err:
        # Return 400 Error if reading_id was not specified.
        return handle_error(err, code=400)

    except LookupError as err:
        # Return 409 if multiple keys were found
        return handle_error(err,code = 409)
