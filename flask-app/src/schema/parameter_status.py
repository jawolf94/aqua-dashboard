from marshmallow import Schema, fields

class ParameterStatusSchema(Schema):
    """ Class which defines a template for serializaton of paramater_status data"""

    # Field definitions for serialization
    reading_id = fields.Integer()
    ammonia_ppm = fields.Boolean(required=True)
    nitrite_ppm = fields.Boolean(required=True)
    nitrate_ppm = fields.Boolean(required=True)
    ph = fields.Boolean(required=True)
    temperature = fields.Boolean(required=True)
