import os

class TempIO:

    """ Initalizes Temp IO Class"""
    def __init__(self):
        # Load drivers for DB18B20
        os.system('modprobe w1-gpio')
        os.system('modprobe w1-therm')

        # File where sensor data is written
        self.therm_driver = '/sys/bus/w1/devices/28-0301a2795434/w1_slave'

    """ Reads raw data from w1_driver"""
    def __read_temp_raw(self):
        # Open files and get all lines
        f = open(self.therm_driver, 'r')
        lines = f.readlines()

        # Close file and return lines
        f.close()
        return lines

    """ Reads temperature data from raw data.
        Temperature value is returned in Fahrenheit
    """
    def read_temp(self):

        # Read current data in file
        lines = self.__read_temp_raw()

        # Check if last reading from thermometer was successful
        # The last 3 characters of the first line are 'YES' when reading is successful
        if lines[0].strip()[-3:] == 'YES':

             # Check if temp data is present from last reading
            has_temp = lines[1].find('t=')
            if(has_temp != -1):

                # Get temp from second line starting after 't=' to EOL
                temp = lines[1].strip()[has_temp +2:]

                # Convert raw data to Celcius
                temp = float(temp)/ 1000.0

                # Convert to Fahrenheit
                temp = temp * (9.0/5.0) + 32.0

                return temp
        else:
            raise BufferError
