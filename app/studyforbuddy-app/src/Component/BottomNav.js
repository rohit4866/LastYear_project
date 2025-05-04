import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Entypo , MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import HomeRoutes from '../Routes/HomeRoutes';
import ClassroomRoutes from '../Routes/ClassroomRoutes';
import ProfileRoutes from '../Routes/ProfileRoutes';

const Tab = createMaterialBottomTabNavigator();

const BottomNav = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeRoutes"
      activeColor="#365E7D"
      inactiveColor="gray"
      barStyle={{ backgroundColor: 'white', borderTopWidth: 1, borderColor: '#ddd' }}
    >
      <Tab.Screen 
        name="HomeRoutes" 
        component={HomeRoutes} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Entypo name="home" color={color} size={24} />
          ),
        }} 
      />
      <Tab.Screen 
        name="ClassroomRoutes" 
        component={ClassroomRoutes} 
        options={{
          tabBarLabel: 'Classrooms',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="google-classroom" color={color} size={24} />
          ),
        }} 
      />
      <Tab.Screen 
        name="ProfileRoutes" 
        component={ProfileRoutes} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-circle" color={color} size={24} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
};

export default BottomNav;
