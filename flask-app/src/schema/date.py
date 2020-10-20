from marshmallow import fields, Schema

class DateSchema(Schema):
    "Defines schema for serializing date range requests"

    # Feild definitions
    datetime = fields.DateTime(required=True)