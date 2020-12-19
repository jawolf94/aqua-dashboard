from sqlalchemy import Column, Integer
from sqlalchemy.types import Boolean, Text

from ..database import Base
from .entity import Entity

class TextAlert(Base, Entity):
    """ Defines a row in the text_alerts table"""

    __tablename__ = "text_alerts"

    # Column definitions
    id = Column(Integer, primary_key=True)
    cell_number = Column(Text, nullable=False)
    provider = Column(Text, nullable=False)
    param_alerts = Column(Boolean)
    cleaning_alerts = Column(Boolean)

    def __init__(self, cell_number, provider, param_alerts, cleaning_alerts):
        # Init parent class
        Entity.__init__(self)

        # Set instance vars for this this entity
        self.cell_number = cell_number
        self.provider = provider
        self.param_alerts = param_alerts
        self.cleaning_alerts = cleaning_alerts
