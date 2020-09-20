from marshmallow import Schema, fields

"""Class which defines a template for serialization of tank reading data"""
class ReadingSchema(Schema):
    
    #Field definitions for serialization
    timestamp = fields.DateTime()
    ammonia_ppm = fields.Float()
    nitrite_ppm = fields.Float()
    nitrate_ppm = fields.Float()
    ph = fields.Float()
    temperature = fields.Float()
    manual = fields.Integer()
