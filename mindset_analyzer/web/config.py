import os

class Config:
    """Base configuration."""
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-please-change-in-production'
    
    # Database settings
    DATABASE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'mindset_data.db')
    
    # Model settings
    MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
    
    # Data collection settings
    DATA_COLLECTION_INTERVAL = 3600  # 1 hour in seconds
    MAX_DATA_POINTS = 1000
    
    # Analysis settings
    ANALYSIS_WINDOW = 7  # days
    MIN_CORRELATION_THRESHOLD = 0.3
    
    # API settings
    API_RATE_LIMIT = '100 per minute'
    
    # Logging settings
    LOG_LEVEL = 'INFO'
    LOG_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs', 'app.log')

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    TESTING = False
    
    # Override any development-specific settings here
    LOG_LEVEL = 'DEBUG'

class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    DEBUG = True
    
    # Use in-memory database for testing
    DATABASE_PATH = ':memory:'
    
    # Disable rate limiting for testing
    API_RATE_LIMIT = None

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    TESTING = False
    
    # Override any production-specific settings here
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    # Enable rate limiting
    API_RATE_LIMIT = '50 per minute'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
} 