import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;

interface Metrics {
  mood_score: number;
  energy_level: number;
  focus_level: number;
  stress_level: number;
}

interface ChartData {
  daily_patterns: number[];
  correlations: number[];
}

interface Insights {
  insights: string[];
  recommendations: string[];
}

const DashboardScreen = ({ navigation }: any) => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/dashboard-data');
      const data = response.data;
      setMetrics(data.metrics);
      setChartData(data.charts);
      setInsights(data.insights);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const renderMetricCard = (title: string, value: number | undefined, color: string) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={[styles.metricValue, { color }]}>{value || '--'}</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${value || 0}%`, backgroundColor: color }]} />
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Mindset Analyzer</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Icon name="cog" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.metricsContainer}>
        {renderMetricCard('Mood Score', metrics?.mood_score, '#28a745')}
        {renderMetricCard('Energy Level', metrics?.energy_level, '#ffc107')}
        {renderMetricCard('Focus Level', metrics?.focus_level, '#17a2b8')}
        {renderMetricCard('Stress Level', metrics?.stress_level, '#dc3545')}
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Daily Patterns</Text>
        {chartData && (
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{
                data: chartData.daily_patterns,
              }],
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        )}
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Correlations</Text>
        {chartData && (
          <BarChart
            data={{
              labels: ['Sleep', 'Exercise', 'Diet', 'Work'],
              datasets: [{
                data: chartData.correlations,
              }],
            }}
            width={screenWidth - 32}
            height={220}
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={styles.chart}
          />
        )}
      </View>

      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>Current Insights</Text>
        {insights?.insights.map((insight, index) => (
          <View key={index} style={styles.insightItem}>
            <Icon name="lightbulb-outline" size={20} color="#ffc107" />
            <Text style={styles.insightText}>{insight}</Text>
          </View>
        ))}
      </View>

      <View style={styles.recommendationsContainer}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {insights?.recommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Icon name="check-circle-outline" size={20} color="#28a745" />
            <Text style={styles.recommendationText}>{recommendation}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
  },
  metricsContainer: {
    padding: 16,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  metricTitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  insightsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recommendationsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#343a40',
    flex: 1,
  },
  recommendationText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#343a40',
    flex: 1,
  },
});

export default DashboardScreen; 