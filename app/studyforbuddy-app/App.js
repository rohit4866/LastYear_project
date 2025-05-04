import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginNav from './src/Auth/Login';
import Register from './src/Auth/Register';
import BottomNav from './src/Component/BottomNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null); // Start as null while checking user status
  const [loading, setLoading] = useState(true); // Loading state for checking AsyncStorage

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        setInitialRoute('BottomNav'); 
      } else {
        setInitialRoute('Login');
      }
      setLoading(false); 
    };

    checkUserLoggedIn();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator style={{ height: 100 }} color="#365E7D" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginNav} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="BottomNav" component={BottomNav} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
