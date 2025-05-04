import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, Alert, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { BASE_URL } from '../../../config';

export default function SavedJob() {
  const [savedJobs, setSavedJobs] = useState([]); // State to store saved jobs
  const [loading, setLoading] = useState(true); // Loading state
  const navigation = useNavigation(); // Navigation hook

  useEffect(() => {
    const fetchSavedJobs = async () => {
      setLoading(true);
      try {
        // Retrieve the student ID from AsyncStorage
        const studentId = await AsyncStorage.getItem('userId');
        if (!studentId) {
          Alert.alert('Error', 'Student ID not found. Please log in again.');
          return;
        }

        // Fetch saved jobs for the student
        const response = await axios.get(`${BASE_URL}/save-jobs/student/${studentId}`);
        const savedJobsList = response.data;

        if (savedJobsList.length === 0) {
          setSavedJobs([]);
          setLoading(false);
          return;
        }

        // Fetch details for each saved job
        const jobsWithDetails = await Promise.all(
          savedJobsList.map(async (savedJob) => {
            const jobDetailsResponse = await axios.get(`${BASE_URL}/jobs/${savedJob.job_id}`);
            return jobDetailsResponse.data;
          })
        );

        setSavedJobs(jobsWithDetails);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
        Alert.alert('Error', 'Failed to fetch saved jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const handleJobClick = (jobId) => {
    // Navigate to job details page with jobId
    navigation.navigate('JobDetails', { jobId });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#365E7D" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {savedJobs.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Image
            source={require('../../../assets/images/not_found.png')}
            className="w-36 h-36 mb-4"
          />
          <Text className="text-lg text-gray-500">You don't have any saved jobs.</Text>
        </View>
      ) : (
        <ScrollView>
          {savedJobs.map((job) => (
            <Pressable
              key={job.id}
              className="mb-4 bg-white rounded-lg"
              onPress={() => handleJobClick(job.id)}
            >
              <View className="p-4 border-b border-gray-200">
                <Text className="text-lg font-bold">{job.job_title}</Text>
                <Text className="text-sm text-gray-500">{job.company_name}</Text>
                <Text className="text-sm text-gray-400">{job.job_location}</Text>
              </View>
              <View className="p-4">
                <Text className="text-sm text-gray-600">
                  <Text className="font-semibold">Experience:</Text> {job.experience_range}
                </Text>
                <Text className="text-sm text-gray-600">
                  <Text className="font-semibold">Job Type:</Text> {job.job_type}
                </Text>
                <Text className="text-sm text-gray-600">
                  <Text className="font-semibold">Vacancies:</Text> {job.total_vacancies}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
