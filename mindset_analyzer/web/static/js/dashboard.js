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

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    const dailyPatternsCtx = document.getElementById('dailyPatternsChart').getContext('2d');
    const correlationsCtx = document.getElementById('correlationsChart').getContext('2d');
    
    dailyPatternsChart = new Chart(dailyPatternsCtx, chartConfigs.dailyPatterns);
    correlationsChart = new Chart(correlationsCtx, chartConfigs.correlations);

    // Sidebar toggle
    document.getElementById('sidebarCollapse').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Load initial data
    loadDashboardData();
});

// Function to load dashboard data
async function loadDashboardData() {
    showLoading();
    try {
        const response = await fetch('/api/dashboard-data');
        const data = await response.json();
        
        // Update metrics
        updateMetrics(data.metrics);
        
        // Update charts
        updateCharts(data.daily_patterns, data.correlations);
        
        // Update insights and recommendations
        updateInsights(data.insights);
        updateRecommendations(data.recommendations);
        
        // Update last update time
        updateLastUpdateTime();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('Failed to load dashboard data. Please try again.');
    } finally {
        hideLoading();
    }
}

// Function to update metrics
function updateMetrics(metrics) {
    const metricElements = {
        'mood-score': metrics.mood_score,
        'energy-level': metrics.energy_level,
        'focus-level': metrics.focus_level,
        'stress-level': metrics.stress_level
    };

    Object.entries(metricElements).forEach(([id, value]) => {
        const element = document.querySelector(`.${id}`);
        if (element) {
            element.textContent = `${value}%`;
            element.style.opacity = '0';
            setTimeout(() => {
                element.textContent = `${value}%`;
                element.style.opacity = '1';
            }, 300);
        }
    });
}

// Function to update charts
function updateCharts(dailyPatterns, correlations) {
    // Update daily patterns chart
    dailyPatternsChart.data.datasets[0].data = dailyPatterns;
    dailyPatternsChart.update('none');

    // Update correlations chart
    correlationsChart.data.datasets[0].data = correlations;
    correlationsChart.update('none');
}

// Function to update insights
function updateInsights(insights) {
    const insightsList = document.getElementById('insights-list');
    insightsList.innerHTML = '';

    insights.forEach(insight => {
        const insightElement = document.createElement('div');
        insightElement.className = `insight-card ${insight.severity.toLowerCase()}`;
        insightElement.innerHTML = `
            <div class="d-flex align-items-center">
                <i class='bx bx-bulb me-2'></i>
                <h6 class="mb-0">${insight.title}</h6>
            </div>
            <p class="mb-0 mt-2">${insight.description}</p>
        `;
        insightsList.appendChild(insightElement);
    });
}

// Function to update recommendations
function updateRecommendations(recommendations) {
    const recommendationsList = document.getElementById('recommendations-list');
    recommendationsList.innerHTML = '';

    recommendations.forEach(rec => {
        const recElement = document.createElement('div');
        recElement.className = 'recommendation-card';
        recElement.innerHTML = `
            <div class="d-flex align-items-center">
                <i class='bx bx-check-circle me-2'></i>
                <h6 class="mb-0">${rec.title}</h6>
            </div>
            <p class="mb-0 mt-2">${rec.description}</p>
        `;
        recommendationsList.appendChild(recElement);
    });
}

// Function to update last update time
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.getElementById('last-update-time').textContent = timeString;
}

// Loading spinner functions
function showLoading() {
    document.querySelector('.loading').style.display = 'block';
}

function hideLoading() {
    document.querySelector('.loading').style.display = 'none';
}

// Error handling
function showError(message) {
    // You can implement a toast notification or alert here
    console.error(message);
}

// Refresh data periodically (every 5 minutes)
setInterval(loadDashboardData, 5 * 60 * 1000); 