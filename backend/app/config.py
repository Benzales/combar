import os

class Config(object):
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://localhost/db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
