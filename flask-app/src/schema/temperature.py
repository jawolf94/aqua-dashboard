
from marshmallow import Schema, fields


class TemperatureSchema(Schema):
    """Defines template for serialization of Temperature Data"""
    timestamp = fields.DateTime()
    thermometer_number = fields.Integer()
    temperature = fields.Float()
