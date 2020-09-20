from flask import Flask, jsonify, request
from flask_cors import CORS

from .entities.entity import Base, Session, engine
from .entities.temperature import Temperature
from .proceedures.tank_readings import get_latest_readings
from .schema.reading import ReadingSchema
from .schema.temperature import TemperatureSchema

# Create a Flask Application
app = Flask(__name__)

# Allow Cross Origin Resource Sharing
CORS(app)

# Generate DB Schema
Base.metadata.create_all(engine)

# Returns serialized latest reading from tank_reading db to caller
@app.route('/latest-reading')
def latest_reading():
    # Retrieve latest reading from tank_readings
    reading_objs = get_latest_readings(1)

    # Serialize and return query results
    schema = ReadingSchema()
    reading = schema.dump(reading_objs)
    
    return jsonify(reading)

# Returns serialized list of all tank_readings
@app.route('/all-readings')
def all_readings():
    # Retrieve all readings from tank_readings
    reading_objs = get_latest_readings()

    # Serialize and retun query results
    schema = ReadingSchema(many=True)
    readings = schema.dump(reading_objs)

    return jsonify(readings)

# Defines GET behavior for '/temperature' route.
# ToDo: Remove code when UI is updated. Functionality is depreciated.
@app.route('/temperature')
def get_temp():

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