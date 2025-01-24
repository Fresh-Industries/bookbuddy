import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { deleteToken } from '../../../utils/secureStore';
import { router } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Library from '../../../components/library';
import { useAuth } from '../../../context/AuthContext';

const HomeScreen = () => {
  const { authToken, logout } = useAuth();

  useEffect(() => {
    if (!authToken) {
      router.replace('/');
    }
  }, [authToken]);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome</Text>
      </View>

      <View style={styles.librarySection}>
        <Library />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f4f8', // Updated to a lighter, more modern background color
  },
  header: {
    marginTop: 30,
    padding: 20,
    width: '100%',
    alignItems: 'center', // Center align the header for a more modern look
  },
  title: {
    fontSize: 24,
    fontWeight: '600', // Semi-bold for a modern appearance
    color: '#333',
  },
  librarySection: {
    width: '90%', // Adjust to give more breathing room
    marginVertical: 20,
    paddingVertical: 10,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20, // More pronounced rounded corners for the button
    marginVertical: 20, // Added margin for better spacing from the last section
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;


