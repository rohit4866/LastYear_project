import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, Pressable } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '../../../config'; // Import BASE_URL from the config file

export default function ClassroomAllocation() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchClassroomAllocations = async () => {
        try {
          setLoading(true); // Show loading indicator
          const response = await axios.get(`${BASE_URL}/classroom_allocations`); // Use BASE_URL here
          setClassrooms(response.data);
        } catch (error) {
          console.error('Error fetching classroom allocations:', error);
          Alert.alert('Error', 'Failed to load classroom allocations.');
        } finally {
          setLoading(false);
        }
      };

      fetchClassroomAllocations();

      // Optional: Cleanup function
      return () => {
        setClassrooms([]);
        setLoading(true);
      };
    }, [])
  );

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-500';
      case 'close':
        return 'bg-red-500';
      case 'busy':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-300';
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator style={{ height: 100 }} color="#365E7D" />
      </View>
    );
  }

  return (
    <View className="">
      {/* Only show title and "View All" if there are classrooms */}
      {classrooms.length > 0 && (
        <View className="flex-row justify-between items-center mb-4">
          <Text className="font-bold text-lg text-gray-800">Classroom Allocation</Text>
          <Pressable onPress={() => console.log('View All pressed')}>
            <Text className="text-sm text-blue-500 font-semibold">View All</Text>
          </Pressable>
        </View>
      )}

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{ alignItems: 'flex-start' }}
      >
        {classrooms.map((classroom) => (
          <View 
            key={classroom.id} 
            className="relative bg-white p-4 rounded-lg shadow-xl mr-4 w-40 h-28"
          >
            {/* Status Badge */}
            <View className={`absolute top-2 right-2 px-2 py-1 rounded-full ${getStatusBadgeStyle(classroom.status)}`}>
              <Text className="text-white text-xs font-semibold">{classroom.status}</Text>
            </View>

            <Text className="font-semibold text-lg text-gray-800">{classroom.classroom_name}</Text>
            <Text className="text-sm text-gray-600 mt-1">{classroom.classroom_description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
