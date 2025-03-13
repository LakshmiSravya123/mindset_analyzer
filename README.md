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

## Examples

### Example 1: Daily Pattern Analysis
Here's how the system analyzes a typical day:

```python
# Sample data collection for one hour
activity_data = {
    'timestamp': '2024-03-14 09:00:00',
    'steps': 250,
    'movement_level': 0.7,
    'exercise_minutes': 30
}

social_data = {
    'timestamp': '2024-03-14 09:00:00',
    'social_interactions': 5,
    'message_count': 12,
    'social_media_usage': 15
}

physiological_data = {
    'timestamp': '2024-03-14 09:00:00',
    'heart_rate': 75,
    'stress_level': 0.3,
    'sleep_quality': 0.8
}

# The model predicts mindset metrics
predicted_mindset = {
    'mood_score': 0.85,      # High positive mood
    'energy_level': 0.75,    # Good energy level
    'focus_level': 0.65,     # Moderate focus
    'stress_level': 0.25     # Low stress
}
```

### Example 2: Pattern Recognition
The system identifies patterns like:

1. **Morning Pattern**
```
Time: 7:00 AM - 9:00 AM
- High energy levels (0.8-0.9)
- Increasing focus (0.6 → 0.8)
- Moderate stress (0.3-0.4)
- Peak physical activity
```

2. **Afternoon Pattern**
```
Time: 2:00 PM - 4:00 PM
- Energy dip (0.7 → 0.5)
- Decreased focus (0.7 → 0.4)
- Increased stress (0.3 → 0.6)
- Reduced physical activity
```

### Example 3: Correlation Analysis
The system identifies relationships between different factors:

```python
# Sample correlation matrix
correlations = {
    'mood_score': {
        'exercise_minutes': 0.65,    # Strong positive correlation
        'social_interactions': 0.45,  # Moderate positive correlation
        'stress_level': -0.70,       # Strong negative correlation
        'sleep_quality': 0.55        # Moderate positive correlation
    }
}
```

### Example 4: Visualization Output
The system generates visualizations like:

```
Daily Pattern Visualization:
┌─────────────────────────────────┐
│ Mood Score                      │
│   ▲                            │
│   │     ••••••••              │
│   │   ••        ••            │
│   │ ••            ••          │
│   │•                •         │
│   │•                •         │
│   │ ••            ••          │
│   │   ••        ••            │
│   │     ••••••••              │
│   └────────────────────────────┘
│     6AM  12PM   6PM   12AM     │
└─────────────────────────────────┘
```

### Example 5: Real-time Analysis
The system provides real-time insights:

```python
# Current state analysis
current_state = {
    'timestamp': '2024-03-14 15:30:00',
    'metrics': {
        'mood_score': 0.65,
        'energy_level': 0.45,
        'focus_level': 0.55,
        'stress_level': 0.60
    },
    'insights': [
        "Energy levels are below average for this time of day",
        "Stress levels are elevated compared to typical patterns",
        "Focus is maintaining despite energy dip"
    ],
    'recommendations': [
        "Consider taking a short break",
        "Increase physical activity",
        "Reduce screen time"
    ]
}
```

### Example 6: Model Training Process
```python
# Sample training data
training_data = {
    'features': [
        [steps, movement, heart_rate, social_interactions, ...],  # Hour 1
        [steps, movement, heart_rate, social_interactions, ...],  # Hour 2
        # ... 24 hours of data
    ],
    'targets': [
        [mood_score, energy_level, focus_level, stress_level],  # Hour 25
        [mood_score, energy_level, focus_level, stress_level],  # Hour 26
        # ... predictions
    ]
}

# Model training progress
training_progress = {
    'epoch': 1,
    'loss': 0.45,
    'val_loss': 0.48,
    'metrics': {
        'mood_mae': 0.12,
        'energy_mae': 0.15,
        'focus_mae': 0.18,
        'stress_mae': 0.14
    }
}
```

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