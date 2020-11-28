from flask import jsonify

from ..schema.error import ErrorSchema

def handle_error(error, code = 500, message="Your request could not be completed. Please try again later."):
    """ Generates a response for endpoints when an error occurs

        error (Exception) - Exception caught by caller.
        code (int) - error code to emit. 
        message (string) - Optional. User friendly message for Client App.

        returns (ErrorSchema, Code) - Tuple of ErrorSchema and response code for http response
    """

    # Convert error into string
    error_string = str(error)

    # Create objext to load into schema
    error_obj = {
        "exception": error_string,
        "message": message
    }

    # Package into ErrorSchema
    error_schema = ErrorSchema()
    error_schema = error_schema.dump(error_obj)

    # Return tuple
    return jsonify(error_schema), code
