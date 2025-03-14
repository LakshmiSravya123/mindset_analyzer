# Mindset Analyzer

A comprehensive web application for analyzing and tracking human mental states using machine learning and data analytics.

## Features

- Real-time mental state tracking
- Data collection from various sources
- Machine learning-based analysis
- Interactive dashboard with visualizations
- Personalized insights and recommendations
- Historical pattern analysis
- Correlation analysis between different factors

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mindset_analyzer.git
cd mindset_analyzer
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Project Structure

```
mindset_analyzer/
├── data/               # Data storage
├── models/            # Trained models
├── logs/              # Application logs
├── web/               # Web application
│   ├── static/       # Static files (CSS, JS)
│   ├── templates/    # HTML templates
│   ├── routes.py     # Flask routes
│   ├── app.py        # Flask application
│   └── config.py     # Configuration
├── data_collection/   # Data collection modules
├── model_training/    # Model training modules
├── analysis/         # Analysis modules
├── tests/            # Test files
├── requirements.txt  # Dependencies
└── README.md        # Documentation
```

## Usage

1. Start the development server:
```bash
python -m web.app
```

2. Access the dashboard at `http://localhost:5000`

3. The dashboard will show:
   - Current mental state metrics
   - Daily patterns visualization
   - Correlation analysis
   - Personalized insights
   - Actionable recommendations

## API Endpoints

- `GET /api/dashboard-data`: Get current dashboard data
- `POST /api/refresh-data`: Refresh dashboard data
- `GET /api/insights`: Get personalized insights
- `GET /api/recommendations`: Get recommendations

## Development

1. Run tests:
```bash
pytest
```

2. Format code:
```bash
black .
isort .
```

3. Check code style:
```bash
flake8
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Flask web framework
- TensorFlow for machine learning
- Chart.js for visualizations
- Bootstrap for UI components

## Support

For support, please open an issue in the GitHub repository or contact the maintainers. 