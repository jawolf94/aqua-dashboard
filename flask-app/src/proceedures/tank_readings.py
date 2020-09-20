# Defines all proccedures that read and write data to tank_readings SQL Table
from ..entities.entity import Session
from ..entities.reading import Reading

def get_latest_readings(num_readings=None):
    """ Returns a query of Reading Entites from tank_readings table
            num_readings (int) - Number of readings to return. If None, return all readings
            returns - Query results consisting of Reading Entities
    """

    # Create session with SQL DB
    session = Session()

    if num_readings == None:
        # Gets all readings
        reading_objs = session.query(Reading).all()
    else:
        # Gets specified number of readings
        reading_objs = session.query(Reading).sort_by(Reading.timestamp.desc()).limit(num_readings)

    # Close session before returning
    session.close() 

    # Return query results
    return reading_objs
    