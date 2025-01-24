import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet, Image, Pressable } from 'react-native';
import { searchBooks } from '../../../apis/books/books';
import { router } from 'expo-router';
const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const formattedSearchText = searchText.replace(/\s+/g, "+");
      const data = await searchBooks(formattedSearchText);
      setSearchResults(data.items); // Assuming the data structure includes an items array
    } catch (error) {
      console.error('Error with search:', error);
    }
  };

    const handlePressBook = (id) => {
    router.push({
        pathname: 'books/[id]',
        params: { id },

    });
    }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search books"
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => handlePressBook(item.id)} style={styles.bookItem}>
            {item.volumeInfo.imageLinks && (
              <Image source={{ uri: item.volumeInfo.imageLinks.thumbnail }} style={styles.thumbnail} />
            )}
            <View style={styles.bookInfo}>
              <Text style={styles.title}>{item.volumeInfo.title}</Text>
              <Text style={styles.author}>{item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author'}</Text>
              {/* Optional: Add more details here */}
            </View>
          </Pressable>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#F9F9F9',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    borderRadius: 20,
    borderColor: '#DDD',
    borderWidth: 1,
    marginRight: 10,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#FF6347',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 10,
  },
  bookItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  thumbnail: {
    width: 100,
    height: 150,
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  author: {
    color: '#666',
    fontSize: 16,
  },
});

export default SearchScreen;

