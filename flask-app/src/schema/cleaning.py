from marshmallow import fields, Schema

class CleaningSchema(Schema):
    """ Represents a single tank cleaning log entry"""

    # Schema field definitions
    id = fields.Integer()
    timestamp = fields.DateTime()
    pct_change = fields.Float()
    filter_change = fields.Boolean()