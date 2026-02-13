import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, FlatList, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getGoals, createGoal, updateGoalProgress, deleteGoal } from '../../apis/goals/goals';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const GoalsScreen = () => {
  const { authToken } = useAuth();
  const [goals, setGoals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState({ type: 'pages', target: '', month: null });

  const fetchGoals = async () => {
    if (!authToken) return;
    try {
      const data = await getGoals(authToken);
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [authToken])
  );

  const handleCreateGoal = async () => {
    if (!newGoal.target) return;
    try {
      await createGoal(authToken, {
        year: new Date().getFullYear(),
        month: newGoal.month,
        type: newGoal.type,
        target: parseInt(newGoal.target)
      });
      setModalVisible(false);
      setNewGoal({ type: 'pages', target: '', month: null });
      fetchGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await deleteGoal(authToken, id);
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const getGoalProgress = (goal) => {
    const progress = goal.progress || 0;
    return Math.min((progress / goal.target) * 100, 100);
  };

  const getGoalTypeLabel = (type) => {
    switch (type) {
      case 'pages': return '📖 Pages';
      case 'books': return '📚 Books';
      case 'minutes': return '⏱️ Minutes';
      default: return type;
    }
  };

  const renderGoal = ({ item }) => (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalType}>{getGoalTypeLabel(item.type)}</Text>
        <TouchableOpacity onPress={() => handleDeleteGoal(item.id)}>
          <Text style={styles.deleteBtn}>✕</Text>
        </TouchableOpacity>
      </View>
      
      {item.month && (
        <Text style={styles.goalMonth}>
          {new Date(item.month, 0).toLocaleString('default', { month: 'long' }}
        </Text>
      )}
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${getGoalProgress(item)}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {item.progress || 0} / {item.target}
        </Text>
      </View>
      
      <Text style={styles.progressPercent}>
        {Math.round(getGoalProgress(item))}% complete
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎯 Reading Goals</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {goals.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎯</Text>
          <Text style={styles.emptyText}>No goals yet</Text>
          <Text style={styles.emptySubtext}>Set a reading goal to track your progress</Text>
        </View>
      ) : (
        <FlatList
          data={goals}
          renderItem={renderGoal}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Create Goal Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Goal</Text>
            
            <Text style={styles.inputLabel}>Goal Type</Text>
            <View style={styles.typeSelector}>
              {['pages', 'books', 'minutes'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeBtn, newGoal.type === type && styles.typeBtnActive]}
                  onPress={() => setNewGoal({ ...newGoal, type })}
                >
                  <Text style={[styles.typeText, newGoal.type === type && styles.typeTextActive]}>
                    {type === 'pages' ? '📖 Pages' : type === 'books' ? '📚 Books' : '⏱️ Minutes'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Target</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 1000"
              keyboardType="numeric"
              value={newGoal.target}
              onChangeText={text => setNewGoal({ ...newGoal, target: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleCreateGoal}>
                <Text style={styles.saveBtnText}>Save Goal</Text>
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
  addBtn: {
    backgroundColor: '#DA0D57',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addBtnText: {
    color: '#FFF',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  goalCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  deleteBtn: {
    color: '#999',
    fontSize: 18,
    padding: 4,
  },
  goalMonth: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  progressBar: {
    flex: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#DA0D57',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: 80,
    textAlign: 'right',
  },
  progressPercent: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
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
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: '#DA0D57',
  },
  typeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  typeTextActive: {
    color: '#FFF',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
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

export default GoalsScreen;
