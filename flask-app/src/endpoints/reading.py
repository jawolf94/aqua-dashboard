import json

from datetime import datetime, timezone
from flask import Blueprint, jsonify, request
from marshmallow import EXCLUDE, ValidationError

from ..common.error import handle_error
from ..common.param_common import param_store_alert
from ..entities.reading import Reading
from ..proceedures.parameter_status import read_parameter_status
from ..proceedures.tank_readings import get_latest_readings, get_readings_between, save_reading
from ..schema.date import DateSchema
from ..schema.parameter_status import ParameterStatusSchema
from ..schema.reading import ReadingSchema, complete_reading_schema

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
        return handle_error(ex, message="Error: An unknown issue occured while fetching your tank's readings. Please try again.")

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
        return handle_error(ex, message="Error: An unknown issue occured while fetching the latest tank reading. Please try again.")

@reading.route('/readings-between')
def readings_between():
    """Returns serialized list of readings between given timestamps"""

    # Define error message for except blocks.
    error_message = "Error: Could not fetch readings between the dates provided."
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
            raise ValueError(error_message + " Please indicate a starting timestamp for your query.")

        # Serialize and return readings
        reading_schema = ReadingSchema(many=True)
        reading_schema = reading_schema.dump(readings)

        return jsonify(reading_schema)

    except ValidationError as err:
        # Return 400 error if request is mal-formed
        return handle_error(err,code=400, message=error_message)

    except ValueError as err:
        # Return 400 error if timestamp is missing
        message = str(err)
        return handle_error(err, code=400, message=message)
        
    except Exception as e:
        # Catch any exceptions thrown and return error code
        return handle_error(e, message=error_message)


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

        # Check parameter status and alert
        completed_reading["reading_id"] = reading.id
        param_store_alert(completed_reading)

        # Return new reading schema to caller
        return jsonify(completed_reading)
    
    except ValidationError as err:
        # Return 400 error if request is mal-formed
        return handle_error(err,code=400, message="Error: Your entry is formatted incorrectly. Please re-enter & try again.")

    except Exception as err:
        # Handle generic error
        return handle_error(err, message="Error: Your reading could not be saved. Please try again.")


@reading.route('/check-parameter-status')
def check_parameter_status():
    
    # Define error message for except blocks
    error_message = "Error: Could not fetch parameter stats."
    try:

        # Deserialize request data
        reading_id = int(request.headers.get('reading_id'))

        # Get status from database
        status_obj = read_parameter_status(reading_id)

        if status_obj is not None:
            # Create response schema and return
            schema = ParameterStatusSchema()
            status = schema.dump(status_obj)

            return jsonify(status), 200

        else:
            raise ValueError("Invalid Reading ID")

    except (TypeError, ValueError) as err:
        # Return 400 error if request is mal-formed
        return handle_error(err,code=400, message= error_message)

    except KeyError as err:
        # Return 400 Error if reading_id was not specified.
        return handle_error(err, code=400, message= error_message + " Reading ID not specifed.")

    except LookupError as err:
        # Return 409 if multiple keys were found
        return handle_error(err,code = 409, message= error_message + " Multiple readings were found for this ID.")

    except Exception as err:
        # Handle generic error
        return handle_error(err, message=error_message)
