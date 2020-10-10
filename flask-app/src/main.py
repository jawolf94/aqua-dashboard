from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from marshmallow import EXCLUDE

from .entities.entity import Base, Session, engine
from .entities.temperature import Temperature
from .entities.reading import Reading
from .parameter_config import tank_parameters
from .proceedures.parameter_status import store_parameter_status
from .proceedures.tank_readings import get_latest_readings, save_reading
from .schema.reading import complete_reading_schema, ReadingSchema
from .schema.temperature import TemperatureSchema
from .validators.reading_validators import check_parameters

# To Do: Turn this into an application factory
# Create a Flask Application
app = Flask(__name__)

# Allow Cross Origin Resource Sharing
CORS(app)

# Generate DB Schema
Base.metadata.create_all(engine)

# Store tank paramters from config
app.config["tank_parameters"] = tank_parameters


@app.route('/all-readings')
def all_readings():
    """ Returns serialized list of all tank_readings to caller"""
    # Retrieve all readings from tank_readings
    reading_objs = get_latest_readings()

    # Serialize and retun query results
    schema = ReadingSchema(many=True)
    readings = schema.dump(reading_objs)

    return jsonify(readings)


@app.route('/latest-reading')
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

@app.route('/save-manual-reading', methods=['POST'])
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
    results = check_parameters(completed_reading, app.config["tank_parameters"])
    store_parameter_status(reading.id, results["invalid_parameters"])

    # Return new reading
    return jsonify(completed_reading)


# ToDo: Remove code when UI is updated. Functionality is depreciated.
@app.route('/temperature')
def get_temp():
    """Defines GET behavior for '/temperature' route."""
    # Fetch all temperature data from DB
    session = Session()
    temperature_objects = session.query(Temperature).all()

    # Serialize Data with Marshmallow Schema
    schema = TemperatureSchema(many=True)
    temperatures = schema.dump(temperature_objects)

    # Close DB connection
    session.close()

    # Serialize & return
    return jsonify(temperatures)
