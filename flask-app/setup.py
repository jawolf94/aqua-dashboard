from setuptools import find_packages, setup

setup(
    name='src',
    version='1.0.0',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        "apscheduler",
        "flask",
        "flask-cors",
        "marshmallow",
        "pytz",
        "sqlalchemy"
    ],
)