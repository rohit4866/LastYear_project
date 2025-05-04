import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function StartupIdea() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Startup Ideas</Text>
          <Text className="text-base text-gray-600">
            Explore and share your innovative startup ideas with the community.
          </Text>
        </View>
      </ScrollView>

      {/* Floating Button */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50">
        <Pressable
          className="p-3 rounded-lg shadow-lg bg-primary"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
          }}
          onPress={() => navigation.navigate('AddStartup')}
        >
          <Text className="text-white text-center font-bold">Add Startup Idea</Text>
        </Pressable>
      </View>
    </View>
  );
}
