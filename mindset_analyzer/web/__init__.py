"""
Web interface for the Mindset Analyzer
""" 

from flask import Flask
from .routes import dashboard

def create_app():
    app = Flask(__name__)
    
    # Register blueprints
    app.register_blueprint(dashboard)
    
    return app 

# Web package initialization 