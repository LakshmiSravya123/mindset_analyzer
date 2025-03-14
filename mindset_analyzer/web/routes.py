from flask import Blueprint, render_template, jsonify, request
from datetime import datetime, timedelta
import json
import random

# Create Blueprint
dashboard = Blueprint('dashboard', __name__)

def collect_data(mode='dashboard'):
    """Collect data based on the current mode"""
    base_metrics = {
        'mindset_score': random.randint(60, 100),
        'energy_level': random.randint(50, 100),
        'focus_level': random.randint(50, 100),
        'stress_level': random.randint(20, 80),
        'mood': random.choice(['Positive', 'Neutral', 'Focused', 'Energetic'])
    }
    
    mode_specific_data = {
        'spiritual': {
            'meditation_minutes': random.randint(0, 60),
            'mindfulness_score': random.randint(50, 100),
            'daily_intention': random.choice([
                'Inner Peace', 'Gratitude', 'Compassion', 'Wisdom', 'Harmony'
            ])
        },
        'energy': {
            'physical_energy': random.randint(50, 100),
            'mental_energy': random.randint(50, 100),
            'daily_steps': random.randint(5000, 15000),
            'rest_quality': random.randint(50, 100)
        },
        'travel': {
            'places_visited': random.randint(1, 5),
            'journey_satisfaction': random.randint(50, 100),
            'cultural_insights': random.randint(1, 10),
            'travel_mood': random.choice([
                'Adventurous', 'Relaxed', 'Curious', 'Excited'
            ])
        },
        'creative': {
            'inspiration_level': random.randint(50, 100),
            'projects_active': random.randint(1, 5),
            'creative_flow': random.randint(50, 100),
            'ideas_generated': random.randint(1, 10)
        },
        'learning': {
            'knowledge_retention': random.randint(50, 100),
            'study_efficiency': random.randint(50, 100),
            'topics_mastered': random.randint(1, 5),
            'learning_streak': random.randint(1, 30)
        }
    }
    
    data = {
        'metrics': base_metrics,
        'mode_data': mode_specific_data.get(mode, {}),
        'timestamp': datetime.now().isoformat()
    }
    
    return data

@dashboard.route('/')
def index():
    """Render the main dashboard page."""
    return render_template('dashboard.html', mode='dashboard')

@dashboard.route('/spiritual')
def spiritual():
    """Render the spiritual mode page."""
    return render_template('dashboard.html', mode='spiritual')

@dashboard.route('/spiritual-texts')
def spiritual_texts():
    """Render the spiritual texts page."""
    return render_template('spiritual_texts.html')

@dashboard.route('/energy')
def energy():
    """Render the energy mode page."""
    return render_template('dashboard.html', mode='energy')

@dashboard.route('/travel')
def travel():
    """Render the travel mode page."""
    return render_template('dashboard.html', mode='travel')

@dashboard.route('/creative')
def creative():
    """Render the creative mode page."""
    return render_template('dashboard.html', mode='creative')

@dashboard.route('/learning')
def learning():
    """Render the learning mode page."""
    return render_template('dashboard.html', mode='learning')

@dashboard.route('/analytics')
def analytics():
    """Render the analytics page."""
    return render_template('analytics.html')

@dashboard.route('/settings')
def settings():
    """Render the settings page."""
    return render_template('settings.html')

@dashboard.route('/help')
def help():
    """Render the help page."""
    return render_template('help.html')

@dashboard.route('/api/dashboard-data')
def dashboard_data():
    """Get dashboard data for the current mode."""
    mode = request.args.get('mode', 'dashboard')
    return jsonify(collect_data(mode))

@dashboard.route('/api/daily-wisdom')
def daily_wisdom():
    """Get a random wisdom quote."""
    quotes = [
        {"quote": "The only way to do great work is to love what you do.", "author": "Steve Jobs"},
        {"quote": "Peace comes from within. Do not seek it without.", "author": "Buddha"},
        {"quote": "Happiness is not something ready made. It comes from your own actions.", "author": "Dalai Lama"},
        {"quote": "The journey of a thousand miles begins with one step.", "author": "Lao Tzu"},
        {"quote": "The mind is everything. What you think you become.", "author": "Buddha"}
    ]
    return jsonify(random.choice(quotes))

@dashboard.route('/api/mode-history')
def mode_history():
    """Get historical data for the current mode."""
    mode = request.args.get('mode', 'dashboard')
    days = int(request.args.get('days', 7))
    
    history = []
    for i in range(days):
        date = datetime.now() - timedelta(days=i)
        history.append({
            'date': date.strftime('%Y-%m-%d'),
            'data': collect_data(mode)
        })
    
    return jsonify(history)

@dashboard.route('/api/analytics-data')
def analytics_data():
    """Get analytics data for visualization."""
    try:
        data = {
            'daily_patterns': [random.randint(50, 100) for _ in range(7)],
            'correlations': {
                'sleep': round(random.random(), 2),
                'exercise': round(random.random(), 2),
                'meditation': round(random.random(), 2),
                'social': round(random.random(), 2)
            },
            'trends': {
                'mindset': [random.randint(50, 100) for _ in range(30)],
                'energy': [random.randint(50, 100) for _ in range(30)],
                'focus': [random.randint(50, 100) for _ in range(30)]
            }
        }
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@dashboard.route('/api/settings', methods=['GET'])
def get_settings():
    try:
        # Load settings from database or file
        settings = {
            'notifications': {
                'enabled': True,
                'reminderTime': '09:00'
            },
            'dataCollection': {
                'frequency': 'daily',
                'retention': '90'
            },
            'appearance': {
                'theme': 'light',
                'language': 'en'
            },
            'account': {
                'email': 'user@example.com'
            }
        }
        
        return jsonify({
            'success': True,
            'data': settings
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@dashboard.route('/api/settings', methods=['POST'])
def save_settings():
    try:
        settings = request.get_json()
        
        # Save settings to database or file
        # For now, just return success
        return jsonify({
            'success': True,
            'message': 'Settings saved successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@dashboard.route('/api/change-password', methods=['POST'])
def change_password():
    try:
        data = request.get_json()
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')
        
        # Validate current password and update to new password
        # For now, just return success
        return jsonify({
            'success': True,
            'message': 'Password changed successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@dashboard.route('/api/export-data')
def export_data():
    try:
        # Collect all data
        data = collect_data(historical=True)
        
        # Convert to JSON string
        json_data = json.dumps(data, indent=2)
        
        return json_data, 200, {
            'Content-Type': 'application/json',
            'Content-Disposition': 'attachment; filename=mindset_data.json'
        }
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@dashboard.route('/api/delete-account', methods=['POST'])
def delete_account():
    try:
        # Delete user account and all associated data
        # For now, just return success
        return jsonify({
            'success': True,
            'message': 'Account deleted successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@dashboard.route('/api/support', methods=['POST'])
def submit_support():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')
        
        # Process support request (e.g., send email, create ticket)
        # For now, just return success
        return jsonify({
            'success': True,
            'message': 'Support request submitted successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500 