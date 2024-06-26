""" Common helper functions to handle parameter data  """

from ..app_config import config

from ..alerts.text import send_param_alert
from ..proceedures.parameter_status import store_parameter_status

from .reading_validators import validate_parameters


def param_store_alert(reading):
    """ Checks if parameters from reading are in expected ranges.
        Results are stored and alerted on.

        reading (schema.reading.Reading) - Reading schema to check status of
    """

    # Check if parameters are in the expected range
    results = validate_parameters(reading, config["TANK_PARAMETERS"])

    try:
        # Store results
        inval_params = results["invalid_parameters"]
        store_parameter_status(reading['reading_id'], inval_params)

        # Alert on any out of range parameters if alerts are enabled
        if not results["valid"] and config["ALERTS"]["ENABLED"]:
            send_param_alert(results["invalid_parameters"], reading)

    except Exception as exc:
        # Catch & log on failure - do not interupt further execution
        print(exc)
