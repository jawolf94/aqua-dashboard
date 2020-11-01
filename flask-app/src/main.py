from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from flask import Flask, jsonify
from flask_cors import CORS

from .app_config import config
from .database  import Base, Engine
from .endpoints.reading import reading
from .parameter_config import tank_parameters
from .sensors.automatic_readings import create_reading 


def create_app():
    """
    Application factory for flask-app endpoints. Returns a flask app
    """

    # Create a Flask Application
    app = Flask(__name__)

    # Allow Cross Origin Resource Sharing
    CORS(app)

    # Store configs
    app.config["tank_parameters"] = tank_parameters
    app.config["app_config"] = config

    # Generate DB Schema
    Base.metadata.create_all(Engine)

    # Register Blueprints with application
    app.register_blueprint(reading)

    # Schedule task to automatically generate tank readings
    if config["READINGS"]["AUTOMATIC"]:
        scheduler = BackgroundScheduler()
        scheduler.add_job(func=create_reading, trigger='interval', minutes=config["READINGS"]["INTERVAL"])
        scheduler.start()

    return app
