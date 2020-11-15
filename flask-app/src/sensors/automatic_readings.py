from datetime import datetime, timezone
from marshmallow import EXCLUDE

from ..app_config import config
from ..parameter_config import tank_parameters
from ..entities.reading import Reading
from ..proceedures.parameter_status import store_parameter_status
from ..proceedures.tank_readings import save_reading
from ..schema.reading import ReadingSchema, complete_reading_schema
from ..validators.reading_validators import check_parameters
from .temp_io import TempIO

sensor_config = config["READINGS"]["SENSORS"]

# Set-Up enabled sensor drivers.
TempSensor = None
if sensor_config["TEMPERATURE"]:
    try:
        # Attept to init temp sensor
        TempSensor = TempIO()

    except Exception as err:
        # Ensure TempSensor is not pointing to an object on failure.
        print(err)
        TempSensor = None

def create_reading():
    """
    Creates a reading using connected sensors. 
    Missing values are filled in from previous reading and saved to table.
    """
    # Create a new empty reading.
    reading = {}
    reading_schema = ReadingSchema()

    # Get readings from connected sensors.
    if sensor_config["TEMPERATURE"] and TempSensor is not None:
        try:
            reading["temperature"] = TempSensor.read_temp()
        except (BufferError, FileNotFoundError) as err:
            print(err)

    # Create new reading
    reading_schema = reading_schema.dump(reading)
    reading_schema = complete_reading_schema(reading)

    # Save reading to data base.
    reading_entity = Reading(**reading_schema, manual=0, timestamp=datetime.now(tz=timezone.utc))
    save_reading(reading_entity)

    # Check paramater ranges
    results = check_parameters(reading, tank_parameters)
    store_parameter_status(reading_entity.id, results["invalid_parameters"])
