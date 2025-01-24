import React from 'react';
import { View, StyleSheet, TextInput, Button } from 'react-native';
import Modal from 'react-native-modal';


const NoteModal = ({ isVisible, onClose, onNoteChange, note }) => {
    return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={onClose}
      swipeDirection={['down']}
      style={styles.modal}
      onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <TextInput
          style={styles.textInput}
          onChangeText={onNoteChange}
          value={note}
          placeholder="Write your notes here..."
          placeholderTextColor={'#000'}
          multiline={true}
        />
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
);
}

const styles = StyleSheet.create({
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
        minHeight: 400, 
        color: 'black',
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
      },
});

export default NoteModal;

  