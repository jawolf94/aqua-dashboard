from sqlalchemy import Column, Float, Integer
from sqlalchemy.types import TIMESTAMP, Boolean

from ..database import Base
from .entity import Entity

class Cleaning(Base, Entity):
    """Entity representing a single row in the cleaning_log table"""

    __tablename__="cleaning_logs"

    # Column definitions
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(TIMESTAMP, nullable=False)
    pct_change = Column(Float, nullable=False)
    filter_change = Column(Boolean, nullable=False)

    def __init__(self, timestamp, pct_change, filter_change):

        # Initalize parent class
        Entity.__init__(self)

        # Initalize cleaning data
        # Note: ID is auto incremented and not set here
        self.timestamp = timestamp
        self.pct_change = pct_change
        self.filter_change = filter_change
