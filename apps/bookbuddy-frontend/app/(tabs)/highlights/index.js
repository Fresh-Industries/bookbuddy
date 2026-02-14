import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getHighlights, createHighlight, deleteHighlight } from '../../../apis/highlights/highlights';
import { useAuth } from '../../../context/AuthContext';
import { palette, radius, shadow, spacing, type } from '../../../theme/tokens';

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
    <SafeAreaView style={styles.container} edges={['top']}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  title: {
    fontSize: 30,
    fontFamily: type.display,
    color: palette.text,
  },
  list: {
    padding: spacing.md,
  },
  highlightCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    ...shadow,
  },
  highlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 14,
    fontFamily: type.emphasis,
    color: palette.textMuted,
    flex: 1,
  },
  pageNumber: {
    fontSize: 12,
    color: palette.textMuted,
    fontFamily: type.body,
  },
  highlightContent: {
    fontSize: 16,
    color: palette.text,
    fontStyle: 'italic',
    lineHeight: 24,
    fontFamily: type.body,
  },
  highlightNote: {
    fontSize: 14,
    color: palette.textMuted,
    marginTop: 8,
    fontStyle: 'italic',
    fontFamily: type.body,
  },
  highlightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  highlightDate: {
    fontSize: 12,
    color: palette.textMuted,
    fontFamily: type.body,
  },
  deleteText: {
    fontSize: 12,
    color: palette.danger,
    fontFamily: type.emphasis,
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
    fontFamily: type.title,
    color: palette.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: palette.textMuted,
    fontFamily: type.body,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.xl,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: type.display,
    color: palette.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: type.emphasis,
    color: palette.textMuted,
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
    backgroundColor: palette.surfaceMuted,
    marginRight: 8,
  },
  bookChipActive: {
    backgroundColor: palette.primary,
  },
  bookChipText: {
    fontSize: 12,
    color: palette.textMuted,
    fontFamily: type.body,
  },
  bookChipTextActive: {
    color: '#FFF',
  },
  input: {
    backgroundColor: palette.surfaceMuted,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: palette.text,
    borderWidth: 1,
    borderColor: palette.border,
    fontFamily: type.body,
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
    borderColor: palette.text,
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
    backgroundColor: palette.surfaceMuted,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontFamily: type.emphasis,
    color: palette.textMuted,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: palette.primary,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: type.emphasis,
    color: '#FFF',
  },
});

export default HighlightsScreen;
