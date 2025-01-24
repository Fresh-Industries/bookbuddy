import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { getUser } from '../../../apis/users/users';
import { useAuth } from '../../../context/AuthContext';

const ProfileScreen = () => {

    const [user, setUser] = useState({});
    const { authToken } = useAuth();

    useEffect(() => {
      const fetchUser = async () => {
        try {
          //console.log('Fetching user...'); // Add this!
    
          const response = await getUser(authToken);
          //console.log('User response', response) // Log the entire response
    
          setUser(response); 
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
    
      fetchUser();
    }, [authToken]); 
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://placekitten.com/200/200' }} // Placeholder image
          style={styles.avatar}
        />
        {/* If the user object is not yet available, display a loading message */}
        <Text style={styles.title}>{user ? user.id : 'Loading...'}</Text>
        
      </View>
      <View style={styles.infoSection}>
        <View style={styles.infoContainer}>
        {/* If the user object is not yet available, display a loading message */}
          <Text style={styles.infoTitle}>Username</Text>
          <Text style={styles.infoContent}>{user ? user.username : 'Loading...'}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Books Read</Text>
          <Text style={styles.infoContent}>10</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#f0f0f0', 
  },
  header: {
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50, // Makes the image circular
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoSection: {
    width: '90%', // Gives some padding on the sides
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  infoContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Light grey for the separator
    paddingBottom: 10,
    marginBottom: 10,
  },
  infoTitle: {
    color: '#aaa', // Dark grey for the title
    textTransform: 'uppercase',
    fontSize: 12,
  },
  infoContent: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
});

export default ProfileScreen;
