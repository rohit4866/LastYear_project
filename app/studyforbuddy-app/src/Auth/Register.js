import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BASE_URL } from '../../config';
import axios from 'axios';

export default function Register() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: true }
    );
  };

  const handleRegister = async () => {
    // Reset loading and error messages
    setLoading(true);

    // Form validation
    if (!name || !email || !mobile || !password || !confirmPassword) {
      showAlert('Validation Error', 'All fields are mandatory');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Validation Error', 'Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Preparing form data for the API call
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('mobile', mobile);
      formData.append('password', password);

      if (image) {
        const fileName = image.split('/').pop();
        const fileType = image.split('.').pop();
        formData.append('profile_image', {
          uri: image,
          name: fileName,
          type: `image/${fileType}`,
        });
      }

      // Register API call
      const response = await axios.post(`${BASE_URL}/students`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        showAlert('Success', 'Registration successful! Please log in.');
        navigation.navigate('Login');
      }
    } catch (error) {
      // Custom error handling based on the backend error message
      let backendMessage = error.response?.data?.error || 'Registration failed. Please try again.';

      if (backendMessage.includes('email')) {
        backendMessage = 'Email already exists. Please use a different email.';
      } else if (backendMessage.includes('mobile')) {
        backendMessage = 'Mobile number already exists. Please use a different mobile number.';
      }

      showAlert('Error', backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-2xl font-bold text-primary">Register with us</Text>
      <Text className="mb-6 mt-2">Register with us and get more opportunities.</Text>

      {/* Profile Image Section */}
      <View className="mb-6">
        <TouchableOpacity onPress={pickImage} className="relative">
          <Image
            source={image ? { uri: image } : { uri: 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png' }}
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
          <View className="absolute bottom-0 right-0 bg-red-500 rounded-full p-1">
            <MaterialCommunityIcons name="plus" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      <TextInput
        label="Name"
        mode="outlined"
        value={name}
        onChangeText={setName}
        className="w-full mb-4 bg-white"
      />
      <TextInput
        label="Email"
        mode="outlined"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        className="w-full mb-4 bg-white"
      />
      <TextInput
        label="Mobile"
        mode="outlined"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
        className="w-full mb-4 bg-white"
      />
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="w-full mb-4 bg-white"
      />
      <TextInput
        label="Confirm Password"
        mode="outlined"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        className="w-full mb-4 bg-white"
      />

      <Button 
        mode="contained" 
        onPress={handleRegister} 
        className="w-full bg-primary rounded"
        loading={loading}
        disabled={loading}
      >
        Register
      </Button>

      <Text 
        className="text-gray-600 mt-4 text-center cursor-pointer"
      >
        Already have an account? <Text className="text-primary font-semibold" onPress={() => navigation.navigate('Login')}>Login</Text>
      </Text>
    </View>
  );
}
