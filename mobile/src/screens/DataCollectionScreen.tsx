import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

interface DataPoint {
  timestamp: string;
  value: number;
  category: string;
}

const DataCollectionScreen = () => {
  const [moodScore, setMoodScore] = useState('');
  const [energyLevel, setEnergyLevel] = useState('');
  const [focusLevel, setFocusLevel] = useState('');
  const [stressLevel, setStressLevel] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [exerciseMinutes, setExerciseMinutes] = useState('');
  const [socialInteractions, setSocialInteractions] = useState('');
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(true);

  const handleSubmit = async () => {
    try {
      const data = {
        metrics: {
          mood_score: parseFloat(moodScore),
          energy_level: parseFloat(energyLevel),
          focus_level: parseFloat(focusLevel),
          stress_level: parseFloat(stressLevel),
        },
        additional_data: {
          sleep_hours: parseFloat(sleepHours),
          exercise_minutes: parseFloat(exerciseMinutes),
          social_interactions: parseInt(socialInteractions),
        },
      };

      await axios.post('http://localhost:5000/api/collect-data', data);
      Alert.alert('Success', 'Data collected successfully!');
      clearForm();
    } catch (error) {
      console.error('Error collecting data:', error);
      Alert.alert('Error', 'Failed to collect data. Please try again.');
    }
  };

  const clearForm = () => {
    setMoodScore('');
    setEnergyLevel('');
    setFocusLevel('');
    setStressLevel('');
    setSleepHours('');
    setExerciseMinutes('');
    setSocialInteractions('');
  };

  const renderInputField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    keyboardType: 'numeric' | 'default' = 'default'
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor="#6c757d"
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Data Collection</Text>
        <TouchableOpacity
          style={styles.trackingToggle}
          onPress={() => setIsTrackingEnabled(!isTrackingEnabled)}
        >
          <Text style={styles.trackingText}>
            {isTrackingEnabled ? 'Tracking Enabled' : 'Tracking Disabled'}
          </Text>
          <Switch
            value={isTrackingEnabled}
            onValueChange={setIsTrackingEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isTrackingEnabled ? '#007AFF' : '#f4f3f4'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Mental State Metrics</Text>
        {renderInputField('Mood Score (0-100)', moodScore, setMoodScore, 'Enter mood score', 'numeric')}
        {renderInputField('Energy Level (0-100)', energyLevel, setEnergyLevel, 'Enter energy level', 'numeric')}
        {renderInputField('Focus Level (0-100)', focusLevel, setFocusLevel, 'Enter focus level', 'numeric')}
        {renderInputField('Stress Level (0-100)', stressLevel, setStressLevel, 'Enter stress level', 'numeric')}

        <Text style={styles.sectionTitle}>Additional Data</Text>
        {renderInputField('Sleep Hours', sleepHours, setSleepHours, 'Enter sleep hours', 'numeric')}
        {renderInputField('Exercise Minutes', exerciseMinutes, setExerciseMinutes, 'Enter exercise minutes', 'numeric')}
        {renderInputField('Social Interactions', socialInteractions, setSocialInteractions, 'Enter number of social interactions', 'numeric')}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={!isTrackingEnabled}
        >
          <Icon name="check" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Submit Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearForm}
        >
          <Icon name="refresh" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Clear Form</Text>
        </TouchableOpacity>
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
  trackingToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingText: {
    marginRight: 8,
    color: '#6c757d',
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginTop: 16,
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  buttonContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  submitButton: {
    backgroundColor: '#28a745',
  },
  clearButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default DataCollectionScreen; 