import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, Pressable } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../config';

export default function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]); // State to store applied jobs with details
  const [loading, setLoading] = useState(true); // Loading state
  const navigation = useNavigation(); // Navigation hook

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      setLoading(true);
      try {
        // Retrieve student ID from AsyncStorage
        const studentId = await AsyncStorage.getItem('userId');
        if (!studentId) {
          Alert.alert('Error', 'Student ID not found. Please log in again.');
          return;
        }

        // Fetch applied jobs
        const response = await axios.get(`${BASE_URL}/job-applications/student/${studentId}`);
        const applications = response.data;

        // Fetch job details for each applied job
        const jobsWithDetails = await Promise.all(
          applications.map(async (application) => {
            const jobDetailsResponse = await axios.get(`${BASE_URL}/jobs/${application.job_id}`);
            return {
              ...application,
              jobDetails: jobDetailsResponse.data,
            };
          })
        );

        setAppliedJobs(jobsWithDetails);
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
        Alert.alert('Error', 'Failed to fetch applied jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  const handleJobClick = (jobId) => {
    // Navigate to job details page with jobId
    navigation.navigate('JobDetails', { jobId });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FF9800'; // Orange for Pending
      case 'rejected':
        return '#F44336'; // Red for Rejected
      case 'selected':
        return '#4CAF50'; // Green for Selected
      default:
        return '#B0BEC5'; // Default gray color
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#365E7D" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {appliedJobs.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-500">You haven't applied to any jobs yet.</Text>
        </View>
      ) : (
        <ScrollView>
          {appliedJobs.map((application) => (
            <Pressable
              key={application.id}
              className="mb-4 bg-white rounded-lg"
              onPress={() => handleJobClick(application.job_id)}
            >
              <View className="p-4 relative">
                {/* Status Badge */}
                <View
                  className="absolute top-2 right-2 px-3 py-1 rounded-full"
                  style={{ backgroundColor: getStatusBadgeColor(application.status) }}
                >
                  <Text className="text-white text-xs font-semibold">{application.status}</Text>
                </View>
                <Text className="text-lg font-bold">{application.jobDetails.job_title}</Text>
                <Text className="text-sm text-gray-500">{application.jobDetails.company_name}</Text>
                <Text className="text-sm text-gray-400">{application.jobDetails.job_location}</Text>
                <Text className="text-sm text-gray-400">
                  Applied on: {new Date(application.application_date).toLocaleDateString()}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
