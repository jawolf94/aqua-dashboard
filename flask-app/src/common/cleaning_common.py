from datetime import datetime, timezone

from ..app_config import config

from ..alerts.text import send_cleaning_alert
from ..proceedures.cleaning_logs import get_cleaning_logs


def alert_last_cleaning():
    """ A function to check when the last tank cleaning was performed
        and trigger an alert if greater than the threshold specified
        by the app's config
    """

    # Get latest cleaning from the DB
    latest_cleaning = get_cleaning_logs(1)

    # Don't send an alert if no cleanings were logged for this tank
    if len(latest_cleaning) <= 0:
        return

    # Check how many days have passed since the latest cleaning
    latest_cleaning = latest_cleaning[0]
    now = datetime.now(tz=timezone.utc)

    days_passed = now - latest_cleaning.timestamp.replace(tzinfo=timezone.utc)
    days_passed = days_passed.days

    # Alert if number of days passed is at or more than the threshold
    if days_passed >= config["TANK_PARAMETERS"]["CLEANING_TIME"]:
        send_cleaning_alert(int(days_passed))
