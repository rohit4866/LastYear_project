import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, Image, ActivityIndicator, ScrollView, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import { Feather } from 'react-native-vector-icons';

const DEFAULT_IMAGE = 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png';

export default function MyProfile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          navigation.replace('Login');
          return;
        }

        const response = await axios.get(`${BASE_URL}/students/${userId}`);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        Alert.alert('Error', 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator style={{ height: 100 }} color="#365E7D" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Profile Image and Details Section */}
        <View className="flex-row items-center mb-6">
          <Image
            source={{ uri: profileData?.profile_image || DEFAULT_IMAGE }}
            className="w-24 h-24 rounded-full mr-5"
          />
          <View>
            <Text className="text-lg font-bold">{profileData?.name}</Text>
            <Text className="text-base flex-wrap">{profileData?.email}</Text>
            <Text className="text-base">+91 {profileData?.mobile}</Text>
          </View>
        </View>

        {/* Personal Info Card */}
        <Pressable>
          <View className="bg-white p-4 mb-4 rounded-lg">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-bold mb-2">Personal Info</Text>
              <Feather name="edit-2" size={14} color="#000" />
            </View>
            <Text className="text-base">Name: {profileData?.name}</Text>
            <Text className="text-base">Email: {profileData?.email}</Text>
            <Text className="text-base">Mobile: +91 {profileData?.mobile}</Text>
            {/* Add more personal info fields as needed */}
          </View>
        </Pressable>

        {/* Educational Details Card */}
        <Pressable>
          <View className="bg-white p-4 mb-4 rounded-lg">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-bold mb-2">Educational Details</Text>
              <Feather name="edit-2" size={14} color="#000" />
            </View>
            {/* Placeholder for educational details */}
            <Text className="text-base">Degree: Bachelor's in Computer Science</Text>
            <Text className="text-base">University: XYZ University</Text>
          </View>
        </Pressable>

        {/* Skills Card */}
        <Pressable>
          <View className="bg-white p-4 mb-4 rounded-lg">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-bold mb-2">Skills</Text>
                <Feather name="edit-2" size={14} color="#000" />
            </View>
            {/* Placeholder for skills */}
            <Text className="text-base">React, React Native, JavaScript, CSS</Text>
          </View>
        </Pressable>

        {/* Resume/CV Card */}
        <Pressable>
          <View className="bg-white p-4 mb-4 rounded-lg">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-bold">Resume/CV</Text>
                <Feather name="edit-2" size={14} color="#000" />
            </View>
            {/* Placeholder for Resume or CV */}
            <Text className="text-base">View or Upload Resume</Text>
          </View>
        </Pressable>

      </View>
    </ScrollView>
  );
}
