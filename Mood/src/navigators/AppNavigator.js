import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import ProfileLoginScreen from '../screens/ProfileLoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Group>
          <Stack.Screen name="Tab" component={TabNavigator} />
          <Stack.Screen name="ProfileLogin" component={ProfileLoginScreen} />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignUpScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
