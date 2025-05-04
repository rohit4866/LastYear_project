// src/Routes/HomeRoutes.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../Dashboard/Home/Dashboard';
import JobDetails from '../Dashboard/Home/JobDetails';
import Placement from '../Dashboard/Home/Placement'
import SavedJob from '../Dashboard/Home/SavesJob';
import StartupIdea from '../Dashboard/Home/StartupIdea';
import AddStartup from '../Dashboard/Startup/AddStartup';
import AppliedJobs from '../Dashboard/Home/AppliedJobs';
import Settings from '../Dashboard/Home/Settings';

const Stack = createNativeStackNavigator();

const HomeRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="JobDetails" component={JobDetails} options={{ title: "Job Details" }} />
      <Stack.Screen name="Placement" component={Placement} />
      <Stack.Screen name="SavedJob" component={SavedJob} options={{ title: "Saved Job" }} />
      <Stack.Screen name="AddStartup" component={AddStartup} options={{ title: "Add Startup" }} />
      <Stack.Screen name="StartupIdea" component={StartupIdea} options={{ title: "Startup Idea" }} />
      <Stack.Screen name="AppliedJobs" component={AppliedJobs} options={{ title: "Applied Jobs" }} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};

export default HomeRoutes;
