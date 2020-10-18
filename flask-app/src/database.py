from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from .app_config import config

# Get Database config from current_app
db_config = config["DATABASE"]
db_path = db_config["DB_URL"] + db_config["DB_NAME"]

# Instantiate DB Engine (SQL Pool & Dialect)
Engine = create_engine(db_path)

# Create Session Class
Session = sessionmaker(bind=Engine, expire_on_commit=False)

# Create Base Class to enable field declartions
Base = declarative_base()