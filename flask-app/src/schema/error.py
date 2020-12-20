from marshmallow import Schema, fields


class ErrorSchema(Schema):
    """ Defines a schema to serialize/deserialize error information """

    # Field definitions
    message = fields.String()
    exception = fields.String()
