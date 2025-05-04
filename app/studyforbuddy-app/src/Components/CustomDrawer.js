// src/Navigation/DrawerRoutes.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from '../Dashboard/Home/Dashboard'; // Adjust the import path as necessary
import CustomDrawer from '../Components/CustomDrawer'; // Import the custom drawer component

const Drawer = createDrawerNavigator();

const DrawerRoutes = () => {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      {/* You can add more drawer routes here */}
    </Drawer.Navigator>
  );
};

export default DrawerRoutes;
