import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
from train_model import MindsetModel
from collect_data import DataCollector
import os

class MindsetAnalyzer:
    def __init__(self):
        self.model = MindsetModel()
        self.collector = DataCollector()
        
    def load_trained_model(self, model_path: str = "models"):
        """Load the trained model."""
        self.model.load_model(model_path)
    
    def analyze_daily_patterns(self, date: datetime):
        """Analyze mindset patterns for a specific date."""
        # Load data
        data = self.collector.load_data(date)
        if not data:
            raise ValueError(f"No data found for date {date}")
        
        # Prepare data for prediction
        X, _ = self.model.prepare_data(data)
        if len(X) == 0:
            raise ValueError("No valid data sequences found")
        
        # Make predictions
        predictions = self.model.predict(X)
        
        # Create results DataFrame
        results = pd.DataFrame(predictions, columns=['mood_score', 'energy_level', 'focus_level', 'stress_level'])
        results['timestamp'] = data['mindset']['timestamp'].iloc[self.model.sequence_length:]
        
        return results
    
    def visualize_patterns(self, results: pd.DataFrame, save_path: str = None):
        """Visualize mindset patterns."""
        plt.figure(figsize=(15, 10))
        
        # Plot each metric
        metrics = ['mood_score', 'energy_level', 'focus_level', 'stress_level']
        for i, metric in enumerate(metrics, 1):
            plt.subplot(2, 2, i)
            sns.lineplot(data=results, x='timestamp', y=metric)
            plt.title(f'{metric.replace("_", " ").title()} Over Time')
            plt.xticks(rotation=45)
        
        plt.tight_layout()
        
        if save_path:
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            plt.savefig(save_path)
        else:
            plt.show()
    
    def analyze_correlations(self, data: dict, results: pd.DataFrame):
        """Analyze correlations between different factors and mindset."""
        # Combine all features
        all_features = pd.DataFrame()
        
        # Add mindset predictions
        all_features['mood_score'] = results['mood_score']
        all_features['energy_level'] = results['energy_level']
        all_features['focus_level'] = results['focus_level']
        all_features['stress_level'] = results['stress_level']
        
        # Add other features
        for category in ['activity', 'social', 'physiological', 'environmental']:
            if category in data:
                df = data[category]
                for col in df.select_dtypes(include=[np.number]).columns:
                    all_features[f'{category}_{col}'] = df[col].iloc[self.model.sequence_length:]
        
        # Calculate correlations
        correlations = all_features.corr()
        
        # Plot correlation heatmap
        plt.figure(figsize=(12, 8))
        sns.heatmap(correlations, annot=True, cmap='coolwarm', center=0)
        plt.title('Correlation Heatmap of Mindset Factors')
        plt.tight_layout()
        plt.show()
    
    def generate_insights(self, results: pd.DataFrame, data: dict):
        """Generate insights about mindset patterns."""
        insights = []
        
        # Analyze mood patterns
        mood_mean = results['mood_score'].mean()
        mood_std = results['mood_score'].std()
        insights.append(f"Average mood score: {mood_mean:.2f} (std: {mood_std:.2f})")
        
        # Analyze energy patterns
        energy_mean = results['energy_level'].mean()
        energy_std = results['energy_level'].std()
        insights.append(f"Average energy level: {energy_mean:.2f} (std: {energy_std:.2f})")
        
        # Analyze focus patterns
        focus_mean = results['focus_level'].mean()
        focus_std = results['focus_level'].std()
        insights.append(f"Average focus level: {focus_mean:.2f} (std: {focus_std:.2f})")
        
        # Analyze stress patterns
        stress_mean = results['stress_level'].mean()
        stress_std = results['stress_level'].std()
        insights.append(f"Average stress level: {stress_mean:.2f} (std: {stress_std:.2f})")
        
        return insights

def main():
    # Initialize analyzer
    analyzer = MindsetAnalyzer()
    analyzer.load_trained_model()
    
    # Analyze today's patterns
    today = datetime.now()
    results = analyzer.analyze_daily_patterns(today)
    
    # Load data for correlation analysis
    data = analyzer.collector.load_data(today)
    
    # Visualize patterns
    analyzer.visualize_patterns(results, "visualizations/daily_patterns.png")
    
    # Analyze correlations
    analyzer.analyze_correlations(data, results)
    
    # Generate insights
    insights = analyzer.generate_insights(results, data)
    print("\nMindset Analysis Insights:")
    for insight in insights:
        print(f"- {insight}")

if __name__ == "__main__":
    main() 