// Theme handling
const themeToggle = document.getElementById('themeToggle');
const themeOptions = document.querySelectorAll('input[name="theme"]');

// Load saved theme preference
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.querySelector(`input[name="theme"][value="${savedTheme}"]`).checked = true;
});

// Theme switching
themeOptions.forEach(option => {
    option.addEventListener('change', function() {
        const theme = this.value;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        saveSettings();
    });
});

// Form handling
const settingsForm = document.getElementById('settingsForm');
const notificationToggle = document.getElementById('notificationToggle');
const reminderTime = document.getElementById('reminderTime');
const collectionFrequency = document.querySelectorAll('input[name="collectionFrequency"]');
const dataRetention = document.getElementById('dataRetention');
const languageSelect = document.getElementById('languageSelect');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const confirmPasswordInput = document.getElementById('confirmPasswordInput');

// Load saved settings
async function loadSettings() {
    try {
        const response = await fetch('/api/settings');
        const data = await response.json();

        if (data.success) {
            const settings = data.data;
            
            // Update form fields
            notificationToggle.checked = settings.notifications.enabled;
            reminderTime.value = settings.notifications.reminderTime;
            document.querySelector(`input[name="collectionFrequency"][value="${settings.dataCollection.frequency}"]`).checked = true;
            dataRetention.value = settings.dataCollection.retention;
            languageSelect.value = settings.appearance.language;
            emailInput.value = settings.account.email;
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        showError('Failed to load settings');
    }
}

// Save settings
async function saveSettings() {
    const settings = {
        notifications: {
            enabled: notificationToggle.checked,
            reminderTime: reminderTime.value
        },
        dataCollection: {
            frequency: document.querySelector('input[name="collectionFrequency"]:checked').value,
            retention: dataRetention.value
        },
        appearance: {
            theme: document.querySelector('input[name="theme"]:checked').value,
            language: languageSelect.value
        },
        account: {
            email: emailInput.value
        }
    };

    try {
        const response = await fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });

        const data = await response.json();
        if (data.success) {
            showSuccess('Settings saved successfully');
        } else {
            showError('Failed to save settings');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        showError('Failed to save settings');
    }
}

// Password change handling
const passwordForm = document.getElementById('passwordForm');
passwordForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (passwordInput.value !== confirmPasswordInput.value) {
        showError('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('/api/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentPassword: document.getElementById('currentPassword').value,
                newPassword: passwordInput.value
            })
        });

        const data = await response.json();
        if (data.success) {
            showSuccess('Password changed successfully');
            passwordForm.reset();
        } else {
            showError(data.message || 'Failed to change password');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showError('Failed to change password');
    }
});

// Data export handling
const exportButton = document.getElementById('exportData');
exportButton.addEventListener('click', async function() {
    try {
        const response = await fetch('/api/export-data');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mindset_data.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showSuccess('Data exported successfully');
    } catch (error) {
        console.error('Error exporting data:', error);
        showError('Failed to export data');
    }
});

// Account deletion handling
const deleteAccountButton = document.getElementById('deleteAccount');
deleteAccountButton.addEventListener('click', async function() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        try {
            const response = await fetch('/api/delete-account', {
                method: 'POST'
            });

            const data = await response.json();
            if (data.success) {
                window.location.href = '/login';
            } else {
                showError('Failed to delete account');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            showError('Failed to delete account');
        }
    }
});

// Form auto-save
const formFields = settingsForm.querySelectorAll('input, select, textarea');
formFields.forEach(field => {
    field.addEventListener('change', saveSettings);
});

// Load settings when page loads
document.addEventListener('DOMContentLoaded', loadSettings);

// Utility functions
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success alert-dismissible fade show';
    successDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container-fluid').insertBefore(successDiv, document.querySelector('.row'));
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container-fluid').insertBefore(errorDiv, document.querySelector('.row'));
} 