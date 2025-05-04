import React, { useState } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/students/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const userId = response.data.data.id;
        await AsyncStorage.setItem('userId', userId); 
        
        navigation.replace('BottomNav');
        console.log('User ID:', userId);
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || 'An error occurred';
        Alert.alert('Login Failed', errorMessage);
      } else {
        Alert.alert('Login Failed', 'An unexpected error occurred');
      }
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      {/* Logo Section */}
      <View className="mb-10">
        <Image
          source={require('../../assets/images/logo.png')} 
          className="w-24 h-24"
        />
      </View>
      
      <Text className="text-2xl font-bold text-primary">Login</Text>
      <Text className="mb-6 mt-2 text-center">Login with Study For Buddy and get more opportunities with us.</Text>

      <TextInput
        label="Email"
        mode="outlined"
        keyboardType="email-address"
        className="w-full mb-4 bg-white"
        style={{ marginBottom: 16 }}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        className="w-full mb-4 bg-white"
        style={{ marginBottom: 16 }}
        value={password}
        onChangeText={setPassword}
      />

      <Button 
        mode="contained" 
        onPress={handleLogin} 
        className="w-full bg-primary rounded-md shadow-lg"
      >
        Login
      </Button>

      <Text 
        className="text-gray-600 mt-4 text-center cursor-pointer"
      >
        Don't have an account? <Text className="text-primary font-semibold" onPress={() => navigation.navigate('Register')}>Register</Text>
      </Text>
    </View>
  );
}
