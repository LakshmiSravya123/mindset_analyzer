import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout
from tensorflow.keras.optimizers import Adam
import os
from datetime import datetime, timedelta
from typing import Dict, Tuple, List

class MindsetModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.sequence_length = 24  # 24 hours of data
        
    def prepare_data(self, data: Dict[str, pd.DataFrame]) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare data for model training."""
        # Combine all features
        features = []
        for category in ['activity', 'social', 'physiological', 'environmental']:
            if category in data:
                df = data[category]
                features.extend(df.select_dtypes(include=[np.number]).columns)
        
        # Create feature matrix
        X = np.zeros((len(data['mindset']), len(features)))
        for i, feature in enumerate(features):
            for category in ['activity', 'social', 'physiological', 'environmental']:
                if category in data and feature in data[category].columns:
                    X[:, i] = data[category][feature].values
                    break
        
        # Create target matrix (mindset features)
        y = data['mindset'][['mood_score', 'energy_level', 'focus_level', 'stress_level']].values
        
        # Scale features
        X = self.scaler.fit_transform(X)
        
        # Create sequences
        X_sequences = []
        y_sequences = []
        for i in range(len(X) - self.sequence_length):
            X_sequences.append(X[i:(i + self.sequence_length)])
            y_sequences.append(y[i + self.sequence_length])
        
        return np.array(X_sequences), np.array(y_sequences)
    
    def build_model(self, input_shape: Tuple[int, int], output_shape: int):
        """Build the LSTM model."""
        self.model = Sequential([
            LSTM(128, input_shape=input_shape, return_sequences=True),
            Dropout(0.2),
            LSTM(64),
            Dropout(0.2),
            Dense(32, activation='relu'),
            Dense(output_shape, activation='sigmoid')
        ])
        
        self.model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae']
        )
    
    def train(self, X: np.ndarray, y: np.ndarray, epochs: int = 50, batch_size: int = 32):
        """Train the model."""
        X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
        
        if self.model is None:
            self.build_model((X.shape[1], X.shape[2]), y.shape[1])
        
        history = self.model.fit(
            X_train, y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_data=(X_val, y_val),
            verbose=1
        )
        
        return history
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Make predictions using the trained model."""
        if self.model is None:
            raise ValueError("Model not trained yet!")
        
        return self.model.predict(X)
    
    def save_model(self, path: str):
        """Save the trained model."""
        if self.model is None:
            raise ValueError("No model to save!")
        
        os.makedirs(path, exist_ok=True)
        self.model.save(os.path.join(path, 'mindset_model.h5'))
        np.save(os.path.join(path, 'scaler.npy'), self.scaler)
    
    def load_model(self, path: str):
        """Load a trained model."""
        from tensorflow.keras.models import load_model
        
        self.model = load_model(os.path.join(path, 'mindset_model.h5'))
        self.scaler = np.load(os.path.join(path, 'scaler.npy'), allow_pickle=True).item()

def train_model_for_date(date: datetime, data_dir: str = "data"):
    """Train model using data from a specific date."""
    from collect_data import DataCollector
    
    collector = DataCollector()
    data = collector.load_data(date)
    
    if not data:
        raise ValueError(f"No data found for date {date}")
    
    model = MindsetModel()
    X, y = model.prepare_data(data)
    
    if len(X) == 0:
        raise ValueError("No valid data sequences found")
    
    model.train(X, y)
    model.save_model("models")
    
    return model

if __name__ == "__main__":
    # Example usage
    today = datetime.now()
    model = train_model_for_date(today)
    print("Model training completed successfully!") 