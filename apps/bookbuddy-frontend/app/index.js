import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Pressable, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router'; 
import InitialHeader from '../components/InitialHeader';

export default function StartScreen() {

    const { authToken } = useAuth();

    useEffect(() => {
        if (authToken) {
            router.replace('(tabs)/home');
        }
    }, [authToken]);


  const handleLogin = () => {
    router.push('login');
  };

  const handleSignup = () => {
    router.push('signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
       <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
      /> 
        <Text style={styles.title}>BookBuddy</Text>
        <Text style={styles.subtitle}>Your next chapter begins here</Text>
      </View>
      
      
      <View>

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  header:{
    width: '100%',
    alignItems: 'center',
    height: 100,
    marginBottom: 10,

  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  logo: {
    width: 250,
    height: 250,
    borderRadius: 75,
  },
  description: {
    fontSize: 16,
    color: '#555',
    paddingHorizontal: 40,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#DA0D57',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    width: 200,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});