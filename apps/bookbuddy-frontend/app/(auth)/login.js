import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { login } from '../../apis/auth/auth';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { motion, palette, radius, shadow, spacing, type } from '../../theme/tokens';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login: loginContext } = useAuth();
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: motion.medium,
      useNativeDriver: true,
    }).start();
  }, [cardAnim]);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMessage('Enter your email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const data = { email, password };
      const response = await login(data);
      if (response && response.token) {
        loginContext(response.token);
        router.replace('/home');
      }
    } catch (error) {
      console.error('Error with login:', error);
      setErrorMessage(error?.message || 'Could not sign in right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.topAura} />
      <View style={styles.bottomAura} />

      <Animated.View
        style={[
          styles.card,
          {
            opacity: cardAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue reading where you left off.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor={palette.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={palette.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkBtn} onPress={() => router.push('/signup')} disabled={loading}>
          <Text style={styles.linkText}>Need an account? Create one</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: palette.background,
  },
  topAura: {
    position: 'absolute',
    top: -100,
    left: -80,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#D8E7FF',
  },
  bottomAura: {
    position: 'absolute',
    bottom: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#DCEBFB',
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow,
  },
  logo: {
    width: 108,
    height: 108,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 30,
    fontFamily: type.display,
    color: palette.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    fontSize: 15,
    fontFamily: type.body,
    color: palette.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    width: '100%',
    backgroundColor: palette.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    fontFamily: type.body,
    color: palette.text,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: palette.border,
  },
  errorText: {
    color: palette.danger,
    fontFamily: type.emphasis,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  button: {
    marginTop: spacing.sm,
    backgroundColor: palette.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: type.title,
  },
  linkBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  linkText: {
    color: palette.textMuted,
    fontSize: 14,
    fontFamily: type.body,
  },
});

export default LoginScreen;
