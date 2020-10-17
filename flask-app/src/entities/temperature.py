from sqlalchemy import Column, Float, Integer
from sqlalchemy.types import TIMESTAMP

from ..database import Base
from .entity import Entity


class Temperature(Entity, Base):
    """Class which defines schema for temperature table"""
    
    __tablename__ = "temperature"

    # Column Definitions
    timestamp = Column(TIMESTAMP, primary_key=True)
    thermometer_number = Column(Integer)
    temperature = Column(Float)

    def __init__(self, timestamp, thermometer_number, temperature):
        # Init parent class
        Entity.__init__(self)

        # Set properties 
        self.timestamp = timestamp
        self.thermometer_number = thermometer_number
        self.temperature = temperature
