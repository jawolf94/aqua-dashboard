# Defines all proccedures that read and write data to tank_readings SQL Table
from ..database import Base, Session
from ..entities.reading import Reading


def get_latest_readings(num_readings=None):
    """ Returns a query of Reading Entites from tank_readings table

            num_readings (int) - Number of readings to return. If None, return
            all readings

            returns - Query results consisting of Reading Entities
    """

    # Create session with SQL DB
    session = Session()

    try:

        if num_readings is None:
            # Gets all readings
            reading_objs = session.query(Reading).\
                order_by(Reading.timestamp.desc()).\
                all()

        else:
            # Gets specified number of readings from most recent entries
            reading_objs = session.query(Reading).\
                order_by(Reading.timestamp.desc()).\
                limit(num_readings).all()

    finally:
        # Close session before returning
        session.close()

    # Return query results
    return reading_objs

def get_readings_between(start, end=None):
    """ Gets all readings between given timestamps.
        If no end time is given func will return all readings from start to latest.

        start (datetime.datetime): All returned readings will occur on or after this time.
        end (datetime.datetime): All returned readings will occur on or before this time.
    """

    # Create a session with SQL DB
    session = Session()
    reading_objs = []

    try:
        if end is not None:
            # Get all readings stored between start and end (inclusive)
            reading_objs = session.query(Reading).\
                filter(Reading.timestamp >= start, Reading.timestamp <= end).\
                order_by(Reading.timestamp.asc()).\
                all()

        elif start is not None:
            # Get all readings stored from start (inclusive) onward
            reading_objs = session.query(Reading).\
                filter(Reading.timestamp >= start).\
                order_by(Reading.timestamp.asc()).\
                all()
    finally:
        # Always close session
        session.close()

    # Return retrieved readings
    return reading_objs

def save_reading(reading):
    """ Saves a tank reading as a row in the tank_readings table

        reading (entity.reading) - Reading entity to save to table
    """

    # Create new session
    session = Session()

    try:
        # Add reading to DB
        session.add(reading)
        session.commit()

    finally:
        # Always close the session
        session.close()
