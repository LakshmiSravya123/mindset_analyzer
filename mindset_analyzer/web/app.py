from flask import Flask
from mindset_analyzer.web.routes import dashboard

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    
    # Configure app
    app.config.update(
        SECRET_KEY='dev',
        DEBUG=True,
        DATABASE_URL='sqlite:///mindset.db'
    )
    
    # Register blueprints
    app.register_blueprint(dashboard)
    
    # Initialize extensions
    init_extensions(app)
    
    return app

def init_extensions(app):
    """Initialize Flask extensions."""
    # Add any Flask extensions here
    pass

# Create the application instance
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True) 