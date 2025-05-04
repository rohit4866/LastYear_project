import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable, TextInput, Image, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome for icons
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Snackbar } from 'react-native-paper';
import { BASE_URL } from '../../../config';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Placement() {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState(new Map()); // Store saved jobs in a Map
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [city, setCity] = useState('');
  // const [snackbarVisible, setSnackbarVisible] = useState(false); // Snackbar visibility state
  // const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchJobs = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${BASE_URL}/jobs`);
          setJobs(response.data);

          // Fetch saved jobs to check if they exist
          const studentId = await AsyncStorage.getItem('userId');
          if (studentId) {
            const savedResponse = await axios.get(`${BASE_URL}/save-jobs/student/${studentId}`);
            const savedJobsMap = new Map(savedResponse.data.map(job => [job.job_id, job.id]));
            setSavedJobs(savedJobsMap); // Store saved jobs in state
          }
        } catch (error) {
          console.error('Error fetching jobs:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchJobs();
    }, [])
  );

  const handleJobClick = (jobId) => {
    navigation.navigate('JobDetails', { jobId });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays === 0 ? 'Today' : `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesJobTitle = job.job_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = job.job_location.toLowerCase().includes(city.toLowerCase());
    return matchesJobTitle && matchesCity;
  });

  const saveJob = async (jobId) => {
    const studentId = await AsyncStorage.getItem('userId');
    if (!studentId) {
      Alert.alert('Error', 'Student ID not found. Please log in again.');
      return;
    }

    try {
      // Check if the job is already saved
      if (savedJobs.has(jobId)) {
        // Remove the saved job
        const jobSavedId = savedJobs.get(jobId);
        await axios.delete(`${BASE_URL}/save-jobs/${jobSavedId}`);
        savedJobs.delete(jobId);
        // setSnackbarMessage('Job removed from saved jobs');
      } else {
        // Save the job
        const response = await axios.post(`${BASE_URL}/save-jobs`, {
          student_id: studentId,
          job_id: jobId,
        });
        if (response.status === 201) {
          savedJobs.set(jobId, response.data.id); // Store the saved job ID
          // setSnackbarMessage('Job saved successfully!');
        }
      }

      // Update the saved jobs state
      setSavedJobs(new Map(savedJobs));
    } catch (error) {
      console.error('Error saving/removing job:', error);
      Alert.alert('Error', 'Failed to save or remove the job. Please try again later.');
    } finally {
      // setSnackbarVisible(true); // Show the Snackbar
    }
  };

  // const onDismissSnackbar = () => {
  //   setSnackbarVisible(false); // Dismiss the Snackbar
  // };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator style={{ height: 100 }} color="#365E7D" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Section */}
      <View className="shadow-xl bg-white mb-4 rounded-lg border border-gray-100">
        <View className="flex-row items-center p-2">
          <AntDesign name="search1" size={24} color="#365E7D" style={{ marginLeft: 10 }} />
          <TextInput
            placeholder="Search Job Title"
            value={searchTerm}
            onChangeText={setSearchTerm}
            className="flex-1 p-2"
          />
        </View>

        <View className="border-b border-gray-200" />

        <View className="flex-row items-center p-2">
          <Ionicons name="location-outline" size={24} color="#365E7D" style={{ marginLeft: 10 }} />
          <TextInput
            placeholder="Search City"
            value={city}
            onChangeText={setCity}
            className="flex-1 p-2"
          />
        </View>
      </View>

      <ScrollView className="flex-1">
        {filteredJobs.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Image
              source={require('../../../assets/images/not_found.png')}
              className="w-36 h-36 mb-4 mt-20"
            />
            <Text className="text-md text-gray-600 mb-20">No jobs found based on your search.</Text>
          </View>
        ) : (
          filteredJobs.map((job) => (
            <Pressable
              key={job.id}
              className="mb-4 bg-white rounded-lg shadow-2xl"
              onPress={() => handleJobClick(job.id)} // Navigate when job card is clicked
            >
              {/* Job Header */}
              <View className="p-4 border-b border-gray-200">
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-xl font-bold">{job.job_title}</Text>
                  <Pressable onPress={() => saveJob(job.id)}>
                    <Icon name={savedJobs.has(job.id) ? "bookmark" : "bookmark-o"} size={24} color="#365E7D" />
                  </Pressable>
                </View>
                <Text className="text-gray-700">{job.company_name}</Text>
                <Text className="text-gray-600">{formatDate(job.created_at)}</Text>
              </View>

              {/* Job Details */}
              <View className="p-4">
                <Text className="text-gray-600">
                  <Text className="font-semibold">Location:</Text> {job.job_location}
                </Text>
                <Text className="text-gray-600">
                  <Text className="font-semibold">Vacancies:</Text> {job.total_vacancies}
                </Text>
                <Text className="text-gray-600">
                  <Text className="font-semibold">Experience:</Text> {job.experience_range}
                </Text>
                <Text className="text-gray-600">
                  <Text className="font-semibold">Job Type:</Text> {job.job_type}
                </Text>
                <Text className="text-gray-600">
                  <Text className="font-semibold">Skills:</Text> {job.preferred_skills}
                </Text>

                {/* Render Requirements */}
                {/* <Text className="text-gray-600 mt-2">
                  <Text className="font-semibold">Requirements:</Text>
                </Text>
                {job.requirements.split('\n').map((requirement, index) => (
                  <Text key={`requirement-${index}`} className="text-gray-600 ml-4">
                    • {requirement}
                  </Text>
                ))} */}

                {/* Render Company Criteria */}
                {/* <Text className="text-gray-600 mt-2">
                  <Text className="font-semibold">Company Criteria:</Text>
                </Text>
                {job.company_criteria.split('\n').map((criteria, index) => (
                  <Text key={`criteria-${index}`} className="text-gray-600 ml-4">
                    • {criteria}
                  </Text>
                ))} */}

                {/* Render Job Description */}
                {/* <Text className="text-gray-600 mt-2">
                  <Text className="font-semibold">Job Description:</Text>
                </Text>
                {job.job_description.split('\n').map((description, index) => (
                  <Text key={`description-${index}`} className="text-gray-600 ml-4">
                    • {description}
                  </Text>
                ))} */}
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Snackbar for notifications */}
      {/* <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={Snackbar.DURATION_SHORT}
        action={{
          label: 'Close',
          onPress: () => {
            onDismissSnackbar();
          },
        }}
      >
        {snackbarMessage}
      </Snackbar> */}
    </View>
  );
}
