import React, { useState, useEffect } from 'react';
import { ScrollView,View ,Text, Button, StyleSheet, TouchableOpacity,TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { createReadingSession } from '../../../apis/readingSessions/readingSessions';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import NoteModal from '../../../components/NoteModal';
import SummaryModal from '../../../components/SummaryModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUserBook } from '../../../apis/books/books';



const ReadingTracker = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [newNote, setNewNote] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pagesRead, setPagesRead] = useState(0);
  const [pagesReadInput, setPagesReadInput] = useState(''); 
  const [duration, setDuration] = useState(300); // Default to 5 minutes (300 seconds)
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [key, setKey] = useState(0); // Used to reset the timer
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [notes, setNotes] = useState(''); // State to store the notes

  const { authToken } = useAuth();

  const params = useLocalSearchParams();
  const { id } = params;

  

  // Function to toggle the notes modal visibility
  const toggleNotesModal = () => {
    setNotesModalVisible(!notesModalVisible);
    setNewNote(true);
  };


  const handleEndSessionPress = () => {
    setSubmitting(true); // Enable submission mode
  };


  const toggleSummaryModal = () => {
    const sessionId = AsyncStorage.getItem('sessionId'); // Retrieve session ID from LocalStorage
    console.log("Session ID:", sessionId); 
    setSummaryModalVisible(!summaryModalVisible);
  };


  const handleEndSession = async () => {
    if (submitting) {
      // Parse pagesRead input and update state
      const pagesReadNum = parseInt(pagesReadInput, 10) || 0;
      setPagesRead(pagesReadNum);

      try {
        const sessionData = {
          userId: authToken,
          userBookId: parseInt(id),
          startedAt: new Date(),
          pageEnd: pagesReadNum,
          timeSpent: parseInt(duration / 60),
          notesContent: notes,
        };

        const response = await createReadingSession(authToken, sessionData);
        const updateBook = await updateUserBook(authToken, id, {pagesRead: pagesReadNum});
        console.log('Reading session created:', response);
        console.log('Book updated:', updateBook);
        const sessionId = JSON.stringify(response.id);
        await AsyncStorage.setItem('readingSessionId', sessionId );
        toggleSummaryModal(); 
      } catch (error) {
        console.error('Error creating reading session:', error);
      }

      setSubmitting(false);
    }
  };

  const togglePlaying = () => {
    setIsPlaying(prev => !prev);
  };

  const resetTimer = () => {
    setIsPlaying(false);
    setKey(prevKey => prevKey + 1);
    setPickerVisible(false); // Ensure picker is hidden on reset
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CountdownCircleTimer
        key={key}
        isPlaying={isPlaying}
        duration={duration}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[duration, duration * 0.66, duration * 0.33, 0]}
      >
        {({ remainingTime }) => (
          <View style={styles.timer}>
            <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
          </View>
        )}
      </CountdownCircleTimer>

      <View style={styles.buttonContainer}>
        <Button style={styles.button} title={isPlaying ? 'Pause' : 'Start'} onPress={togglePlaying} />
        <Button title="Reset" onPress={resetTimer} />
        <Button title="Set Duration" onPress={() => setPickerVisible(true)} />
      </View>

      {pickerVisible && (
        <Picker
          selectedValue={duration}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setDuration(itemValue);
            setPickerVisible(false); // Optionally hide picker after selection
          }}>
          {[...Array(12).keys()].map(i => (
            <Picker.Item key={i} label={`${(i + 1) * 5} minutes`} value={(i + 1) * 5 * 60} />
          ))}
        </Picker>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={toggleNotesModal}
        activeOpacity={0.7} 
      >
        <Text style={styles.buttonText}>{newNote ? 'Show Notes' : '+ Note'}</Text>
      </TouchableOpacity>
      {submitting ? (
        <>
          <TextInput
            style={styles.textInput}
            placeholder="Page Ended on"
            keyboardType="numeric"
            value={pagesReadInput}
            onChangeText={setPagesReadInput}
          />
          <Button title="Submit" onPress={handleEndSession} />
        </>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleEndSessionPress}>
          <Text style={styles.buttonText}>End Session</Text>
        </TouchableOpacity>
      )}
      <NoteModal
        isVisible={notesModalVisible}
        onClose={toggleNotesModal}
        onNoteChange={setNotes}
        note={notes}
      />

      <SummaryModal
        isVisible={summaryModalVisible}
        onClose={toggleSummaryModal}
        pagesRead={pagesRead}
        duration={duration}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  timer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#004777',
    marginBottom: 10, // Added space below the timer for visual separation
  },
  buttonText: {
    color: 'white',
    fontWeight: '500', // Adjusted for better readability
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%', // Removed duplicate
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  picker: {
    width: 200,
    height: 150,
  },
  button: {
    backgroundColor: '#004777',
    padding: 10,
    borderRadius: 10,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0, 
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  textInput: {
    width: '100%',
    minHeight: 20, // Increased height for a larger writing area
    color: 'black',
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  pagesModal: {
    justifyContent: 'center',
    margin: 0,
    alignItems: 'center',
  },
  pagesModalContent: {
    backgroundColor: 'white',
    padding: 22,
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  
});

export default ReadingTracker;
