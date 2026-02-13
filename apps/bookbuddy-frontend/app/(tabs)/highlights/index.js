import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getHighlights, createHighlight, deleteHighlight } from '../../apis/highlights/highlights';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#FFE066', '#A8E6CF', '#88D8FF', '#FF8B94'];

const HighlightsScreen = () => {
  const { authToken } = useAuth();
  const [highlights, setHighlights] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [newHighlight, setNewHighlight] = useState({ content: '', pageNumber: '', color: '#FFE066' });

  const fetchHighlights = async () => {
    if (!authToken) return;
    try {
      const data = await getHighlights(authToken);
      setHighlights(data);
    } catch (error) {
      console.error('Error fetching highlights:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHighlights();
    }, [authToken])
  );

  const handleCreateHighlight = async () => {
    if (!newHighlight.content || !selectedBook) return;
    try {
      await createHighlight(authToken, {
        userBookId: selectedBook.id,
        content: newHighlight.content,
        pageNumber: newHighlight.pageNumber || null,
        color: newHighlight.color
      });
      setModalVisible(false);
      setNewHighlight({ content: '', pageNumber: '', color: '#FFE066' });
      fetchHighlights();
    } catch (error) {
      console.error('Error creating highlight:', error);
    }
  };

  const handleDeleteHighlight = async (id) => {
    try {
      await deleteHighlight(authToken, id);
      fetchHighlights();
    } catch (error) {
      console.error('Error deleting highlight:', error);
    }
  };

  const renderHighlight = ({ item }) => (
    <View style={[styles.highlightCard, { borderLeftColor: item.color || '#FFE066' }]}>
      <View style={styles.highlightHeader}>
        <Text style={styles.bookTitle}>{item.userBook?.title || 'Unknown Book'}</Text>
        {item.pageNumber && (
          <Text style={styles.pageNumber}>p. {item.pageNumber}</Text>
        )}
      </View>
      <Text style={styles.highlightContent}>"{item.content}"</Text>
      {item.note && <Text style={styles.highlightNote}>📝 {item.note}</Text>}
      <View style={styles.highlightFooter}>
        <Text style={styles.highlightDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        <TouchableOpacity onPress={() => handleDeleteHighlight(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✏️ Highlights</Text>
      </View>

      {highlights.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>✏️</Text>
          <Text style={styles.emptyText}>No highlights yet</Text>
          <Text style={styles.emptySubtext}>Tap a book to highlight text</Text>
        </View>
      ) : (
        <FlatList
          data={highlights}
          renderItem={renderHighlight}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Color picker for future use */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Highlight</Text>
            
            <Text style={styles.inputLabel}>Book</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bookPicker}>
              {highlights.filter(h => h.userBook).map((h, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.bookChip, selectedBook?.id === h.userBook.id && styles.bookChipActive]}
                  onPress={() => setSelectedBook(h.userBook)}
                >
                  <Text style={[styles.bookChipText, selectedBook?.id === h.userBook.id && styles.bookChipTextActive]}>
                    {h.userBook.title?.slice(0, 20)}...
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Highlighted Text</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter the text you want to highlight..."
              multiline
              value={newHighlight.content}
              onChangeText={text => setNewHighlight({ ...newHighlight, content: text })}
            />

            <Text style={styles.inputLabel}>Page Number (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 42"
              keyboardType="numeric"
              value={newHighlight.pageNumber}
              onChangeText={text => setNewHighlight({ ...newHighlight, pageNumber: text })}
            />

            <Text style={styles.inputLabel}>Color</Text>
            <View style={styles.colorPicker}>
              {COLORS.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorBtn, { backgroundColor: color }, newHighlight.color === color && styles.colorBtnActive]}
                  onPress={() => setNewHighlight({ ...newHighlight, color })}
                />
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleCreateHighlight}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    padding: 16,
  },
  highlightCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  highlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  pageNumber: {
    fontSize: 12,
    color: '#999',
  },
  highlightContent: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  highlightNote: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  highlightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  highlightDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteText: {
    fontSize: 12,
    color: '#FF6B6B',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 12,
  },
  bookPicker: {
    maxHeight: 40,
  },
  bookChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  bookChipActive: {
    backgroundColor: '#DA0D57',
  },
  bookChipText: {
    fontSize: 12,
    color: '#666',
  },
  bookChipTextActive: {
    color: '#FFF',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  colorPicker: {
    flexDirection: 'row',
    gap: 12,
  },
  colorBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  colorBtnActive: {
    borderWidth: 3,
    borderColor: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#DA0D57',
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default HighlightsScreen;
