from marshmallow import fields, Schema

class ParameterStatusSchema(Schema):
    """ Class which defines a template for serializaton of paramater_status data"""

    # Field definitions for serialization
    reading_id = fields.Integer()
    ammonia_ppm = fields.Boolean()
    nitrite_ppm = fields.Boolean()
    nitrate_ppm = fields.Boolean()
    ph = fields.Boolean()
    temperature = fields.Boolean()
