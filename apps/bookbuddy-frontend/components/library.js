import React, { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getUserBooks } from '../apis/books/books';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';

const Library = () => {
  const { authToken } = useAuth();
  const [userBooks, setUserBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchBooks = async () => {
        if (!authToken) return;

        setIsLoading(true);
        try {
          const response = await getUserBooks(authToken);
          setUserBooks(response);
        } catch (error) {
          console.error('Error fetching user books:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBooks();
    }, [authToken])
  );

  const handlePressBook = (id) => {
    router.push({
      pathname: 'userBooks/[id]',
      params: { id },
    });
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.library}>
      {userBooks.map((book, index) => (
        <TouchableOpacity key={index} style={styles.bookCard} onPress={() => handlePressBook(book.id)}>
          <Image source={{ uri: book.imageUrl }} style={styles.image} />
          
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  library: {
    flexDirection: 'row', // Changed to row for horizontal layout
    padding: 10,
    alignItems: 'center',
  },
  bookCard: {
    width: 100, // Adjusted for a snug fit in horizontal layout
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 20, // Adjusted for spacing between books
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%', // Adjusted to fill the width of the bookCard
    height: 160,
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

export default Library;

