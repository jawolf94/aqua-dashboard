from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask
from flask_cors import CORS
import pytz

from .app_config import config
from .database  import Base, Engine
from .common.cleaning_common import alert_last_cleaning
from .endpoints.cleaning import cleaning
from .endpoints.reading import reading
from .sensors.automatic_readings import create_reading


def create_app():
    """
    Application factory for flask-app endpoints. Returns a flask app
    """

    # Create a Flask Application
    app = Flask(__name__)

    # Allow Cross Origin Resource Sharing
    CORS(app)

    # Generate DB Schema
    Base.metadata.create_all(Engine)

    # Register Blueprints with application
    app.register_blueprint(reading)
    app.register_blueprint(cleaning)

    # Create scheduler for the app
    scheduler = BackgroundScheduler()

    # Schedule task to automatically generate tank readings
    if config["READINGS"]["AUTOMATIC"]:
        scheduler.add_job(func=create_reading, trigger='interval', minutes=config["READINGS"]["INTERVAL"])

    # Schedule regular cleaning alerts if config is enabled
    if config["ALERTS"]["ENABLED"]:

        # Job scheduled daily 7am EST
        scheduler.add_job(func=alert_last_cleaning, trigger='cron', hour=12, minute=0, timezone=pytz.utc)
        
    # Start app scheduler
    scheduler.start()
        
    return app
