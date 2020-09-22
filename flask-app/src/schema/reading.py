from marshmallow import Schema, fields
from sqlalchemy.inspection import inspect

from ..entities import Reading
from ..proceedures import get_latest_readings


class ReadingSchema(Schema):
    """Class which defines a template for serialization of tank reading data"""

    # Field definitions for serialization
    timestamp = fields.DateTime()
    ammonia_ppm = fields.Float()
    nitrite_ppm = fields.Float()
    nitrate_ppm = fields.Float()
    ph = fields.Float()
    temperature = fields.Float()
    manual = fields.Integer()


def complete_reading_schema(schema):
    """ Fills in blank values from a schema with the most recent readings.

        schema (schema.reading) - Schema representing a tank reading.
        returns (schema.reading) - Enitity representing a tank reading
    """

    # Get the most recent reading
    readings = get_latest_readings(1)

    # Check if reading was returned
    if len(readings) > 0:
        # Remove from list
        last_reading = readings[0]
    else:
        # Create dummy reading if no reading exists in table
        last_reading = Reading(None, None, None, None, None, None, None)

    # Check expected columns for existance in schema
    for column in inspect(last_reading).attr:
        # check for value in schema
        if column.key not in schema.keys():
            schema[column] = column.value

    return schema
