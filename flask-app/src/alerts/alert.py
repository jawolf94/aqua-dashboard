""" Functions in this file define all operations to create and send text messages"""

import smtplib, ssl
from threading import Thread

from ..app_config import config
from ..entities.text_alert import TextAlert
from ..proceedures.text_alerts import get_cleaning_subs, get_param_subs

def send_cleaning_alert(elapsed_days):
    """ Call to send an email alert when the tank has not been cleaned. 
        elapsed_days (int) - number of whole days since last cleaning
    """

    # Get list of cleaning alert subscribers
    text_subs = get_cleaning_subs()
    sub_emails = format_sub_emails(text_subs)

    # Format message
    message = format_cleaning_message(elapsed_days)

    # Send alert in another thread. Do not await
    thread = Thread(target=send_alert_message, args=(message, sub_emails))
    thread.start()
    

def send_param_alert(alert_params, param_values):
    """ Call to send an email alert when paramaters are out of range.

        alert_params([string]) - Array of paramater names currently out of range.
        param_values(entities.Reading) - Reading associated with alert_params.
    """

    # Get list of param alert subscribers & format emails
    param_subs = get_param_subs()
    sub_emails = format_sub_emails(param_subs)

    # Get formatted alert message
    message = format_param_message(alert_params, param_values)

    # Send alert in another thread. Do not await
    thread = Thread(target=send_alert_message, args=(message, sub_emails))
    thread.start()


def send_alert_message(message, recipient):
    """ Sends an email to the list of recipients.
        message (string) - message to send
        recipients ([string]) - list of recipient email addresses
    """

    # Take no action if list of recipients is empty
    if not recipients or len(recipients) <= 0:
        return

    # Get alert config valuse from app config
    alert_config = config["ALERTS"]

    smtp_server = alert_config["SMTP_SERVER"]
    sender_email = alert_config["SENDER_EMAIL"]
    sender_password = alert_config["PASSWORD"]

    # Attempt to send text message
    try:
        # Create secure SSL Context
        context = ssl.create_default_context()

        with smtplib.SMTP_SSL(smtp_server,context=context) as server:

            # Login to smtp server
            server.login(sender_email, sender_password)

            # Send message to all recipients
            server.sendmail(sender_email, recipients, message)

    except Exception as ex:
        # Log and take no action if send fails
        print(ex)
    

def format_cleaning_message(elapsed_days):
    """ Formats an email message for one or more out of range parameters.

        elapsed_days (int) - Number of days since the last cleaning

        returns (string) - Formatted message
    """

    # Define message body - incorrect tabbing is intended
    message = """Subject: TANK CLEANING ALERT

Your fish tank has not been cleaned in {0} day(s). Consider cleaning the tank today.
"""

    # Format message with variable text
    message = message.format(elapsed_days)

    return message


def format_param_message(alert_params, param_values):
    """ Formats an email message for one or more out of range parameters.

        alert_params([string]) - Array of paramater names currently out of range.
        param_values(entities.Reading) - Reading associated with alert_params.

        Returns (string) - Formatted message
    """
    # Define units of measurement for each label
    units = {
        "ammonia_ppm": "(ppm)",
        "nitrite_ppm": "(ppm)",
        "nitrate_ppm": "(ppm)",
        "ph": "",
        "temperature": "(F)"
    }

    # Define the message body - tabbing is intentional
    message="""Subject: TANK PARAMETER ALERT

The following tank parameters are outside of the ideal range:"""

    # Append out of range parameters and their values
    for param in alert_params:

        # Make the param value title case with no trailing unit labels
        name = param.replace("_ppm","").title()

        # Get value of paramater as string
        value = ""
        if param in param_values:
            value = str(param_values[param])

        # Find units of measurement
        unit = ""
        if param in units:
            unit = units[param]

        # Append to message
        message = message + "\n\t\t" + name +": " + value + " " + unit

    return message


def format_sub_emails(subscribers):
    """ Generates email addresses from a list of TextAlerts

        subscribers ([entities.TextAlert]) - List of TextAlert entities used to generate emails

        returns ([string]) - Email addresses of the alert recipients 
    """

    # List of email addresses
    emails = []

    # Format emails from list of subscribers
    for sub in subscribers:
        email = sub.cell_number + sub.provider
        emails.append(email)

    return emails
