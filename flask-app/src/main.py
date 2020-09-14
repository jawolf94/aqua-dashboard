from flask import Flask, jsonify, request
from .entities.entity import Session, engine, Base
from .entities.temperature import Temperature, TemperatureSchema

# Create a Flask Application
app = Flask(__name__)

# Generate DB Schema
Base.metadata.create_all(engine)

# Defines GET behavior for '/temperature' route.
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