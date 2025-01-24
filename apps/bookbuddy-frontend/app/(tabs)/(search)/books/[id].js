import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getBook, addBookToLibrary } from '../../../../apis/books/books';
import { useAuth } from '../../../../context/AuthContext';

const BookDetail = () => {
    const [book, setBook] = useState(null);
    const [isAdded, setIsAdded] = useState(false);
    const params = useLocalSearchParams();
    const id = params.id;
    const { authToken } = useAuth();

    useEffect(() => {
        // Reset isAdded to false whenever the book ID changes
        setIsAdded(false);
    
        getBook(id).then(setBook).catch(console.error);
    }, [id]); // Dependency array includes `id` to trigger effect when it changes
    




    const addToLibrary = async () => {
        if (!authToken) {
            console.log('You must be logged in to add a book to your library');
            return;
        }

   

        try {
            const bookDetails = {
                googleBooksId: book.id,
                imageUrl: book.volumeInfo.imageLinks.thumbnail,
                title: book.volumeInfo.title,
                authors: book.volumeInfo.authors,
                categories: book.volumeInfo.categories, 
                pageCount: book.volumeInfo.pageCount,
            };

            console.log('Adding book to library:', bookDetails);
            console.log('authToken:', authToken);

            const response = await addBookToLibrary(bookDetails, authToken); // Ensure this function correctly handles the authToken
            console.log('Book added to library:', response);
            setIsAdded(true); 
        } catch (error) {
            console.error('Error adding book to library:', error);
        }
    };

    if (!book) {
        return <Text>Loading...</Text>; // Consider adding a proper loading indicator
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.bookHeader}>
                {book.volumeInfo.imageLinks && (
                    <Image source={{ uri: book.volumeInfo.imageLinks.thumbnail }} style={styles.thumbnail} />
                )}
                <Text style={styles.title}>{book.volumeInfo.title}</Text>
                <Text style={styles.author}>{book.volumeInfo.authors.join(', ')}</Text>
                <Text>{book.volumeInfo.categories ? book.volumeInfo.categories[0] : 'No category'}</Text>
            </View>
            <TouchableOpacity onPress={addToLibrary} style={styles.addButton}>
                <Text style={styles.addButtonText}>{isAdded ? 'Added' : 'Add to Library'}</Text>
            </TouchableOpacity>
            <View style={styles.details}>
                <Text style={styles.description}>{book.volumeInfo.description}</Text>
                {/* You can add more details here */}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  },
  bookHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  thumbnail: {
    width: 150,
    height: 220,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  author: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  details: {
    borderTopColor: '#eee',
    borderTopWidth: 1,
    paddingTop: 20,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
});

export default BookDetail;
