import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import DashboardScreen from './src/screens/DashboardScreen';
import DataCollectionScreen from './src/screens/DataCollectionScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="DashboardMain" 
      component={DashboardScreen}
      options={{ title: 'Dashboard' }}
    />
    <Stack.Screen 
      name="DataCollection" 
      component={DataCollectionScreen}
      options={{ title: 'Data Collection' }}
    />
    <Stack.Screen 
      name="Analysis" 
      component={AnalysisScreen}
      options={{ title: 'Analysis' }}
    />
    <Stack.Screen 
      name="Insights" 
      component={InsightsScreen}
      options={{ title: 'Insights' }}
    />
    <Stack.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{ title: 'Settings' }}
    />
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Dashboard':
                iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
                break;
              case 'Data':
                iconName = focused ? 'database' : 'database-outline';
                break;
              case 'Analysis':
                iconName = focused ? 'chart-line' : 'chart-line-variant';
                break;
              case 'Insights':
                iconName = focused ? 'lightbulb' : 'lightbulb-outline';
                break;
              case 'Settings':
                iconName = focused ? 'cog' : 'cog-outline';
                break;
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardStack}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App; 