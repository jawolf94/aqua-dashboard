from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from marshmallow import EXCLUDE

from .entities.entity import Base, Session, engine
from .entities.temperature import Temperature
from .entities.reading import Reading
from .proceedures.tank_readings import get_latest_readings, save_reading
from .schema.reading import complete_reading_schema, ReadingSchema
from .schema.temperature import TemperatureSchema

# Create a Flask Application
app = Flask(__name__)

# Allow Cross Origin Resource Sharing
CORS(app)

# Generate DB Schema
Base.metadata.create_all(engine)


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

    # Load Reading object from the request into SQL entity
    posted_reading = ReadingSchema(exclude=("timestamp", "manual"), unknown=EXCLUDE).load(request.get_json())

    # Fill in blank values from user's request
    completed_reading = complete_reading_schema(posted_reading)
    reading = Reading(**completed_reading, manual=1, timestamp=datetime.now())

    # Save reading to table
    save_reading(reading)

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
