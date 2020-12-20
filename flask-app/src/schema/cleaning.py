from marshmallow import Schema, fields


class CleaningSchema(Schema):
    """ Represents a single tank cleaning log entry"""

    # Schema field definitions
    id = fields.Integer()
    timestamp = fields.DateTime(required=True)
    pct_change = fields.Float(required=True)
    filter_change = fields.Boolean(required=True)
