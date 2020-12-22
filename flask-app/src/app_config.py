config = {

    # Secret key used to sign session cookies
    # !Important! This value should be overriden before deploying 
    "SECRET_KEY": "dev",

    # Alert configs
    "ALERTS": {
        "ENABLED": True,
        "NAME": "gmail",

        # ! Important !
        # SMTP configs are loaded from the DB at app start
        # Any values here are overridden
        "SMTP_SERVER": "",
        "SENDER_EMAIL": "",
        "PASSWORD": "",
    },

    # Database configs

    "DATABASE": {
        "DB_URL": "sqlite:////home/pi/AquaPi/sensor-data/",
        "DB_NAME": "sensor_data.db"
    },

    # Automatic reading configs

    "READINGS": {
        "AUTOMATIC": True,
        "INTERVAL": 5,
        "SENSORS": {
            "TEMPERATURE": False
        }
    },

    "TANK_PARAMETERS": {

        # Min & Max ranges for each tank parameter

        "AMMONIA_PPM": {
            "MIN": 0.0,
            "MAX": 0.2
        },

        "NITRITE_PPM": {
            "MIN": 0.0,
            "MAX": 0.2
        },

        "NITRATE_PPM": {
            "MIN": 0.0,
            "MAX": 20.0
        },

        "PH": {
            "MIN": 6.0,
            "MAX": 7.0
        },

        "TEMPERATURE": {
            "MIN": 72,
            "MAX": 77
        },

        # Number of days to elapse before cleaning is needed

        "CLEANING_TIME": 7
    }
}
