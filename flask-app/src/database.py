from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from .app_config import config

class DataBase():

    def __init__(self, db_config):      
        # Get Database config from current_app
        db_path = db_config["DB_URL"] + db_config["DB_NAME"]

        # Instantiate DB Engine (SQL Pool & Dialect)
        self.engine = create_engine(db_path)

        # Create Session Class
        self.Session = sessionmaker(bind=self.engine, expire_on_commit=False)

        # Create Base Class to enable field declartions
        self.Base = declarative_base()

        global DB
        DB = self 

DB = DataBase(config["DATABASE"])