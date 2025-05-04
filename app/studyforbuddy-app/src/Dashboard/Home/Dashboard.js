import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import Placement from './Placement';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ClassroomAllocation from '../Classroom/ClassroomAllocation';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function Dashboard() {

  const navigation = useNavigation();
  
  // Define the menu items array with label and icon
  const menuItems = [
    // { label: 'My Profile', icon: 'account', navigateTo: 'Profile' },
    { label: 'Startup Idea', icon: 'lightbulb-outline', navigateTo: 'StartupIdea' },
    { label: 'Saved Jobs', icon: 'bookmark-outline', navigateTo: 'SavedJob' }, // Added navigateTo
    { label: 'Applied Jobs', icon: 'briefcase-outline', navigateTo: 'AppliedJobs' },
    { label: 'Settings', icon: 'cog-outline', navigateTo: 'Settings' }
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="flex-row justify-between pt-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {menuItems.map((item, index) => (
            <View className="px-1">
            <Pressable
              key={index}
              className="p-4 bg-white rounded-full flex-row items-center"
              onPress={() => navigation.navigate(item.navigateTo)} // Navigate on press
            >
              <MaterialCommunityIcons name={item.icon} size={20} color="#365E7D" style={{ marginRight: 8 }} />
              <Text className="text-gray-700">{item.label}</Text>
            </Pressable>
            </View>
          ))}
        </ScrollView>
      </View>

      <View className="p-4">
        {/* Placement Component */}
        <Placement />

        <View className="mt-4">
          {/* Classroom allocation */}
          <ClassroomAllocation />
        </View>

        <View className="mt-10">
          <Text className="font-extrabold text-2xl text-primary mb-2">With Love,</Text>
          <Text className="font-extrabold text-3xl text-primary mb-4">
            Study-Buddy <AntDesign name="heart" size={28} color="pink" />
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
