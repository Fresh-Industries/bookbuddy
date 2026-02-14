import React, { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getUserBooks } from '../apis/books/books';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { palette, radius, spacing, type } from '../theme/tokens';

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
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="small" color={palette.primary} />
      </View>
    );
  }

  if (!userBooks.length) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyTitle}>No books yet</Text>
        <Text style={styles.emptySubtitle}>Search for a title and start building your shelf.</Text>
      </View>
    );
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
  loadingWrap: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyWrap: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  emptyTitle: {
    color: palette.text,
    fontSize: 18,
    fontFamily: type.title,
  },
  emptySubtitle: {
    marginTop: spacing.xs,
    color: palette.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: type.body,
  },
  library: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  bookCard: {
    width: 112,
    backgroundColor: '#fff',
    borderRadius: radius.md,
    marginRight: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 170,
    resizeMode: 'cover',
    borderRadius: radius.md,
  },
});

export default Library;
