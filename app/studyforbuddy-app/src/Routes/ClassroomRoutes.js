// src/Routes/ClassroomRoutes.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Classrooms from '../Dashboard/Classroom/Classrooms'; 
import ClassroomAllocation from '../Dashboard/Classroom/ClassroomAllocation';

const Stack = createNativeStackNavigator();

const ClassroomRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Classrooms" component={Classrooms} />
      <Stack.Screen name="ClassroomAllocation" component={ClassroomAllocation} />
    </Stack.Navigator>
  );
};

export default ClassroomRoutes;
