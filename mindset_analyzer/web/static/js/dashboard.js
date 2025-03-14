// Initialize charts
let dailyPatternsChart, correlationsChart;

// Chart configurations
const chartConfigs = {
    dailyPatterns: {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Mood Score',
                data: [65, 70, 75, 80, 85, 82, 85],
                borderColor: '#2ecc71',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(46, 204, 113, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    },
    correlations: {
        type: 'bar',
        data: {
            labels: ['Sleep', 'Exercise', 'Diet', 'Social'],
            datasets: [{
                label: 'Correlation with Mood',
                data: [0.8, 0.6, 0.4, 0.7],
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#f1c40f',
                    '#e74c3c'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    }
};

function updateDashboard(data) {
    // Update mindset score
    const mindsetScore = document.getElementById('mindset-score');
    if (mindsetScore) {
        mindsetScore.textContent = data.mindset_score;
        mindsetScore.style.color = data.mindset_score >= 80 ? '#1cc88a' : '#e74a3b';
    }

    // Update focus level
    const focusLevel = document.getElementById('focus-level');
    if (focusLevel) {
        focusLevel.style.width = `${data.focus_level}%`;
        focusLevel.textContent = `${data.focus_level}%`;
    }

    // Update energy level
    const energyLevel = document.getElementById('energy-level');
    if (energyLevel) {
        energyLevel.style.width = `${data.energy_level}%`;
        energyLevel.textContent = `${data.energy_level}%`;
    }

    // Update stress level
    const stressLevel = document.getElementById('stress-level');
    if (stressLevel) {
        stressLevel.style.width = `${data.stress_level}%`;
        stressLevel.textContent = `${data.stress_level}%`;
    }

    // Update mood
    const moodIndicator = document.getElementById('mood-indicator');
    if (moodIndicator) {
        moodIndicator.textContent = data.mood;
        moodIndicator.className = `badge ${getMoodClass(data.mood)}`;
    }

    // Update timestamp
    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) {
        lastUpdate.textContent = `Last updated: ${data.timestamp}`;
    }

    // Animate the updates
    animateValue('mindset-score');
}

function getMoodClass(mood) {
    const moodClasses = {
        'Positive': 'bg-success',
        'Neutral': 'bg-info',
        'Focused': 'bg-primary',
        'Energetic': 'bg-warning'
    };
    return moodClasses[mood] || 'bg-secondary';
}

function animateValue(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('pulse-animation');
        setTimeout(() => {
            element.classList.remove('pulse-animation');
        }, 1000);
    }
}

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    .pulse-animation {
        animation: pulse 1s ease-in-out;
    }
`;
document.head.appendChild(style);

// Initialize UI components
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    initializeTheme();
    initializeAnimations();
    loadDashboardData();
    updateDailyWisdom();

    // Add click handler for wisdom card
    const wisdomCard = document.querySelector('.wisdom-card');
    if (wisdomCard) {
        wisdomCard.addEventListener('click', updateDailyWisdom);
    }
});

// Theme functionality
function initializeTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

// Update theme icon
function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'bx bx-moon' : 'bx bx-sun';
    }
}

// Sidebar functionality
function initializeSidebar() {
    const sidebarToggle = document.querySelector('.nav-icon');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    if (sidebarToggle && sidebar && mainContent) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('sidebar-collapsed');
        });

        // Close sidebar on mobile when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target)) {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('sidebar-collapsed');
            }
        });
    }
}

// Mode toggle functionality
function initializeModeToggle() {
    const modeToggle = document.querySelector('.mode-toggle');
    const icon = modeToggle?.querySelector('i');
    
    if (modeToggle && icon) {
        let isDarkMode = true; // Start with dark mode
        
        modeToggle.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('light-mode');
            
            // Update icon
            icon.className = isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
            
            // Animate icon
            icon.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                icon.style.transform = 'rotate(0deg)';
            }, 300);
            
            // Update theme
            updateThemeColors(isDarkMode);
        });
    }
}

// Handle mode-specific transitions
function handleModeTransitions() {
    const links = document.querySelectorAll('.sidebar-nav a');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const mode = link.getAttribute('data-mode');
            if (mode) {
                document.body.className = `mode-${mode} mode-transition`;
                
                // Trigger animations for new content
                setTimeout(() => {
                    initializeAnimations();
                }, 100);
            }
        });
    });
}

// Initialize animations for components
function initializeAnimations() {
    const elements = document.querySelectorAll('.card, .metric-card, .chart-container');
    
    elements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        element.classList.add('fade-in');
    });
}

// Update theme colors
function updateThemeColors(isDark) {
    const root = document.documentElement;
    if (isDark) {
        root.style.setProperty('--dark-bg', '#121212');
        root.style.setProperty('--text-primary', '#FFFFFF');
    } else {
        root.style.setProperty('--dark-bg', '#f5f5f5');
        root.style.setProperty('--text-primary', '#121212');
    }
}

// Get the current mode from the page
const currentMode = document.body.getAttribute('data-mode') || 'dashboard';

// Function to load dashboard data
async function loadDashboardData() {
    try {
        const response = await fetch(`/api/dashboard-data?mode=${currentMode}`);
        const data = await response.json();
        
        // Update base metrics
        updateBaseMetrics(data.metrics);
        
        // Update mode-specific content
        if (data.mode_data) {
            updateModeContent(data.mode_data);
        }
        
        // Update charts
        updateCharts(data);
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data');
    }
}

// Function to update base metrics
function updateBaseMetrics(metrics) {
    // Update mindset score
    const mindsetScore = document.getElementById('mindset-score');
    if (mindsetScore) {
        mindsetScore.textContent = metrics.mindset_score;
        mindsetScore.style.color = metrics.mindset_score >= 80 ? '#1cc88a' : '#e74a3b';
    }

    // Update focus level
    const focusLevel = document.getElementById('focus-level');
    if (focusLevel) {
        focusLevel.style.width = `${metrics.focus_level}%`;
        focusLevel.textContent = `${metrics.focus_level}%`;
    }

    // Update energy level
    const energyLevel = document.getElementById('energy-level');
    if (energyLevel) {
        energyLevel.style.width = `${metrics.energy_level}%`;
        energyLevel.textContent = `${metrics.energy_level}%`;
    }

    // Update stress level
    const stressLevel = document.getElementById('stress-level');
    if (stressLevel) {
        stressLevel.style.width = `${metrics.stress_level}%`;
        stressLevel.textContent = `${metrics.stress_level}%`;
    }

    // Update mood
    const moodIndicator = document.getElementById('mood-indicator');
    if (moodIndicator) {
        moodIndicator.textContent = metrics.mood;
        moodIndicator.className = `badge ${getMoodClass(metrics.mood)}`;
    }
}

// Function to update mode-specific content
function updateModeContent(modeData) {
    const modeContentDiv = document.getElementById('mode-specific-content');
    if (!modeContentDiv) return;

    switch(currentMode) {
        case 'spiritual':
            updateSpiritualContent(modeData);
            break;
        case 'energy':
            updateEnergyContent(modeData);
            break;
        case 'travel':
            updateTravelContent(modeData);
            break;
        case 'creative':
            updateCreativeContent(modeData);
            break;
        case 'learning':
            updateLearningContent(modeData);
            break;
    }
}

// Mode-specific update functions
function updateSpiritualContent(data) {
    const meditationTimer = document.getElementById('meditation-timer');
    if (meditationTimer) {
        meditationTimer.textContent = `${data.meditation_minutes}:00`;
    }

    const mindfulnessScore = document.getElementById('mindfulness-score');
    if (mindfulnessScore) {
        mindfulnessScore.textContent = `${data.mindfulness_score}%`;
    }

    const intention = document.getElementById('daily-intention');
    if (intention) {
        intention.textContent = data.daily_intention;
    }
}

function updateEnergyContent(data) {
    const physicalEnergy = document.getElementById('physical-energy');
    if (physicalEnergy) {
        physicalEnergy.style.width = `${data.physical_energy}%`;
    }

    const mentalEnergy = document.getElementById('mental-energy');
    if (mentalEnergy) {
        mentalEnergy.style.width = `${data.mental_energy}%`;
    }

    const steps = document.getElementById('daily-steps');
    if (steps) {
        steps.textContent = data.daily_steps.toLocaleString();
    }

    const rest = document.getElementById('rest-quality');
    if (rest) {
        rest.textContent = `${data.rest_quality}%`;
    }
}

function updateTravelContent(data) {
    const placesVisited = document.getElementById('places-visited');
    if (placesVisited) {
        placesVisited.textContent = data.places_visited;
    }

    const satisfaction = document.getElementById('journey-satisfaction');
    if (satisfaction) {
        satisfaction.style.width = `${data.journey_satisfaction}%`;
    }

    const insights = document.getElementById('cultural-insights');
    if (insights) {
        insights.textContent = data.cultural_insights;
    }

    const mood = document.getElementById('travel-mood');
    if (mood) {
        mood.textContent = data.travel_mood;
    }
}

function updateCreativeContent(data) {
    const inspiration = document.getElementById('inspiration-level');
    if (inspiration) {
        inspiration.style.width = `${data.inspiration_level}%`;
    }

    const projects = document.getElementById('projects-active');
    if (projects) {
        projects.textContent = data.projects_active;
    }

    const flow = document.getElementById('creative-flow');
    if (flow) {
        flow.style.width = `${data.creative_flow}%`;
    }

    const ideas = document.getElementById('ideas-generated');
    if (ideas) {
        ideas.textContent = data.ideas_generated;
    }
}

function updateLearningContent(data) {
    const retention = document.getElementById('knowledge-retention');
    if (retention) {
        retention.style.width = `${data.knowledge_retention}%`;
    }

    const efficiency = document.getElementById('study-efficiency');
    if (efficiency) {
        efficiency.style.width = `${data.study_efficiency}%`;
    }

    const topics = document.getElementById('topics-mastered');
    if (topics) {
        topics.textContent = data.topics_mastered;
    }

    const streak = document.getElementById('learning-streak');
    if (streak) {
        streak.textContent = data.learning_streak;
    }
}

// Function to update charts
function updateCharts(data) {
    // Update mindset trend chart if it exists
    const ctx = document.getElementById('mindsetTrendChart');
    if (ctx) {
        const chart = Chart.getChart(ctx);
        if (chart) {
            // Get the last 7 data points
            const labels = Array.from({length: 7}, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return d.toLocaleDateString('en-US', { weekday: 'short' });
            }).reverse();

            chart.data.labels = labels;
            chart.data.datasets[0].data = data.daily_patterns || Array(7).fill(0);
            chart.update();
        }
    }
}

// Initialize mode-specific features
function initializeMode() {
    switch(currentMode) {
        case 'spiritual':
            initializeMeditationTimer();
            break;
        case 'energy':
            initializeEnergyChart();
            break;
        case 'travel':
            initializeTravelPlanner();
            break;
        case 'creative':
            initializeCreativeBoard();
            break;
        case 'learning':
            initializeStudyTracker();
            break;
    }
}

// Meditation Timer
let meditationInterval;
let meditationTime = 0;

function initializeMeditationTimer() {
    const timerDisplay = document.getElementById('meditation-timer');
    if (!timerDisplay) return;
}

function toggleMeditation() {
    const button = document.querySelector('[onclick="toggleMeditation()"]');
    if (!button) return;

    if (meditationInterval) {
        clearInterval(meditationInterval);
        meditationInterval = null;
        button.textContent = 'Start Meditation';
    } else {
        button.textContent = 'Stop Meditation';
        meditationInterval = setInterval(() => {
            meditationTime++;
            const minutes = Math.floor(meditationTime / 60);
            const seconds = meditationTime % 60;
            document.getElementById('meditation-timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
}

// Energy Chart
function initializeEnergyChart() {
    const ctx = document.getElementById('energy-chart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Morning', 'Noon', 'Evening', 'Night'],
            datasets: [{
                label: 'Energy Level',
                data: [65, 80, 75, 60],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Travel Planner
function initializeTravelPlanner() {
    const plansDiv = document.getElementById('travel-plans');
    if (!plansDiv) return;
    // Initialize travel planner functionality here
}

// Creative Board
function initializeCreativeBoard() {
    const projectsDiv = document.getElementById('creative-projects');
    if (!projectsDiv) return;
    // Initialize creative board functionality here
}

// Study Tracker
function initializeStudyTracker() {
    const trackerDiv = document.getElementById('study-tracker');
    if (!trackerDiv) return;
    // Initialize study tracker functionality here
}

// Update wisdom quote
document.querySelector('.wisdom-card').addEventListener('click', () => {
    fetch('/api/daily-wisdom')
        .then(response => response.json())
        .then(data => {
            document.querySelector('.wisdom-quote').textContent = `"${data.quote}"`;
            document.querySelector('.wisdom-author').textContent = `- ${data.author}`;
        })
        .catch(error => console.error('Error fetching wisdom:', error));
});

// Error handling
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.querySelector('.container-fluid').prepend(errorDiv);
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeMode();
    loadDashboardData();
    
    // Update data periodically
    setInterval(loadDashboardData, 30000); // Update every 30 seconds
});

// Audio Manager
const AudioManager = {
    currentAudio: null,
    isPlaying: false,
    volume: 0.5,

    audioTracks: {
        dashboard: '/static/audio/ambient-flow.mp3',
        spiritual: '/static/audio/meditation-bells.mp3',
        energy: '/static/audio/upbeat-motivation.mp3',
        travel: '/static/audio/nature-sounds.mp3',
        creative: '/static/audio/creative-flow.mp3',
        learning: '/static/audio/focus-study.mp3'
    },

    init() {
        this.setupAudioControls();
        this.handleModeChange();
    },

    setupAudioControls() {
        // Create audio controls HTML
        const controls = document.createElement('div');
        controls.className = 'audio-controls';
        controls.innerHTML = `
            <button class="audio-toggle" aria-label="Toggle audio">
                <i class="fas fa-volume-up"></i>
            </button>
            <input type="range" class="volume-slider" min="0" max="1" step="0.1" value="${this.volume}">
        `;
        document.body.appendChild(controls);

        // Add event listeners
        const toggle = controls.querySelector('.audio-toggle');
        const slider = controls.querySelector('.volume-slider');

        toggle.addEventListener('click', () => this.toggleAudio());
        slider.addEventListener('input', (e) => this.setVolume(e.target.value));
    },

    handleModeChange() {
        // Listen for route changes
        document.addEventListener('DOMContentLoaded', () => {
            const currentPath = window.location.pathname;
            const mode = this.getMode(currentPath);
            this.switchMode(mode);
        });

        // Handle navigation clicks
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', (e) => {
                const mode = this.getMode(e.target.getAttribute('href'));
                this.switchMode(mode);
            });
        });
    },

    getMode(path) {
        const mode = path.split('/').pop() || 'dashboard';
        return mode;
    },

    switchMode(mode) {
        // Remove previous mode classes
        document.body.className = document.body.className
            .split(' ')
            .filter(cls => !cls.startsWith('mode-'))
            .join(' ');

        // Add new mode class
        document.body.classList.add(`mode-${mode}`);
        document.body.classList.add('mode-transition');

        // Switch audio
        this.switchAudio(mode);

        // Add background animation
        this.updateBackground();
    },

    switchAudio(mode) {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }

        const audioSrc = this.audioTracks[mode];
        if (!audioSrc) return;

        this.currentAudio = new Audio(audioSrc);
        this.currentAudio.loop = true;
        this.currentAudio.volume = this.volume;

        if (this.isPlaying) {
            this.currentAudio.play().catch(() => {
                // Handle autoplay restrictions
                this.isPlaying = false;
                this.updateToggleIcon();
            });
        }
    },

    toggleAudio() {
        if (!this.currentAudio) return;

        if (this.isPlaying) {
            this.currentAudio.pause();
        } else {
            this.currentAudio.play();
        }

        this.isPlaying = !this.isPlaying;
        this.updateToggleIcon();
    },

    setVolume(value) {
        this.volume = value;
        if (this.currentAudio) {
            this.currentAudio.volume = value;
        }
    },

    updateToggleIcon() {
        const icon = document.querySelector('.audio-toggle i');
        icon.className = this.isPlaying ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    },

    updateBackground() {
        // Remove existing animation
        const existing = document.querySelector('.bg-animation');
        if (existing) existing.remove();

        // Add new animation
        const animation = document.createElement('div');
        animation.className = 'bg-animation';
        document.body.prepend(animation);
    }
};

// Initialize Audio Manager
document.addEventListener('DOMContentLoaded', () => {
    AudioManager.init();
});

// Function to update daily wisdom
async function updateDailyWisdom() {
    const wisdomCard = document.querySelector('.wisdom-card');
    const quoteElement = wisdomCard.querySelector('.wisdom-quote');
    const authorElement = wisdomCard.querySelector('.wisdom-author');

    if (!wisdomCard || !quoteElement || !authorElement) {
        console.error('Wisdom card elements not found');
        return;
    }

    try {
        // Add fade-out animation
        quoteElement.style.opacity = '0';
        authorElement.style.opacity = '0';

        // Fetch new wisdom
        const response = await fetch('/api/daily-wisdom');
        const data = await response.json();

        // Wait for fade-out
        await new Promise(resolve => setTimeout(resolve, 300));

        // Update content
        quoteElement.textContent = `"${data.quote}"`;
        authorElement.textContent = `- ${data.author}`;

        // Add fade-in animation
        quoteElement.style.opacity = '1';
        authorElement.style.opacity = '1';
    } catch (error) {
        console.error('Error updating daily wisdom:', error);
    }
}

// Add animations to style
const wisdomStyle = document.createElement('style');
wisdomStyle.textContent = `
    .wisdom-card {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .wisdom-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    .fade-out {
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .fade-in {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
`;
document.head.appendChild(wisdomStyle);

// Update metrics periodically
function updateMetrics() {
    fetch('/api/dashboard-data')
        .then(response => response.json())
        .then(data => {
            document.getElementById('mindset-score').textContent = data.metrics.mood_score;
            document.getElementById('focus-level').style.width = `${data.metrics.focus_level}%`;
            document.getElementById('energy-level').style.width = `${data.metrics.energy_level}%`;
            document.getElementById('stress-level').style.width = `${data.metrics.stress_level}%`;
        })
        .catch(error => console.error('Error fetching metrics:', error));
}

// Initial updates
updateMetrics();
setInterval(updateMetrics, 30000); // Update every 30 seconds 