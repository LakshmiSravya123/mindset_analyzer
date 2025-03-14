"""
Web package for the mindset analyzer application.
""" 

from flask import Flask
from .routes import dashboard

def create_app():
    app = Flask(__name__)
    
    # Register blueprints
    app.register_blueprint(dashboard)
    
    return app 

# Web package initialization 

# This file makes the web directory a Python package 