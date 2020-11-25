""" All flask endpoints related to cleaning data """

from flask import Blueprint, jsonify, request
from marshmallow import EXCLUDE

from ..entities.cleaning import Cleaning
from ..proceedures.cleaning_logs import add_cleaning_log_entry, get_cleaning_logs
from ..schema.cleaning import CleaningSchema

cleaning = Blueprint('cleaning', __name__, url_prefix='/cleaning')

@cleaning.route('/add-cleaning', methods=['POST'])
def add_cleaning():
    """ Saves a cleaning log entry from POST(ing) client. """

    # Deserialize the request data
    request_data = CleaningSchema(unknown=EXCLUDE).load(request.get_json())

    # Load into SQL entity for saving
    cleaning_entity = Cleaning(**request_data)

    # Save to DB
    add_cleaning_log_entry(cleaning_entity)

    # Return saved data
    return jsonify(request_data)

@cleaning.route('/get-cleanings')
def get_cleanings():
    """ Retrieves all rows from cleaning log table and returns to caller """

    # Call stored proceedure to get cleaning logs
    cleaning_objs = get_cleaning_logs()

    # Convert Cleaning entites into schemas
    schema = CleaningSchema(many=True)
    cleanings = schema.dump(cleaning_objs)

    #Serialize and send data
    return jsonify(cleanings)
