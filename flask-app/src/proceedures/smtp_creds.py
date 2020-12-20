""" Read/Write operations for the smpt_creds table """

from ..database import Session
from ..entities.smtp_creds import SMTPCred


def get_creds(name):
    """
        Get the credentials for the smtp set-up matching name

        name (string) - smpt config name

        returns (entities.smtp_cred.SMTPCred) - Credentials matching name

    """

    # Create a new session with the db
    session = Session()
    creds = None

    # Attempt to retreive credentials
    try:

        # Query table for matching credentials
        creds = session.query(SMTPCred).\
            filter(SMTPCred.name == name).\
            one_or_none()

    finally:
        # Always close the session
        session.close()

    return creds
