from flask import Blueprint, render_template, jsonify, request
from datetime import datetime
import json
from mindset_analyzer.data_collector import collect_data
from mindset_analyzer.model_trainer import train_model
from mindset_analyzer.analyzer import analyze_data

# Create Blueprint
dashboard = Blueprint('dashboard', __name__)

@dashboard.route('/')
def index():
    """Render the main dashboard page."""
    return render_template('dashboard.html')

@dashboard.route('/spiritual')
def spiritual():
    """Render the spiritual journey page."""
    return render_template('spiritual.html')

@dashboard.route('/spiritual-texts')
def spiritual_texts():
    """Render the spiritual texts page."""
    return render_template('spiritual_texts.html')

@dashboard.route('/energy')
def energy():
    """Render the energy mode page."""
    return render_template('energy.html')

@dashboard.route('/travel')
def travel():
    """Render the travel mode page."""
    return render_template('travel.html')

@dashboard.route('/creative')
def creative():
    """Render the creative mode page."""
    return render_template('creative.html')

@dashboard.route('/learning')
def learning():
    """Render the learning mode page."""
    return render_template('learning.html')

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
def get_dashboard_data():
    """Get dashboard data including metrics, patterns, and insights."""
    try:
        # Collect new data
        data = collect_data()
        
        # Train model with new data
        model = train_model(data)
        
        # Analyze data
        analysis = analyze_data(data, model)
        
        return jsonify({
            'success': True,
            'data': {
                'metrics': {
                    'mood_score': analysis['mood_score'],
                    'energy_level': analysis['energy_level'],
                    'focus_level': analysis['focus_level'],
                    'stress_level': analysis['stress_level']
                },
                'daily_patterns': analysis['daily_patterns'],
                'correlations': analysis['correlations'],
                'insights': analysis['insights'],
                'recommendations': analysis['recommendations']
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@dashboard.route('/api/analytics-data')
def get_analytics_data():
    try:
        # Collect historical data
        data = collect_data(historical=True)
        
        # Train model with historical data
        model = train_model(data)
        
        # Analyze data
        analysis = analyze_data(data, model)
        
        return jsonify({
            'success': True,
            'data': {
                'weeklyTrends': {
                    'labels': analysis['weekly_trends']['labels'],
                    'moodScores': analysis['weekly_trends']['mood_scores'],
                    'energyLevels': analysis['weekly_trends']['energy_levels']
                },
                'monthlyComparison': {
                    'labels': analysis['monthly_comparison']['labels'],
                    'scores': analysis['monthly_comparison']['scores']
                },
                'factorAnalysis': {
                    'labels': analysis['factor_analysis']['labels'],
                    'impacts': analysis['factor_analysis']['impacts']
                },
                'predictiveTrends': {
                    'labels': analysis['predictive_trends']['labels'],
                    'actual': analysis['predictive_trends']['actual'],
                    'predicted': analysis['predictive_trends']['predicted']
                },
                'stats': analysis['statistics']
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

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