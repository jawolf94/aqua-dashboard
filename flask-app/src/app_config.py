config = {

    # ToDo: Email and password should not be configurable. Load them from persisted file or DB in app factory
        "ALERTS": {
            "ENABLED": True,
            "SMTP_SERVER": "",
            "SENDER_EMAIL": "",
            "PASSWORD": "",
    },

    "DATABASE": {
        "DB_URL": "sqlite:////home/pi/AquaPi/sensor-data/",
        "DB_NAME": "sensor_data.db"
    },

    "READINGS": {
        "AUTOMATIC": True,
        "INTERVAL": 5,
        "SENSORS": {
            "TEMPERATURE": True
        }
    }
}