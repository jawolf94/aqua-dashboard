from sqlalchemy import Column, Integer, Float, TimeStamp
from .entity import Entity, Base

class Temperature(Entity, Base):
    
    __tablename__ = "temperature"

    timestamp = Column(TimeStamp)
    thermometer_number = Column(Integer)
    temperature = Column(Float)

    def __init__(self, timestamp, thermometer_number, temperature):
        # Init parent class
        Entity.__init__(self)

        # Set properties 
        self.timestamp = timestamp
        self.thermometer_number = thermometer_number
        self.temperature = temperature


