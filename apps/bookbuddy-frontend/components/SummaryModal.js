import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Modal from 'react-native-modal';
import { router } from 'expo-router';

const SummaryModal = ({ isVisible, onClose, pagesRead, duration }) => {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleDiscussionPress = () => {
    router.push('readingSessionChatbot');
  };

  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={styles.modal}
      onBackdropPress={onClose}
    >
      <View style={styles.modalContent}>
        <Text style={styles.title}>Session Summary</Text>
        <Text style={styles.summaryText}>Pages Read: {pagesRead}</Text>
        <Text style={styles.summaryText}>Duration: {formatTime(duration)}</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDiscussionPress}>
          <Text style={styles.buttonText}>Discussion</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    minHeight: 300, // Adjusted for content size
    padding: 22,
    alignItems: 'center',
    borderRadius: 20, // Rounded corners
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default SummaryModal;
