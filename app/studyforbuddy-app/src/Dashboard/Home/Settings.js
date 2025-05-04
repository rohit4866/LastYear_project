import React, { useState } from 'react';
import { View, Text, Switch, Pressable, Alert, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const navigation = useNavigation();

  const toggleNotifications = () => setNotificationsEnabled(!notificationsEnabled);
  const toggleDarkMode = () => setDarkModeEnabled(!darkModeEnabled);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId'); // Remove user data from storage
      navigation.replace('Login'); // Navigate to login screen
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while logging out.');
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' }, // Cancel button
        { text: 'Logout', style: 'destructive', onPress: handleLogout }, // Confirm logout
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">

      {/* Profile Settings */}
      <Pressable className="flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-3">
        <Text className="text-lg">Profile Settings</Text>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </Pressable>

      {/* Notifications */}
      <View className="flex-row justify-between items-center bg-white px-4 py-2 rounded-lg shadow-sm mb-3">
        <Text className="text-lg">Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          className="transform"
        />
      </View>

      {/* Dark Mode */}
      <View className="flex-row justify-between items-center bg-white px-4 py-2 rounded-lg shadow-sm mb-3">
        <Text className="text-lg">Dark Mode</Text>
        <Switch
          value={darkModeEnabled}
          onValueChange={toggleDarkMode}
          className="transform"
        />
      </View>

      {/* Change Password */}
      <Pressable className="flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-3">
        <Text className="text-lg">Change Password</Text>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </Pressable>

      {/* Privacy Policy */}
      <Pressable className="flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-3">
        <Text className="text-lg">Privacy Policy</Text>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </Pressable>

      {/* Terms of Service */}
      <Pressable className="flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-3">
        <Text className="text-lg">Terms of Service</Text>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </Pressable>

      {/* Delete Account */}
      <Pressable className="flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-3">
        <Text className="text-lg text-red-500">Delete Account</Text>
        <Icon name="chevron-right" size={20} color="#9CA3AF" />
      </Pressable>

      {/* Logout Button */}
      <Pressable
        onPress={confirmLogout}
        className="bg-red-500 p-2 rounded-lg mt-4 mb-10"
      >
        <Text className="text-lg text-white text-center">Logout</Text>
      </Pressable>
    </ScrollView>
  );
}
