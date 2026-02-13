import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getRecommendations, getPreferences, updatePreferences } from '../../apis/preferences/preferences';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';

const Recommendations = () => {
  const { authToken } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    if (!authToken) return;
    try {
      setLoading(true);
      const data = await getRecommendations(authToken);
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecommendations();
    }, [authToken])
  );

  const handleBookPress = (bookId) => {
    router.push({ pathname: 'books/[id]', params: { id: bookId } });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#DA0D57" />
        <Text style={styles.loadingText}>Finding books for you...</Text>
      </View>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✨ Recommended For You</Text>
      </View>
      <FlatList
        horizontal
        data={recommendations}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.bookCard} onPress={() => handleBookPress(item.id)}>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.bookImage} />
            )}
            <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>
              {item.authors?.join(', ')}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    paddingHorizontal: 16,
  },
  bookCard: {
    width: 120,
    marginRight: 12,
  },
  bookImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});

export default Recommendations;
