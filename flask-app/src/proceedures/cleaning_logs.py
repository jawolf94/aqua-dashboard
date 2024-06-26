"""Proccedures to read/write from cleaning_logs table"""

from ..database import Session
from ..entities.cleaning import Cleaning


def add_cleaning_log_entry(cleaning):
    """ Adds a new row to the cleaning_logs table.
        A row represents a single tank cleaning.

        cleaning (enities.cleaning.Cleaning) - Cleaning to be inserted into
        the table.
    """

    # Get a new session with the SQL DB
    session = Session()

    try:

        # Add and commit cleaning data
        session.add(cleaning)
        session.commit()

    finally:
        # Always close the session before exiting
        session.close()


def get_cleaning_logs(num_cleanings=None):
    """ Retrieves all rows from cleaning_log table.

        Returns ([entities.cleaning.Cleaning]) - Cleaning entities
        each representing a row.
    """

    # Get a new session with SQL DB
    session = Session()
    cleaning_objs = []

    try:

        # Get all rows sorted in desc order
        cleaning_objs = session.query(Cleaning).\
            order_by(Cleaning.timestamp.desc())

        # Limit query if specified.
        if num_cleanings is not None:
            cleaning_objs = cleaning_objs.limit(num_cleanings)

        cleaning_objs = cleaning_objs.all()

    finally:
        # Always close the session even on excpetion
        session.close()

    # Return cleaning log rows
    return cleaning_objs
