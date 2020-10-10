from datetime import datetime
from sqlalchemy import create_engine, Column, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Specify DB URL and Name
# ToDo: Move DB to common location for sensor data collection and dashboard
# ToDo: Use config for DB Name and location
db_url = "sqlite:////home/pi/AquaPi/sensor-data/"
db_name = "sensor_data.db"
db_path = db_url + db_name

# Instantiate DB Engine (SQL Pool & Dialect)
engine = create_engine(db_path)

# Create Session
Session = sessionmaker(bind=engine)

# Creates a base class to enable field declartions
Base = declarative_base()

class Entity():

    def __init__(self):
        pass
