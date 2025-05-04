import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert, Pressable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function JobDetails() {
  const [job, setJob] = useState(null);
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplied, setIsApplied] = useState(false);
  const navigation = useNavigation();
  const [savedJobs, setSavedJobs] = useState(new Map());
  const route = useRoute();
  const { jobId } = route.params;

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobResponse = await axios.get(`${BASE_URL}/jobs/${jobId}`);
        setJob(jobResponse.data);

        const professorResponse = await axios.get(`${BASE_URL}/professors/${jobResponse.data.professor_id}`);
        setProfessor(professorResponse.data);

        const studentId = await AsyncStorage.getItem('userId');
        if (studentId) {
          const applicationResponse = await axios.get(`${BASE_URL}/job-applications/student/${studentId}`);
          const applicationExists = applicationResponse.data.some(application => application.job_id === jobId);
          setIsApplied(applicationExists);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching job or professor details:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load job details. Please try again later.');
      }
    };

    fetchJobDetails();
  }, [jobId]);
  
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const studentId = await AsyncStorage.getItem('userId');
        if (studentId) {
          const response = await axios.get(`${BASE_URL}/save-jobs/student/${studentId}`);
          const savedJobsMap = new Map();
          response.data.forEach(job => savedJobsMap.set(job.job_id, job.id));
          setSavedJobs(savedJobsMap);
        }
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
        Alert.alert('Error', 'Failed to load saved jobs. Please try again later.');
      }
    };
  
    fetchSavedJobs();
  }, []);
  
  
  const saveJob = async (jobId) => {
    const studentId = await AsyncStorage.getItem('userId');
    if (!studentId) {
      Alert.alert('Error', 'Student ID not found. Please log in again.');
      return;
    }
  
    try {
      const updatedSavedJobs = new Map(savedJobs);
  
      if (updatedSavedJobs.has(jobId)) {
        // Remove the saved job
        const jobSavedId = updatedSavedJobs.get(jobId);
        await axios.delete(`${BASE_URL}/save-jobs/${jobSavedId}`);
        updatedSavedJobs.delete(jobId);
        Alert.alert('Removed', 'Job removed from saved jobs.');
      } else {
        // Save the job
        const response = await axios.post(`${BASE_URL}/save-jobs`, {
          student_id: studentId,
          job_id: jobId,
        });
        if (response.status === 201) {
          updatedSavedJobs.set(jobId, response.data.id);
          Alert.alert('Saved', 'Job saved successfully!');
        }
      }
  
      // Update state
      setSavedJobs(updatedSavedJobs);
    } catch (error) {
      console.error('Error saving/removing job:', error);
      Alert.alert('Error', 'Failed to save or remove the job. Please try again later.');
    }
  };
  

  const applyForJob = async () => {
    try {
      const studentId = await AsyncStorage.getItem('userId');
      if (!studentId) {
        Alert.alert('Error', 'Student ID not found. Please log in again.');
        return;
      }
  
      const applicationData = {
        student_id: studentId,
        job_id: jobId,
      };
  
      const response = await axios.post(`${BASE_URL}/job-applications`, applicationData);
  
      // Check if the response indicates success
      if (response.status === 201 && response.data.message) {
        // Successfully applied
        setIsApplied(true); // Change the button color to green
        Alert.alert('Success', response.data.message); // Show success message
        console.log('Application submitted successfully:', response.data.application);
      } else {
        // Handle unexpected response format
        console.error('Unexpected response format:', response.data);
        Alert.alert('Error', 'Failed to submit the application. Please try again.');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      Alert.alert('Error', 'Failed to submit the application. Please try again later.');
    }
  };   

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator style={{ height: 100 }} color="#365E7D" />
      </View>
    );
  }

  const defaultImage = 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png';

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {professor && (
          <View className="flex-row items-center bg-white p-4 rounded-lg shadow-md m-4">
            <Image 
              source={{ uri: professor.profile_image || defaultImage }}
              className="w-16 h-16 rounded-full mr-4"
            />
            <View>
              <Text className="text-lg font-semibold text-gray-800">Prof. {professor.name}</Text>
              <Text className="text-gray-500">Job created by professor</Text>
            </View>
          </View>
        )}

        {job && (
          <View className="bg-white p-4 rounded-lg shadow-md mx-4 mb-20">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl font-bold text-gray-900">{job.job_title}</Text>
              <Pressable onPress={() => saveJob(job.id)}>
                <Icon name={savedJobs.has(job.id) ? "bookmark" : "bookmark-o"} size={24} color="#365E7D" />
              </Pressable>
            </View>
            <Text className="text-base font-medium text-gray-700 mb-4">{job.company_name}</Text>
            
            <View className="flex-row items-center mb-2">
              <FontAwesome name="map-marker" size={20} color="#365E7D" />
              <Text className="text-gray-600 ml-2">Location: {job.job_location}</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="person" size={20} color="#365E7D" />
              <Text className="text-gray-600 ml-2">Vacancies: {job.total_vacancies}</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <FontAwesome name="briefcase" size={20} color="#365E7D" />
              <Text className="text-gray-600 ml-2">Experience: {job.experience_range}</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="work" size={20} color="#365E7D" />
              <Text className="text-gray-600 ml-2">Job Type: {job.job_type}</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <FontAwesome name="money" size={20} color="#365E7D" />
              <Text className="text-gray-600 ml-2">Salary: {job.salary_range}</Text>
            </View>

            <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">Description</Text>
            {/* Display job description as an unordered list */}
            <View className="pl-4">
              {job.job_description.split('\n').map((line, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Text className="text-gray-600">•</Text>
                  <Text className="text-gray-600 ml-2">{line}</Text>
                </View>
              ))}
            </View>

            <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">Requirements</Text>
            {/* Display requirements as an unordered list */}
            <View className="pl-4">
              {job.requirements.split('\n').map((line, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Text className="text-gray-600">•</Text>
                  <Text className="text-gray-600 ml-2">{line}</Text>
                </View>
              ))}
            </View>

            <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">Company Criteria</Text>
            {/* Display company criteria as an unordered list */}
            <View className="pl-4">
              {job.company_criteria.split('\n').map((line, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Text className="text-gray-600">•</Text>
                  <Text className="text-gray-600 ml-2">{line}</Text>
                </View>
              ))}
            </View>

            <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">Preferred Skills</Text>
            {/* Display preferred skills as an unordered list */}
            <View className="pl-4">
              {job.preferred_skills.split('\n').map((line, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Text className="text-gray-600">•</Text>
                  <Text className="text-gray-600 ml-2">{line}</Text>
                </View>
              ))}
            </View>

            <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">Passout Batch</Text>
            <Text className="text-gray-600 mb-2">{job.passout_batch}</Text>

            <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">Remote</Text>
            <Text className="text-gray-600 mb-2">{job.is_remote ? 'Yes' : 'No'}</Text>

            <Text className="text-lg font-semibold text-gray-800 mt-4 mb-2">Deadline</Text>
            <Text className="text-gray-600">{formatDate(job.application_deadline)}</Text>
          </View>
        )}
        
      </ScrollView>
      
      <View className="absolute bottom-0 left-0 right-0 p-4">
        <TouchableOpacity
          onPress={isApplied ? null : applyForJob}
          className={`p-3 rounded-lg shadow-lg ${isApplied ? 'bg-green-500' : 'bg-primary'}`} 
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
          }}
          disabled={isApplied} // Disable button if already applied
        >
          <Text className="text-white text-center font-bold">
            {isApplied ? 'Applied' : 'Apply'}
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}
