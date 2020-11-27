""" Read/Write operations performed on the text_alerts table"""

from ..database import Session
from ..entities.text_alert import TextAlert

def get_cleaning_subs():
    """
        Returns all rows from the text_alerts table which have subscribed 
        to cleaning alerts.

        Returns ([entities.text_alert]) - Array of subscribers
    """

    # Create a new session with the DB
    session = Session()

    # Query for rows where param_alerts is True (1)
    subscribers = session.query(TextAlert).\
        filter(TextAlert.cleaning_alerts == True).\
        all()

    # Close session before returning
    session.close()

    # Return array
    return subscribers

def get_param_subs():
    """
        Returns all rows from the text_alerts table which have subscribed 
        to paramter status alerts.

        Returns ([entities.text_alert]) - Array of subscribers
    """

    # Create a new session with the DB
    session = Session()

    # Query for rows where param_alerts is True (1)
    subscribers = session.query(TextAlert).\
        filter(TextAlert.param_alerts == True).\
        all()

    # Close session before returning
    session.close()

    # Return array
    return subscribers
