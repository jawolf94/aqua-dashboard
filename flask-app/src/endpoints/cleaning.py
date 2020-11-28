""" All flask endpoints related to cleaning data """

from flask import Blueprint, jsonify, request
from marshmallow import EXCLUDE, ValidationError

from ..common.error import handle_error
from ..entities.cleaning import Cleaning
from ..proceedures.cleaning_logs import add_cleaning_log_entry, get_cleaning_logs
from ..schema.cleaning import CleaningSchema

cleaning = Blueprint('cleaning', __name__, url_prefix='/cleaning')

@cleaning.route('/add-cleaning', methods=['POST'])
def add_cleaning():
    """ Saves a cleaning log entry from POST(ing) client. """

    try:
        # Deserialize the request data
        request_data = CleaningSchema(unknown=EXCLUDE).load(request.get_json())

        # Load into SQL entity for saving
        cleaning_entity = Cleaning(**request_data)

        # Save to DB
        add_cleaning_log_entry(cleaning_entity)

        # Return saved data
        return jsonify(request_data), 201

    except ValidationError as va:
        # Catch Validation Errors when request object is mal-formatted
        message = "Error while saveing cleaning data. Please reformat & try again"
        return handle_error(va, code = 400, message=message)

    except Exception as ex:
        # Catch generic exceptions
        return handle_error(ex)

@cleaning.route('/get-cleanings')
def get_cleanings():
    """ Retrieves all rows from cleaning log table and returns to caller """

    try:

        # Call stored proceedure to get cleaning logs
        cleaning_objs = get_cleaning_logs()

        dsad = 
        # Convert Cleaning entites into schemas
        schema = CleaningSchema(many=True)
        cleanings = schema.dump(cleaning_objs)

        #Serialize and send data
        return jsonify(cleanings)

    except Exception as ex:
        # Catch generic exceptions 
        return handle_error(ex)
