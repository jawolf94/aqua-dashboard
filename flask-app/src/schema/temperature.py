
from marshmallow import Schema, fields

"""Defines template for serialization of Temperature Data"""
class TemperatureSchema(Schema):
    timestamp = fields.DateTime()
    thermometer_number = fields.Integer()
    temperature = fields.Float()
    