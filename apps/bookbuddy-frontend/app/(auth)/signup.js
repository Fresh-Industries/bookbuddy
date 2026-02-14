import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signup } from '../../apis/auth/auth';
import { router } from 'expo-router';
import { saveToken } from '../../utils/secureStore';
import { motion, palette, radius, shadow, spacing, type } from '../../theme/tokens';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: motion.medium,
      useNativeDriver: true,
    }).start();
  }, [cardAnim]);

  const handleSignup = async () => {
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Enter an email and password.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const data = { email, password };
      const response = await signup(data);
      if (response && response.token) {
        await saveToken(response.token);
        router.replace('/home');
      }
    } catch (error) {
      console.error('Error with signup:', error);
      setErrorMessage(error?.message || 'Could not create account right now.');
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
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>Build your personal reading dashboard in seconds.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor={palette.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={palette.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor={palette.textMuted}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkBtn} onPress={() => router.push('/login')} disabled={loading}>
          <Text style={styles.linkText}>Already have an account? Sign in</Text>
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
    top: -120,
    right: -70,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: '#D8E7FF',
  },
  bottomAura: {
    position: 'absolute',
    bottom: -120,
    left: -90,
    width: 290,
    height: 290,
    borderRadius: 145,
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
    width: 98,
    height: 98,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 30,
    color: palette.text,
    fontFamily: type.display,
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
    color: palette.text,
    fontFamily: type.body,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: palette.border,
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
  errorText: {
    color: palette.danger,
    fontFamily: type.emphasis,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
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

export default SignupScreen;
