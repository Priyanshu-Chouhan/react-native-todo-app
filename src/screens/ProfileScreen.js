import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Card, Text, Avatar } from 'react-native-paper';
import { signOut, updateProfile } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../services/firebase';

export default function ProfileScreen() {
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      setUsername(auth.currentUser.displayName || '');
      loadProfileImage();
    }
  }, []);

  const loadProfileImage = async () => {
    try {
      const image = await AsyncStorage.getItem(`profileImage_${auth.currentUser.uid}`);
      if (image) {
        setProfileImage(image);
      }
    } catch (error) {
      console.log('No profile image found');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true,
    });

    if (!result.canceled) {
      const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      uploadImage(base64);
    }
  };

  const uploadImage = async (uri) => {
    setLoading(true);
    try {
      await AsyncStorage.setItem(`profileImage_${auth.currentUser.uid}`, uri);
      setProfileImage(uri);
      Alert.alert('Success', 'Profile image updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update image: ' + error.message);
    }
    setLoading(false);
  };

  const updateUsername = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    setLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: username
      });
      Alert.alert('Success', 'Username updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update username');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Profile
      </Text>
      
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          {profileImage ? (
            <Avatar.Image size={120} source={{ uri: profileImage }} />
          ) : (
            <Avatar.Icon size={120} icon="account" style={styles.avatar} />
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Username</Text>
          <View style={styles.usernameContainer}>
            <TextInput
              value={username || 'john_doe'}
              onChangeText={setUsername}
              mode="outlined"
              style={styles.usernameInput}
            />
            <Button
              mode="text"
              onPress={updateUsername}
              loading={loading}
              style={styles.editButton}
            >
              ✏️
            </Button>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            value={auth.currentUser?.email || 'john.doe@example.com'}
            mode="outlined"
            style={styles.input}
            editable={false}
          />
        </View>

        <Button
          mode="contained"
          onPress={pickImage}
          style={styles.uploadButton}
          buttonColor="#6c7b7f"
          icon="upload"
        >
          Upload New Profile Photo
        </Button>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor="#6c7b7f"
          icon="logout"
        >
          Logout
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    marginBottom: 30,
    color: '#2c3e50',
  },
  profileCard: {
    flex: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    backgroundColor: '#6c7b7f',
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '500',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usernameInput: {
    flex: 1,
  },
  editButton: {
    marginLeft: 10,
  },
  input: {
    width: '100%',
  },
  uploadButton: {
    width: '100%',
    marginTop: 20,
    marginBottom: 15,
    paddingVertical: 8,
  },
  logoutButton: {
    width: '100%',
    paddingVertical: 8,
  },
});