from sqlalchemy import Column, Integer
from .entity import Base, Entity

def ParameterStatus(Base, Entity):
    """Class which defines schema for the parameter_status table"""

    __tablename__ = "parameter_status"

    # Column definitions
    reading_id = Column(Integer, primary_key=True)
    ammonia_ppm = Column(Integer, primary_key=True)
    nitrite_ppm = Column(Integer, primary_key=True)
    nitrate_ppm = Column(Integer, primary_key=True)
    ph = Column(Integer, primary_key=True)
    temperature = Column(Integer, primary_key=True)

    def __init__(self, reading_id, ammonia_ppm, nitrite_ppm, ph, temperature):
        # Init parent class
        Entity.__init__(self)

        # Set instance vars for this this entity
        self.reading_id = reading_id
        self.ammonia_ppm = ammonia_ppm
        self.nitrite_ppm = nitrite_ppm
        self.nitrate_ppm = nitrate_ppm
        self.ph = ph
        self.temperature = temperature
