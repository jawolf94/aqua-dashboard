from marshmallow import fields, Schema

class ParameterStatusSchema(Schema):
    """ Class which defines a template for serializaton of paramater_status data"""

    # Field definitions for serialization
    reading_id = fields.Integer()
    ammonia_ppm = fields.Integer()
    nitrite_ppm = fields.Integer()
    nitrate_ppm = fields.Integer()
    ph = fields.Integer()
    temperature = fields.Integer()
