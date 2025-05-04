// src/Routes/ProfileRoutes.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyProfile from '../Dashboard/Profile/MyProfile'; 
import MyApplications from '../Dashboard/Profile/MyApplications';

const Stack = createNativeStackNavigator();

const ProfileRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyProfile" component={MyProfile} options={{ title: "My Profile"}} />
      <Stack.Screen name="MyApplications" component={MyApplications} />
    </Stack.Navigator>
  );
};

export default ProfileRoutes;
