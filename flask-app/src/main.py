from datetime import datetime
from flask import Flask, jsonify
from flask_cors import CORS

from .app_config import config
from .database  import Base, Engine
from .endpoints.reading import reading
from .parameter_config import tank_parameters


def create_app():
    """
    Application factory for flask-app endpoints. Returns a flask app
    """

    #ToDo: Breakout application factory into blueprints

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

    return app
