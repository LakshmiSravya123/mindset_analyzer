import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

interface Insight {
  id: string;
  title: string;
  description: string;
  category: 'mental_health' | 'productivity' | 'lifestyle' | 'relationships';
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'mental_health' | 'productivity' | 'lifestyle' | 'relationships';
  action_items: string[];
}

const InsightsScreen = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchInsightsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/insights');
      setInsights(response.data.insights);
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error('Error fetching insights data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInsightsData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInsightsData();
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      mental_health: 'brain',
      productivity: 'chart-line',
      lifestyle: 'heart-pulse',
      relationships: 'account-group',
    };
    return icons[category as keyof typeof icons] || 'information';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: '#dc3545',
      medium: '#ffc107',
      low: '#28a745',
    };
    return colors[priority as keyof typeof colors] || '#6c757d';
  };

  const filteredInsights = selectedCategory
    ? insights.filter(insight => insight.category === selectedCategory)
    : insights;

  const filteredRecommendations = selectedCategory
    ? recommendations.filter(rec => rec.category === selectedCategory)
    : recommendations;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading insights...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Insights</Text>
        <TouchableOpacity onPress={fetchInsightsData}>
          <Icon name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[styles.categoryButton, !selectedCategory && styles.activeCategory]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.categoryText, !selectedCategory && styles.activeCategoryText]}>
            All
          </Text>
        </TouchableOpacity>
        {['mental_health', 'productivity', 'lifestyle', 'relationships'].map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.activeCategory]}
            onPress={() => setSelectedCategory(category)}
          >
            <Icon
              name={getCategoryIcon(category)}
              size={20}
              color={selectedCategory === category ? '#ffffff' : '#6c757d'}
            />
            <Text style={[styles.categoryText, selectedCategory === category && styles.activeCategoryText]}>
              {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Insights</Text>
        {filteredInsights.map(insight => (
          <View key={insight.id} style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Icon name={getCategoryIcon(insight.category)} size={24} color="#007AFF" />
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(insight.priority) }]}>
                <Text style={styles.priorityText}>{insight.priority}</Text>
              </View>
            </View>
            <Text style={styles.insightDescription}>{insight.description}</Text>
            <Text style={styles.insightTimestamp}>{new Date(insight.timestamp).toLocaleDateString()}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {filteredRecommendations.map(recommendation => (
          <View key={recommendation.id} style={styles.recommendationCard}>
            <View style={styles.recommendationHeader}>
              <Icon name={getCategoryIcon(recommendation.category)} size={24} color="#28a745" />
              <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
            </View>
            <Text style={styles.recommendationDescription}>{recommendation.description}</Text>
            <View style={styles.actionItemsContainer}>
              <Text style={styles.actionItemsTitle}>Action Items:</Text>
              {recommendation.action_items.map((item, index) => (
                <View key={index} style={styles.actionItem}>
                  <Icon name="check-circle-outline" size={20} color="#28a745" />
                  <Text style={styles.actionItemText}>{item}</Text>
                </View>
              ))}
            </View>
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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
    marginBottom: 8,
  },
  activeCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    marginLeft: 8,
    color: '#6c757d',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#ffffff',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 16,
  },
  insightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginLeft: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  insightDescription: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  insightTimestamp: {
    fontSize: 14,
    color: '#adb5bd',
  },
  recommendationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginLeft: 8,
  },
  recommendationDescription: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 16,
  },
  actionItemsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  actionItemsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 8,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionItemText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6c757d',
  },
});

export default InsightsScreen; 