import pytz

from apscheduler.schedulers.background import BackgroundScheduler
from flask import Flask
from flask_cors import CORS

from .app_config import config

from .common.cleaning_common import alert_last_cleaning
from .database  import Base, Engine
from .endpoints.cleaning import cleaning
from .endpoints.reading import reading
from .proceedures.smtp_creds import get_creds
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

    alert_config = config["ALERTS"]

    # Get smtp config from the DB
    try:
        # Pull from DB
        creds = get_creds(alert_config['NAME'])

        if creds is not None:
            # Add values to the app config
            alert_config["SMTP_SERVER"] = creds.server
            alert_config["SENDER_EMAIL"] = creds.sender_email
            alert_config["PASSWORD"] = creds.password

        else:
            # Disbale alerts if no credentials can be loaded
            raise ValueError("SMTP Config could not be loaded.")
             
    except Exception as exc:
        print(exc)
        alert_config["ENABLED"] = False 


    # Register Blueprints with application
    app.register_blueprint(reading)
    app.register_blueprint(cleaning)

    # Create scheduler for the app
    scheduler = BackgroundScheduler()

    # Schedule task to automatically generate tank readings
    if config["READINGS"]["AUTOMATIC"]:
        scheduler.add_job(func=create_reading, trigger='interval', minutes=config["READINGS"]["INTERVAL"])

    # Schedule regular cleaning alerts if config is enabled
    if alert_config["ENABLED"]:

        # Job scheduled daily 7am EST
        scheduler.add_job(func=alert_last_cleaning, trigger='cron', hour=12, minute=0, timezone=pytz.utc)
        
    # Start app scheduler
    scheduler.start()
        
    return app
