from sqlalchemy import Column
from sqlalchemy.types import Text

from ..database import Base
from .entity import Entity

class SMTPCred(Base, Entity):
    """ Defines a single row in the credentials table """

    __tablename__ = "smtp_creds"

    # Column Definitions
    name = Column(Text, primary_key=True)
    server = Column(Text, nullable=False)
    sender_email = Column(Text, nullable=False)
    password = Column(Text, nullable=False)

    def __init__(self, name, server, sender, password):
        # Init parent class
        Entity.__init__(self)

        # Init column values
        self.name = name
        self.server = server
        self.sender_email = sender
        self.password = password


