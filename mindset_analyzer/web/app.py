from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from mindset_analyzer.web.routes import dashboard
import json
import random
from datetime import datetime
import threading
import time

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
    socketio = SocketIO(app)
    
    # Simulated data generation
    def generate_live_data():
        while True:
            data = {
                'timestamp': datetime.now().strftime('%H:%M:%S'),
                'mindset_score': random.randint(70, 100),
                'focus_level': random.randint(60, 95),
                'energy_level': random.randint(50, 90),
                'stress_level': random.randint(20, 60),
                'mood': random.choice(['Positive', 'Neutral', 'Focused', 'Energetic'])
            }
            socketio.emit('live_data_update', data)
            time.sleep(3)  # Update every 3 seconds
    
    @socketio.on('connect')
    def handle_connect():
        print('Client connected')
        emit('connected', {'data': 'Connected to server'})
    
    @socketio.on('disconnect')
    def handle_disconnect():
        print('Client disconnected')

# Create the application instance
app = create_app()

if __name__ == '__main__':
    # Start the data generation thread
    data_thread = threading.Thread(target=generate_live_data)
    data_thread.daemon = True
    data_thread.start()
    
    app.run(host='0.0.0.0', port=5001, debug=True) 