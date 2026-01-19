import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OnboardingScreen from './screens/OnboardingScreen';
import ChatScreen from './screens/ChatScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0066FF',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { 
          height: 70, 
          paddingBottom: 10,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0'
        }
      }}
    >
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{
          tabBarLabel: '대화',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💬</Text>
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen}
        options={{
          tabBarLabel: '히스토리',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📚</Text>
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: '설정',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⚙️</Text>
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      setIsOnboarded(!!token);
    } catch (error) {
      console.error('Check onboarding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
