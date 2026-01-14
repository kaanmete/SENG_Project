import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'safe-and-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql:///schema.sql'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True