import React, { useState, useEffect } from 'react';
import { ScrollView, View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Rating, Button as ElementsButton } from 'react-native-elements';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../../../context/AuthContext';
import { getUserBookById } from '../../../../apis/users/users';
import { updateUserBook } from '../../../../apis/books/books';
import { getUserNotesByBookId } from '../../../../apis/users/users';

const BookDetail = () => {
    const [book, setBook] = useState(null);
    const [notes, setNotes] = useState([]);
    const [status, setStatus] = useState('Want to Read');
    const [rating, setRating] = useState();
    const [pagesRead, setPagesRead] = useState(0);
    const [startedAt, setStartedAt] = useState(new Date());
    const [finishedAt, setFinishedAt] = useState(new Date());
    const params = useLocalSearchParams();
    const { id } = params;
    const { authToken } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const fetchedBook = await getUserBookById(authToken, id);
                setBook(fetchedBook);
                setStatus(fetchedBook.status || 'Want to Read');
                setRating(fetchedBook.rating);
                setPagesRead(fetchedBook.pagesRead);
                setStartedAt(new Date(fetchedBook.startedAt) || new Date());
                setFinishedAt(new Date(fetchedBook.finishedAt) || new Date());
            } catch (error) {
                console.error('Error fetching book:', error);
            }
        };
        fetchBookDetails();
    }, [id, authToken]);

    useEffect(() => {
        if (book) {
            updateBookDetails();
        }
    }, [status, rating]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const fetchedNotes = await getUserNotesByBookId(authToken, id);
                if (fetchedNotes && fetchedNotes.length > 0) {
                    setNotes(fetchedNotes);
                } else {
                    console.log('No notes fetched or notes array is empty');
                }
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };

        fetchNotes();
    }, [id, authToken]);

    const updateBookDetails = async () => {
        const data = {
            status,
            rating,
            startedAt: startedAt.toISOString(),
            finishedAt: finishedAt.toISOString(),
        };

        try {
            await updateUserBook(authToken, id, data);
            console.log('Book updated successfully');
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const onStartReading = (id) => {
        if (status === 'Want to Read') {
            setStartedAt(new Date());
        }
        setStatus('Reading');
        router.push({ pathname: "/readingTracker", params: {id} });
    };

    if (!book) {
        return <Text>Loading...</Text>;
    }

    return (
      <ScrollView style={styles.container}>
          <View style={styles.header}>
              {book.imageUrl && (
                  <Image source={{ uri: book.imageUrl }} style={styles.thumbnail} />
              )}
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.author}>{book.authors ? book.authors.join(', ') : 'No Authors'}</Text>
              <Rating
                  type="custom"
                  imageSize={40}
                  ratingColor = "orange"
                  onFinishRating={(rating) => setRating(rating)}
                  style={styles.rating}
                  startingValue={rating}
              />
          </View>

          <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                  <Text style={styles.statValue}>{book.pageCount || 'N/A'}</Text>
                  <Text style={styles.statLabel}>Pages</Text>
              </View>
              <View style={styles.statItem}>
                  <Text style={styles.statValue}>{status}</Text>
                  <Text style={styles.statLabel}>Status</Text>
              </View>
              <View style={styles.statItem}>
                  <Text style={styles.statValue}>{pagesRead} </Text>
                  <Text style={styles.statLabel}>Pages Read</Text>
              </View>
          </View>

          <View>
                <Text style={styles.notesHeader}>Notes</Text>
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <View key={note.id} style={styles.noteItem}>
                            <Text style={styles.noteContent}>{note.content}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noNotesText}>No notes available</Text>
                )}
            </View>

          

          <View style={styles.actionButtons}>
              <ElementsButton buttonStyle={styles.startReadingButton} title="Start Reading"   onPress={() => onStartReading(book.id)} />
          </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#FFF',
  },
  header: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 50,
      padding: 20,
  },
  thumbnail: {
      width: 120,
      height: 180,
      borderRadius: 10,
      marginBottom: 10,
  },
  title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#313131',
      textAlign: 'center',
  },
  author: {
      fontSize: 18,
      color: '#686868',
      textAlign: 'center',
  },
  statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginHorizontal: 20,
      borderRadius: 20,
      backgroundColor: '#F1F1F1',
      padding: 20,
  },
  statItem: {
      width: '30%', // Adjust based on your layout preference
      alignItems: 'center',
      marginBottom: 20,
  },
  statValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#007AFF', // Primary color for stats values
  },
  statLabel: {
      fontSize: 16,
      color: '#686868', // Secondary text color for labels
  },
  actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 20,
  },
  updateButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
  },
  startReadingButton: {
      backgroundColor: '#34C759', // A distinct color for the primary action
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
  },
  rating: {
      marginVertical: 20,
  },

  statusSelector: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
},
statusButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
    color: 'white',
    marginHorizontal: 5,
},
statusButtonActive: {
  backgroundColor: '#007AFF',
},
notesHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
},
noteItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
},
noteContent: {
    fontSize: 16,
},
noNotesText: {
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
},
});

export default BookDetail;