from .entities.entity import Session, engine, Base
from .entities.temperature import Temperature

# Generate DB Schema
Base.metadata.create_all(engine)

# Start session with DB
session = Session()

# Get existing data
temperatures = session.query(Temperature).all()

# Print Data
print("***** Tempertaure Readings: ")
for reading in temperatures:
    print(f'({reading.timestamp}) {reading.thermometer_number} |{reading.temperature}')