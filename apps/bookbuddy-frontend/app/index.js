import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, TouchableOpacity, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import { motion, palette, radius, shadow, spacing, type } from '../theme/tokens';

export default function StartScreen() {
  const { authToken } = useAuth();
  const intro = useRef(new Animated.Value(0)).current;
  const actions = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(intro, {
        toValue: 1,
        duration: motion.medium,
        useNativeDriver: true,
      }),
      Animated.timing(actions, {
        toValue: 1,
        duration: motion.short,
        useNativeDriver: true,
      }),
    ]).start();
  }, [actions, intro]);

  useEffect(() => {
    if (authToken) {
      router.replace('/home');
    }
  }, [authToken]);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.topAura} />
      <View style={styles.bottomAura} />

      <Animated.View
        style={[
          styles.hero,
          {
            opacity: intro,
            transform: [
              {
                translateY: intro.interpolate({
                  inputRange: [0, 1],
                  outputRange: [18, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>BookBuddy</Text>
        <Text style={styles.subtitle}>Read with rhythm, track with clarity.</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.actions,
          {
            opacity: actions,
            transform: [
              {
                translateY: actions.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Pressable style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleSignup}>
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: palette.background,
  },
  topAura: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#D7E7FF',
  },
  bottomAura: {
    position: 'absolute',
    bottom: -120,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#DCEBFA',
  },
  hero: {
    marginTop: spacing.xl,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow,
  },
  logo: {
    width: 164,
    height: 164,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 34,
    color: palette.text,
    fontFamily: type.display,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 17,
    color: palette.textMuted,
    fontFamily: type.body,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
    lineHeight: 24,
  },
  actions: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  primaryButton: {
    backgroundColor: palette.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadow,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: type.title,
  },
  secondaryButton: {
    backgroundColor: palette.surface,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: palette.text,
    fontSize: 17,
    fontFamily: type.emphasis,
  },
});
