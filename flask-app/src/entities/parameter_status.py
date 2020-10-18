from sqlalchemy import Column, Integer
from sqlalchemy.types import Boolean

from ..database import Base
from .entity import Entity

class ParameterStatus(Base, Entity):
    """Class which defines schema for the parameter_status table"""

    __tablename__ = "parameter_status"

    # Column definitions
    reading_id = Column(Integer, primary_key=True)
    ammonia_ppm = Column(Boolean)
    nitrite_ppm = Column(Boolean)
    nitrate_ppm = Column(Boolean)
    ph = Column(Boolean)
    temperature = Column(Boolean)

    def __init__(self, reading_id, ammonia_ppm, nitrite_ppm, nitrate_ppm,  ph, temperature):
        # Init parent class
        Entity.__init__(self)

        # Set instance vars for this this entity
        self.reading_id = reading_id
        self.ammonia_ppm = ammonia_ppm
        self.nitrite_ppm = nitrite_ppm
        self.nitrate_ppm = nitrate_ppm
        self.ph = ph
        self.temperature = temperature
