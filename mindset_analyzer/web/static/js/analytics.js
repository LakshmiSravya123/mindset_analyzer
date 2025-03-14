// Chart configurations
const weeklyTrendsConfig = {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Mood Score',
            data: [75, 82, 78, 85, 80, 88, 85],
            borderColor: '#4e73df',
            tension: 0.4,
            fill: false
        }, {
            label: 'Energy Level',
            data: [70, 75, 68, 72, 78, 80, 75],
            borderColor: '#1cc88a',
            tension: 0.4,
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Weekly Trends'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
};

const monthlyComparisonConfig = {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Average Mood Score',
            data: [78, 82, 80, 85, 83, 87],
            backgroundColor: '#4e73df'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Comparison'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
};

const factorAnalysisConfig = {
    type: 'radar',
    data: {
        labels: ['Sleep', 'Exercise', 'Diet', 'Social', 'Work', 'Leisure'],
        datasets: [{
            label: 'Impact on Mood',
            data: [85, 75, 70, 65, 60, 55],
            backgroundColor: 'rgba(78, 115, 223, 0.2)',
            borderColor: '#4e73df',
            pointBackgroundColor: '#4e73df',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#4e73df'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Factor Analysis'
            }
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 100
            }
        }
    }
};

const predictiveTrendsConfig = {
    type: 'line',
    data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Actual',
            data: [80, 82, 85, 83],
            borderColor: '#4e73df',
            tension: 0.4,
            fill: false
        }, {
            label: 'Predicted',
            data: [null, null, 85, 87],
            borderColor: '#1cc88a',
            borderDash: [5, 5],
            tension: 0.4,
            fill: false
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Predictive Trends'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
};

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Create chart instances
    const weeklyTrendsChart = new Chart(
        document.getElementById('weeklyTrendsChart'),
        weeklyTrendsConfig
    );

    const monthlyComparisonChart = new Chart(
        document.getElementById('monthlyComparisonChart'),
        monthlyComparisonConfig
    );

    const factorAnalysisChart = new Chart(
        document.getElementById('factorAnalysisChart'),
        factorAnalysisConfig
    );

    const predictiveTrendsChart = new Chart(
        document.getElementById('predictiveTrendsChart'),
        predictiveTrendsConfig
    );

    // Load analytics data
    loadAnalyticsData();
});

// Function to load analytics data
async function loadAnalyticsData() {
    try {
        const response = await fetch('/api/analytics-data');
        const data = await response.json();

        if (data.success) {
            updateCharts(data.data);
            updateStatsTable(data.data.stats);
        } else {
            showError('Failed to load analytics data');
        }
    } catch (error) {
        console.error('Error loading analytics data:', error);
        showError('Failed to load analytics data');
    }
}

// Function to update charts with new data
function updateCharts(data) {
    // Update weekly trends chart
    weeklyTrendsChart.data.labels = data.weeklyTrends.labels;
    weeklyTrendsChart.data.datasets[0].data = data.weeklyTrends.moodScores;
    weeklyTrendsChart.data.datasets[1].data = data.weeklyTrends.energyLevels;
    weeklyTrendsChart.update();

    // Update monthly comparison chart
    monthlyComparisonChart.data.labels = data.monthlyComparison.labels;
    monthlyComparisonChart.data.datasets[0].data = data.monthlyComparison.scores;
    monthlyComparisonChart.update();

    // Update factor analysis chart
    factorAnalysisChart.data.labels = data.factorAnalysis.labels;
    factorAnalysisChart.data.datasets[0].data = data.factorAnalysis.impacts;
    factorAnalysisChart.update();

    // Update predictive trends chart
    predictiveTrendsChart.data.labels = data.predictiveTrends.labels;
    predictiveTrendsChart.data.datasets[0].data = data.predictiveTrends.actual;
    predictiveTrendsChart.data.datasets[1].data = data.predictiveTrends.predicted;
    predictiveTrendsChart.update();
}

// Function to update stats table
function updateStatsTable(stats) {
    const tbody = document.querySelector('#stats-table tbody');
    tbody.innerHTML = '';

    Object.entries(stats).forEach(([metric, data]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${metric}</td>
            <td>${data.mean.toFixed(2)}</td>
            <td>${data.median.toFixed(2)}</td>
            <td>${data.stdDev.toFixed(2)}</td>
            <td>
                <span class="trend-indicator ${data.trend > 0 ? 'positive' : data.trend < 0 ? 'negative' : 'neutral'}">
                    ${data.trend > 0 ? '↑' : data.trend < 0 ? '↓' : '→'}
                </span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Function to show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container-fluid').insertBefore(errorDiv, document.querySelector('.row'));
} 