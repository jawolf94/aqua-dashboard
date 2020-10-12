# Defines all proccedures that read and write data to tank_readings SQL Table
from ..database import DB
from ..entities.reading import Reading


def get_latest_readings(num_readings=None):
    """ Returns a query of Reading Entites from tank_readings table

            num_readings (int) - Number of readings to return. If None, return
            all readings

            returns - Query results consisting of Reading Entities
    """

    # Create session with SQL DB
    session = DB.Session()

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

    # Close session before returning
    session.close()

    # Return query results
    return reading_objs


def save_reading(reading):
    """ Saves a tank reading as a row in the tank_readings table

        reading (entity.reading) - Reading entity to save to table
    """

    # Create new session the add reading
    session = DB.Session()
    session.add(reading)
    session.commit()
    session.close()
