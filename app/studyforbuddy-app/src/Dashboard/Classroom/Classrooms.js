import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { FAB, TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Classroom() {
  const [modalVisible, setModalVisible] = useState(false);
  const [classroomCode, setClassroomCode] = useState('');
  const [joinedClassrooms, setJoinedClassrooms] = useState([]);
  const [classroomDetails, setClassroomDetails] = useState(null); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch student_id from AsyncStorage and retrieve classrooms
    const fetchStudentClassrooms = async () => {
      try {
        const studentId = await AsyncStorage.getItem('userId');
        if (studentId) {
          const response = await fetch(`http://192.168.43.252:3001/v1/students/${studentId}/classrooms`);
          const data = await response.json();
          
          if (response.status === 200) {
            setJoinedClassrooms(data);
          } else {
            Alert.alert('Error', data.error || 'Failed to fetch classrooms');
          }
        }
      } catch (error) {
        console.error('Error fetching classrooms:', error);
      }
    };

    fetchStudentClassrooms();
  }, []);

  const handleJoinClassroom = async () => {
    try {
      const studentId = await AsyncStorage.getItem('userId'); 
      if (studentId && classroomCode) {
        setLoading(true);

        const response = await fetch('http://192.168.43.252:3001/v1/classrooms/join', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_id: studentId,
            classroom_code: classroomCode,
          }),
        });

        const result = await response.json();
        if (response.status === 200) {
          setModalVisible(false);
          Alert.alert('Success', result.message || 'Successfully joined the classroom');
          setClassroomCode('');
          fetchClassroomDetails(result.classroom_id); 
        } else {
          Alert.alert('Error', result.error || 'Failed to join the classroom');
        }
      } else {
        Alert.alert('Error', 'Invalid classroom code or student ID');
      }
    } catch (error) {
      console.error('Error joining classroom:', error);
      Alert.alert('Error', 'An error occurred while joining the classroom');
    } finally {
      setLoading(false);
    }
  };

  const fetchClassroomDetails = async (classroomId) => {
    try {
      const response = await fetch(`http://192.168.43.252:3001/v1/classrooms/${classroomId}`);
      const data = await response.json();

      if (response.status === 200) {
        setClassroomDetails(data); 
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch classroom details');
      }
    } catch (error) {
      console.error('Error fetching classroom details:', error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-4">
      {/* Floating Action Button */}
      <FAB
        className="absolute bottom-4 right-4 bg-primary"
        icon="plus"
        color="white"
        onPress={() => setModalVisible(true)}
      />

      {/* Display Classroom Details */}
      {classroomDetails && (
        <View className="mb-4">
          <Text className="text-xl font-bold mb-2">Joined Classroom:</Text>
          <Text className="font-semibold">Classroom Name: {classroomDetails.classroom_name}</Text>
          <Text>Description: {classroomDetails.description}</Text>
          <Text>Classroom Code: {classroomDetails.classroom_code}</Text>
        </View>
      )}

      {/* Joined Classrooms List */}
      <View className="mb-4">
        <Text className="text-xl font-bold mb-2">Classrooms You Have Joined:</Text>
        {joinedClassrooms.length > 0 ? (
          joinedClassrooms.map((classroom) => (
            <View key={classroom.id} className="mb-2">
              <Text>{classroom.classroom_name}</Text>
            </View>
          ))
        ) : (
          <Text>No classrooms joined yet</Text>
        )}
      </View>

      {/* Modal for Classroom Code */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="w-11/12 bg-white rounded-xl p-4 shadow-lg">
              <View className="flex">
                <Text className="text-lg font-bold mb-5">Enter Classroom Code</Text>
              </View>
              <TextInput
                mode="outlined"
                label="Classroom Code"
                value={classroomCode}
                onChangeText={setClassroomCode}
                className="bg-white"
              />
              <View className="flex-row justify-between items-center mt-4">
                <Button
                  mode="text"
                  onPress={() => setModalVisible(false)}
                  className="flex-1 rounded-md mr-1"
                  textColor="red"
                >
                  Close
                </Button>
                <Button
                  mode="contained"
                  onPress={handleJoinClassroom}
                  className="rounded-md bg-primary flex-1 ml-1"
                  textColor="white"
                  loading={loading}
                >
                  Join
                </Button>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
