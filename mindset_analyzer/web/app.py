from flask import Flask
from .routes import dashboard

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# Register the dashboard blueprint
app.register_blueprint(dashboard)

if __name__ == '__main__':
    app.run(debug=True, port=5002) 