""" Defines functions to verify tank reading data """


def validate_parameters(reading, expected_vals):
    """ Validates if a reading's paramaters fall within an expected range

        reading (schema.Reading) - The reading to be verified

        expected_vals - Dictionary of min/max values for parameters

        save (bool) - Saves the validation to the DB when True

        alert (bool) - Alerts on invalid values when True. App config must
        also be true.

        returns - Dictionary with two keys describing outcome of verification
            "valid" - True if all parameters fall within the expected range
            "invaid_paramters" - List with strings representing parameters out
            of range
    """

    # Assume reading is valid
    result = {
        "valid": True,
        "invalid_parameters": []
    }

    # Loop through all parameters in the reading
    for parameter in reading:
        # Make string uppercase to match config
        upr_param = parameter.upper()

        # Check if reading value has expected bounds
        if upr_param in expected_vals and reading[parameter] is not None:

            # Get expected bounds
            min_val = expected_vals[upr_param]["MIN"]
            max_val = expected_vals[upr_param]["MAX"]

            # Fail validation parameter falls outside of range
            param_val = reading[parameter]
            if param_val < min_val or param_val > max_val:
                result["valid"] = False
                result["invalid_parameters"].append(parameter)

    # Return results of check
    return result
