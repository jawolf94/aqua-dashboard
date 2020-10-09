from sqlalchemy import Column, Float, Integer
from sqlalchemy.types import TIMESTAMP

from .entity import Base, Entity

class Reading(Base, Entity):
    """Class which defines schema for tank_readings table"""

    __tablename__ = "tank_readings"

    # Column Definitions
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(TIMESTAMP)
    ammonia_ppm = Column(Float)
    nitrite_ppm = Column(Float)
    nitrate_ppm = Column(Float)
    ph = Column(Float)
    temperature = Column(Float)
    manual = Column(Integer)


    def __init__(self, timestamp, ammonia_ppm, nitrite_ppm, nitrate_ppm, ph, temperature, manual):
        # Initalize parent class
        Entity.__init__(self)

        # Set values in schema
        # Note: ID autoincrements so it is not set.
        self.timestamp = timestamp
        self.ammonia_ppm = ammonia_ppm
        self.nitrite_ppm = nitrite_ppm
        self.nitrate_ppm = nitrate_ppm
        self.ph = ph
        self.temperature = temperature
        self.manual = manual
