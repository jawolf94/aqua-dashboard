# Defines all proceedures to read and write data for the parameter_status table
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound

from ..entities.parameter_status import ParameterStatus 
from ..database import Session

def store_parameter_status(reading_id, invalid_params=[]):
    """
        Stores status of parameters for a given reading. Parameter is stored as 1 if valid, 0 otherwise

        reading_id (int) - ID of the reading for which the status is being stored
        invalid_params (String array) - Array of parameters as stings which are invalid. Defaults to an empty array.  
    """

    # Set parameter based on inclusion in list
    ammonia_ppm = int(not "ammonia_ppm" in invalid_params)
    nitrite_ppm = int(not "nitrite_ppm" in invalid_params)
    nitrate_ppm = int(not "nitrate_ppm" in invalid_params)
    ph = int(not "ph" in invalid_params)
    temperature = int(not "temperature" in invalid_params)

    # Create new Parameter Status Entity
    status = ParameterStatus(reading_id, ammonia_ppm, nitrite_ppm, nitrate_ppm, ph, temperature)

    # Create Session and store in table
    session = Session()
    session.add(status)
    session.commit()
    session.close()

def read_parameter_status(reading_id):
    """
        Retreives the paramater statuses for the reading with the specified ID.

        reading_id (int) - id used to retreive matching parameter status.

        returns (entites.ParameterStatus) - The ParamaterStatus for the given reading.
    """

    # Create Session
    session = Session()

    try:
        # Query for matching reading_id
        status = session.query(ParameterStatus).\
            filter(ParameterStatus.reading_id == reading_id).\
            one()
    except NoResultFound:
        # Return no results to the user if nothing could be found
        return None

    except MultipleResultsFound:
        # Return Error if multiple results match the reading_id.
        raise LookupError()

    # Close session before returning
    session.close()

    # Return result
    return status
