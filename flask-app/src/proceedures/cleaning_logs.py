"""Proccedures to read/write from cleaning_logs table"""

from ..database import Base, Session
from ..entities.cleaning import Cleaning

def add_cleaning_log_entry(cleaning):
    """ Adds a new row to the cleaning_logs table. Row represents a single tank cleaning

        cleaning (enities.cleaning.Cleaning) - Cleaning to be inserted into the table
    """

    # Get a new session with the SQL DB
    session = Session()

    # Add and commit cleaning data
    session.add(cleaning)
    session.commit()

    # Close session before exiting
    session.close()