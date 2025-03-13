# Mindset Analyzer

An AI-powered project that analyzes and predicts human mindset patterns throughout a day using various data points and machine learning techniques.

## Project Overview

This project aims to understand and predict human mindset patterns by analyzing various data points collected throughout the day, including:
- Activity levels
- Social interactions
- Physiological data
- Environmental factors
- Time-based patterns

## Features

- Data collection from multiple sources
- Real-time mindset analysis
- Pattern recognition
- Predictive modeling
- Visualization of mindset patterns

## Process Overview

The Mindset Analyzer works through three main stages:

### 1. Data Collection
The system collects various data points throughout the day:

#### Activity Data
- Steps count
- Movement levels
- Exercise minutes
- Physical activity patterns

#### Social Data
- Number of social interactions
- Message frequency
- Social media usage
- Communication patterns

#### Physiological Data
- Heart rate
- Stress levels
- Sleep quality
- Physical well-being indicators

#### Environmental Data
- Temperature
- Humidity
- Light levels
- Environmental conditions

#### Mindset Data
- Mood scores
- Energy levels
- Focus levels
- Stress levels

### 2. Model Training
The system uses a deep learning approach with LSTM (Long Short-Term Memory) neural networks:

#### Data Preparation
- Combines all collected features
- Normalizes data using StandardScaler
- Creates sequences of 24-hour data points
- Splits data into training and validation sets

#### Model Architecture
```
Input Layer (24 hours × number of features)
    ↓
LSTM Layer (128 units, return sequences)
    ↓
Dropout Layer (0.2)
    ↓
LSTM Layer (64 units)
    ↓
Dropout Layer (0.2)
    ↓
Dense Layer (32 units, ReLU)
    ↓
Output Layer (4 units, Sigmoid)
    - Mood score
    - Energy level
    - Focus level
    - Stress level
```

#### Training Process
- Uses Adam optimizer
- Mean Squared Error loss function
- Batch size: 32
- Validation split: 20%
- Early stopping to prevent overfitting

### 3. Analysis and Visualization
The system provides comprehensive analysis through:

#### Pattern Visualization
- Time-series plots for each metric
- Daily pattern analysis
- Trend identification
- Anomaly detection

#### Correlation Analysis
- Heatmap visualization of feature correlations
- Identification of key influencing factors
- Understanding relationships between different metrics

#### Insights Generation
- Statistical analysis of patterns
- Key metrics calculation
- Trend identification
- Pattern recognition

## Requirements

- Python 3.8+
- Required packages listed in requirements.txt

## Installation

1. Clone the repository
```bash
git clone https://github.com/LakshmiSravya123/mindset_analyzer.git
cd mindset_analyzer
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

1. Run the data collection script:
```bash
python collect_data.py
```

2. Train the model:
```bash
python train_model.py
```

3. Analyze mindset patterns:
```bash
python analyze_mindset.py
```

## Project Structure

- `collect_data.py`: Data collection module
- `train_model.py`: Model training module
- `analyze_mindset.py`: Main analysis script
- `utils/`: Utility functions
- `models/`: Trained models
- `data/`: Collected data

## Git Setup and Repository Management

This project is managed using Git and hosted on GitHub. Here's how the repository was set up:

1. Initialize Git repository:
```bash
git init
```

2. Configure Git user:
```bash
git config --global user.name "LakshmiSravya123"
```

3. Create .gitignore file to exclude unnecessary files:
- Python cache files
- Virtual environment directories
- IDE-specific files
- Project-specific data files
- OS-specific files

4. Add and commit files:
```bash
git add .
git commit -m "Initial commit: Mindset Analyzer project"
```

5. Connect to GitHub repository:
```bash
git remote add origin https://github.com/LakshmiSravya123/mindset_analyzer.git
```

6. Push code to GitHub:
```bash
git push -u origin main
```

### Repository Structure
```
mindset_analyzer/
├── .gitignore           # Git ignore rules
├── README.md           # Project documentation
├── requirements.txt    # Python dependencies
├── collect_data.py     # Data collection module
├── train_model.py      # Model training module
├── analyze_mindset.py  # Analysis script
├── data/              # Data directory (gitignored)
├── models/            # Trained models (gitignored)
└── visualizations/    # Generated visualizations (gitignored)
```

### Git Workflow
1. Create a new branch for features:
```bash
git checkout -b feature/your-feature-name
```

2. Make changes and commit:
```bash
git add .
git commit -m "Description of changes"
```

3. Push changes:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request on GitHub

## License

MIT License 