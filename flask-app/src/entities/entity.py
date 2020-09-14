from datetime import datetime
from sqlalchemy import create_engine, Column, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Specify DB URL and Name
# ToDo: Move DB to common location for sensor data collection and dashboard
# ToDo: Use config for DB Name and location
db_url = "sqlite:////AquaPi/sensor_data/"
db_name = "sensor_data.db"

# Instantiate DB Engine (SQL Pool & Dialect)
engine = create_engine(db_url + db_name)

# Create Session
Session = sessionmaker(bind=engine)

# Creates a base class to enable field declartions
Base = declarative_base()

class Entity():

    # Timestamp when this Entity was created.
    created_at = Column(DateTime)

    # Timestamp when this Entity was last updated.
    last_updated = Column(DateTime)

    def __init__(self):
        # Set created time to now.
        self.created_at = datetime.now()

        # Last update is same as created at instantiation.
        self.last_updated = self.created_at
