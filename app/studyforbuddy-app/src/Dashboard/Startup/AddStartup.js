import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, Platform } from 'react-native';
import { TextInput, Button, SegmentedButtons } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import FileViewer from 'react-native-file-viewer';

export default function AddStartup() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);

  const validateField = (field) => field.trim() === '';

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'video/mp4',
          'image/jpeg',
          'image/png',
        ],
        copyToCacheDirectory: true, // Ensures file accessibility
        multiple: true, // Allow multiple files to be selected
      });

      console.log('File selection result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUploadedFiles((prevFiles) => [...prevFiles, ...result.assets]); // Append the new files to the existing ones
        alert('Files uploaded successfully!');
      } else if (result.canceled) {
        alert('File upload canceled.');
      } else {
        alert('No files selected.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the files.');
    }
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index)); // Remove a file by index
  };

  const handleSubmit = () => {
    if (validateField(title) || validateField(description)) {
      alert('Please fill out all required fields.');
      return;
    }
    const startupData = {
      title,
      description,
      visibility,
      uploadedFiles,
    };
    console.log('Startup Idea:', startupData);
    alert('Startup idea submitted successfully!');
  };

  return (
    <ScrollView className="flex-1 p-4 bg-gray-50">
      <Text className="text-lg font-semibold mb-4">Add Your Startup Idea</Text>

      {/* Title Input */}
      <TextInput
        label="Startup Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        className="bg-gray-50 mb-4"
      />

      {/* Description Input as a TextArea */}
      <TextInput
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={6}
        placeholder="Write a detailed description of your startup idea..."
        className="mb-4 bg-gray-50"
        style={{ height: 100 }}
      />

      {/* Visibility Section */}
      <Text className="font-semibold text-gray-700 mb-2">
        Who can see your idea?
      </Text>
      <SegmentedButtons
        value={visibility}
        onValueChange={setVisibility}
        buttons={[
          { value: 'professors', label: 'Professors', multiselect: true, showSelectedCheck: true },
          { value: 'students', label: 'Students', multiselect: true, showSelectedCheck: true },
          { value: 'professors, students', label: 'Both', multiselect: true, showSelectedCheck: true },
        ]}
        className="mb-6"
      />

      {/* Upload Section Title */}
      <Text className="font-semibold text-gray-700 mb-2">
        Upload Presentation or Demo
      </Text>

      {/* File Upload Section */}
      <View className="mb-4 border border-dashed border-gray-300 p-6">
        <TouchableOpacity onPress={handleFileUpload} className="flex items-center">
          <Icon name="upload" size={40} color="#9ca3af" />
          <Text className="text-gray-500 mt-2">
            Tap to upload (PDF, DOC, PPT, MP4, Images)
          </Text>
        </TouchableOpacity>
      </View>

      {uploadedFiles.length > 0 && (
        <View>
          {uploadedFiles.map((file, index) => (
            <View key={index} className="flex flex-row items-center justify-between p-4 border border-dashed border-gray-300">
              <Text className="text-sm text-gray-600">{file.name}</Text>
              <View className="flex flex-row items-center space-x-4">
                <TouchableOpacity>
                  <Icon name="eye" size={24} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemoveFile(index)}>
                  <Icon name="close-circle" size={24} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* File Preview Modal */}
      <Modal visible={previewVisible} animationType="slide" transparent={true} onRequestClose={() => setPreviewVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black" style={{ opacity: 0.5 }}>
          <View className="w-4/5 bg-white rounded-lg p-6">
            <Text className="text-lg font-semibold mb-4">File Preview</Text>
            <Text>{uploadedFiles.length > 0 ? uploadedFiles[0].name : 'No File to Preview'}</Text>
            <Button onPress={() => setPreviewVisible(false)} mode="contained" className="mt-4 bg-primary">
              Close
            </Button>
          </View>
        </View>
      </Modal>

      {/* Submit Button */}
      <Button mode="contained" onPress={handleSubmit} className="bg-primary rounded-lg mt-6 mb-10">
        Submit Idea
      </Button>
    </ScrollView>
  );
}
