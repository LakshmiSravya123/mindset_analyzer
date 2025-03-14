import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;

interface AnalysisData {
  daily_patterns: number[];
  correlations: number[];
  trends: {
    metric: string;
    trend: 'increasing' | 'decreasing' | 'stable';
    percentage: number;
  }[];
  patterns: {
    time_of_day: string;
    description: string;
  }[];
}

const AnalysisScreen = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    fetchAnalysisData();
  }, [timeRange]);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/analysis?range=${timeRange}`);
      setAnalysisData(response.data);
    } catch (error) {
      console.error('Error fetching analysis data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTimeRangeSelector = () => (
    <View style={styles.timeRangeContainer}>
      <TouchableOpacity
        style={[styles.timeRangeButton, timeRange === 'week' && styles.activeTimeRange]}
        onPress={() => setTimeRange('week')}
      >
        <Text style={[styles.timeRangeText, timeRange === 'week' && styles.activeTimeRangeText]}>
          Week
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.timeRangeButton, timeRange === 'month' && styles.activeTimeRange]}
        onPress={() => setTimeRange('month')}
      >
        <Text style={[styles.timeRangeText, timeRange === 'month' && styles.activeTimeRangeText]}>
          Month
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.timeRangeButton, timeRange === 'year' && styles.activeTimeRange]}
        onPress={() => setTimeRange('year')}
      >
        <Text style={[styles.timeRangeText, timeRange === 'year' && styles.activeTimeRangeText]}>
          Year
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTrendIndicator = (trend: 'increasing' | 'decreasing' | 'stable') => {
    const iconName = {
      increasing: 'trending-up',
      decreasing: 'trending-down',
      stable: 'trending-neutral',
    }[trend];

    const color = {
      increasing: '#28a745',
      decreasing: '#dc3545',
      stable: '#6c757d',
    }[trend];

    return <Icon name={iconName} size={24} color={color} />;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading analysis...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis</Text>
        <TouchableOpacity onPress={fetchAnalysisData}>
          <Icon name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {renderTimeRangeSelector()}

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Daily Patterns</Text>
        {analysisData && (
          <LineChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{
                data: analysisData.daily_patterns,
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
        {analysisData && (
          <BarChart
            data={{
              labels: ['Sleep', 'Exercise', 'Diet', 'Work'],
              datasets: [{
                data: analysisData.correlations,
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

      <View style={styles.trendsContainer}>
        <Text style={styles.sectionTitle}>Trends</Text>
        {analysisData?.trends.map((trend, index) => (
          <View key={index} style={styles.trendItem}>
            <Text style={styles.trendMetric}>{trend.metric}</Text>
            <View style={styles.trendIndicator}>
              {renderTrendIndicator(trend.trend)}
              <Text style={styles.trendPercentage}>
                {trend.percentage > 0 ? '+' : ''}{trend.percentage}%
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.patternsContainer}>
        <Text style={styles.sectionTitle}>Patterns</Text>
        {analysisData?.patterns.map((pattern, index) => (
          <View key={index} style={styles.patternItem}>
            <Text style={styles.patternTime}>{pattern.time_of_day}</Text>
            <Text style={styles.patternDescription}>{pattern.description}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  timeRangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  activeTimeRange: {
    backgroundColor: '#007AFF',
  },
  timeRangeText: {
    color: '#6c757d',
    fontWeight: '500',
  },
  activeTimeRangeText: {
    color: '#ffffff',
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
  trendsContainer: {
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
  patternsContainer: {
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
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  trendMetric: {
    fontSize: 16,
    color: '#343a40',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendPercentage: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6c757d',
  },
  patternItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  patternTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 4,
  },
  patternDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
});

export default AnalysisScreen; 