import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function OnBoarding1() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to BookBuddy</Text>
        <Text style={styles.body}>Track your reading, notes, and goals in one place.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/(onboarding)/onBoarding2')}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#1F2937', marginBottom: 12, textAlign: 'center' },
  body: { fontSize: 16, color: '#4B5563', textAlign: 'center', marginBottom: 24 },
  button: { backgroundColor: '#DA0D57', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  buttonText: { color: '#FFF', fontWeight: '700' },
});
