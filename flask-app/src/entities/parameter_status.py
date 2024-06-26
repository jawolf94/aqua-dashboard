from sqlalchemy import Column, Integer
from sqlalchemy.types import Boolean

from ..database import Base
from .entity import Entity


class ParameterStatus(Base, Entity):
    """Class which defines schema for the parameter_status table"""

    __tablename__ = "parameter_status"

    # Column definitions
    reading_id = Column(Integer, primary_key=True)
    ammonia_ppm = Column(Boolean, nullable=False)
    nitrite_ppm = Column(Boolean, nullable=False)
    nitrate_ppm = Column(Boolean, nullable=False)
    ph = Column(Boolean, nullable=False)
    temperature = Column(Boolean, nullable=False)

    def __init__(self, reading_id, ammonia, nitrite, nitrate, ph, temperature):

        # Init parent class
        Entity.__init__(self)

        # Set instance vars for this this entity
        self.reading_id = reading_id
        self.ammonia_ppm = ammonia
        self.nitrite_ppm = nitrite
        self.nitrate_ppm = nitrate
        self.ph = ph
        self.temperature = temperature
