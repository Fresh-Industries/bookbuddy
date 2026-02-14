import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Library from '../../../components/library';
import { useAuth } from '../../../context/AuthContext';
import { motion, palette, radius, shadow, spacing, type } from '../../../theme/tokens';

const HomeScreen = () => {
  const { authToken, logout } = useAuth();
  const intro = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(intro, {
      toValue: 1,
      duration: motion.medium,
      useNativeDriver: true,
    }).start();
  }, [intro]);

  useEffect(() => {
    if (!authToken) {
      router.replace('/');
    }
  }, [authToken]);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.heroCard,
            {
              opacity: intro,
              transform: [
                {
                  translateY: intro.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.eyebrow}>TODAY</Text>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Keep momentum by opening your current read or exploring a new one.</Text>
          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/search')}>
              <Text style={styles.quickBtnText}>Search Books</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.quickBtn, styles.quickBtnGhost]} onPress={() => router.push('/stats/index')}>
              <Text style={[styles.quickBtnText, styles.quickBtnGhostText]}>View Stats</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.libraryHeader}>
          <Text style={styles.sectionTitle}>Your Library</Text>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Text style={styles.linkText}>Add more</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.librarySection}>
          <Library />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: 120,
  },
  heroCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow,
  },
  eyebrow: {
    color: palette.primary,
    fontSize: 12,
    letterSpacing: 1.4,
    fontFamily: type.emphasis,
    marginBottom: spacing.xs,
  },
  title: {
    color: palette.text,
    fontSize: 30,
    fontFamily: type.display,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: palette.textMuted,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: type.body,
  },
  quickRow: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quickBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.pill,
    backgroundColor: palette.primary,
  },
  quickBtnGhost: {
    backgroundColor: palette.primarySoft,
  },
  quickBtnText: {
    color: '#FFFFFF',
    fontFamily: type.emphasis,
    fontSize: 14,
  },
  quickBtnGhostText: {
    color: palette.primary,
  },
  libraryHeader: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    color: palette.text,
    fontFamily: type.title,
  },
  linkText: {
    color: palette.primary,
    fontFamily: type.emphasis,
    fontSize: 14,
  },
  librarySection: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow,
  },
  logoutButton: {
    marginTop: spacing.xl,
    alignSelf: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: '#E9EFFA',
  },
  logoutText: {
    color: palette.textMuted,
    fontFamily: type.emphasis,
    fontSize: 14,
  },
});

export default HomeScreen;
