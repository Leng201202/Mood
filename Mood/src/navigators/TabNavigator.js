import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AddMoodScreen from '../screens/AddMoodScreen';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileLoginScreen from '../screens/ProfileLoginScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const navigation = useNavigation();
  const currentUser = auth.currentUser;
  const [selectedMood, setSelectedMood] = useState(null);
  const [tabBarColor, setTabBarColor] = useState('#FFF5F2');

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Add') iconName = 'add-circle';
          else if (route.name === 'Profile') iconName = 'person-circle';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: tabBarColor,
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        initialParams={{ 
          setSelectedMood,
          onMoodSelect: (mood) => {
            if (mood) {
              setTabBarColor(mood.color + '30');  // Adding transparency
            } else {
              setTabBarColor('#FFF5F2');  // Reset to default
            }
          }
        }}
      />
      <Tab.Screen 
        name="Add" 
        component={AddMoodScreen}
        options={({ route }) => ({
          tabBarBadge: route?.params?.mood ? '!' : null
        })}
      />
      <Tab.Screen 
        name="Profile" 
        component={currentUser ? ProfileLoginScreen : ProfileScreen}
        initialParams={{ userId: currentUser?.uid }}
      />
    </Tab.Navigator>
  );
}
