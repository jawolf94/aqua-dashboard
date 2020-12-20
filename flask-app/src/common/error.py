from flask import jsonify

from ..schema.error import ErrorSchema


def handle_error(error, code=500, message=None):

    """ Generates a response for endpoints when an error occurs

        error (Exception) - Exception caught by caller.

        code (int) - error code to emit.

        message (string) - Optional. User friendly message for Client App.

        returns (ErrorSchema, Code) - Tuple of ErrorSchema and response code
        for http response
    """

    # Set default error message if none was passed
    if message is None:
        message = "Error: An unknown error occurred. "
        message = message + "Please retry your request."

    # Convert error into string
    error_string = str(error)

    # Create object to load into schema
    error_obj = {
        "exception": error_string,
        "message": message
    }

    # Package into ErrorSchema
    error_schema = ErrorSchema()
    error_schema = error_schema.dump(error_obj)

    # Return tuple
    return jsonify(error_schema), code
