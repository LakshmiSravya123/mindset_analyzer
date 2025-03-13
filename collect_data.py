import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import os
from typing import Dict, List, Any

class DataCollector:
    def __init__(self):
        self.data_dir = "data"
        os.makedirs(self.data_dir, exist_ok=True)
        
    def collect_activity_data(self, start_time: datetime, duration: timedelta) -> pd.DataFrame:
        """Collect activity data including steps, movement, and exercise."""
        # Simulate activity data collection
        times = pd.date_range(start=start_time, end=start_time + duration, freq='1H')
        data = {
            'timestamp': times,
            'steps': np.random.randint(0, 1000, len(times)),
            'movement_level': np.random.uniform(0, 1, len(times)),
            'exercise_minutes': np.random.randint(0, 60, len(times))
        }
        return pd.DataFrame(data)
    
    def collect_social_data(self, start_time: datetime, duration: timedelta) -> pd.DataFrame:
        """Collect social interaction data."""
        times = pd.date_range(start=start_time, end=start_time + duration, freq='1H')
        data = {
            'timestamp': times,
            'social_interactions': np.random.randint(0, 10, len(times)),
            'message_count': np.random.randint(0, 20, len(times)),
            'social_media_usage': np.random.randint(0, 30, len(times))
        }
        return pd.DataFrame(data)
    
    def collect_physiological_data(self, start_time: datetime, duration: timedelta) -> pd.DataFrame:
        """Collect physiological data including heart rate and stress levels."""
        times = pd.date_range(start=start_time, end=start_time + duration, freq='1H')
        data = {
            'timestamp': times,
            'heart_rate': np.random.randint(60, 100, len(times)),
            'stress_level': np.random.uniform(0, 1, len(times)),
            'sleep_quality': np.random.uniform(0, 1, len(times))
        }
        return pd.DataFrame(data)
    
    def collect_environmental_data(self, start_time: datetime, duration: timedelta) -> pd.DataFrame:
        """Collect environmental data including weather and location."""
        times = pd.date_range(start=start_time, end=start_time + duration, freq='1H')
        data = {
            'timestamp': times,
            'temperature': np.random.uniform(15, 30, len(times)),
            'humidity': np.random.uniform(30, 70, len(times)),
            'light_level': np.random.uniform(0, 1, len(times))
        }
        return pd.DataFrame(data)
    
    def collect_mindset_data(self, start_time: datetime, duration: timedelta) -> pd.DataFrame:
        """Collect self-reported mindset data."""
        times = pd.date_range(start=start_time, end=start_time + duration, freq='1H')
        data = {
            'timestamp': times,
            'mood_score': np.random.uniform(0, 1, len(times)),
            'energy_level': np.random.uniform(0, 1, len(times)),
            'focus_level': np.random.uniform(0, 1, len(times)),
            'stress_level': np.random.uniform(0, 1, len(times))
        }
        return pd.DataFrame(data)
    
    def collect_all_data(self, date: datetime) -> Dict[str, pd.DataFrame]:
        """Collect all data for a given date."""
        duration = timedelta(days=1)
        data = {
            'activity': self.collect_activity_data(date, duration),
            'social': self.collect_social_data(date, duration),
            'physiological': self.collect_physiological_data(date, duration),
            'environmental': self.collect_environmental_data(date, duration),
            'mindset': self.collect_mindset_data(date, duration)
        }
        return data
    
    def save_data(self, data: Dict[str, pd.DataFrame], date: datetime):
        """Save collected data to files."""
        date_str = date.strftime('%Y-%m-%d')
        for category, df in data.items():
            filename = os.path.join(self.data_dir, f'{category}_{date_str}.csv')
            df.to_csv(filename, index=False)
    
    def load_data(self, date: datetime) -> Dict[str, pd.DataFrame]:
        """Load data for a given date."""
        date_str = date.strftime('%Y-%m-%d')
        data = {}
        for category in ['activity', 'social', 'physiological', 'environmental', 'mindset']:
            filename = os.path.join(self.data_dir, f'{category}_{date_str}.csv')
            if os.path.exists(filename):
                data[category] = pd.read_csv(filename)
        return data

if __name__ == "__main__":
    # Example usage
    collector = DataCollector()
    today = datetime.now()
    data = collector.collect_all_data(today)
    collector.save_data(data, today)
    print("Data collection completed successfully!") 