import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUser } from '../../../apis/users/users';
import { getUserBooks } from '../../../apis/books/books';
import { useAuth } from '../../../context/AuthContext';
import { palette, radius, shadow, spacing, type } from '../../../theme/tokens';

const ProfileScreen = () => {
    const [user, setUser] = useState(null);
    const [bookCount, setBookCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const { authToken, logout } = useAuth();

    useEffect(() => {
      const fetchUser = async () => {
        if (!authToken) return;
        try {
          setLoading(true);
          const [userResponse, booksResponse] = await Promise.all([
            getUser(authToken),
            getUserBooks(authToken),
          ]);
          setUser(userResponse);
          setBookCount(Array.isArray(booksResponse) ? booksResponse.length : 0);
        } catch (error) {
          console.error('Error fetching user:', error);
        } finally {
          setLoading(false);
        }
      };
    
      fetchUser();
    }, [authToken]); 

    const displayName = user?.username || (user?.email ? user.email.split('@')[0] : 'Reader');
    const avatarLetter = displayName?.charAt(0)?.toUpperCase() || 'R';

    if (loading) {
      return (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={palette.primary} />
        </View>
      );
    }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
        <Text style={styles.title}>{displayName}</Text>
        <Text style={styles.subtitle}>{user?.email || 'No email available'}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Books in Library</Text>
          <Text style={styles.value}>{bookCount}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.label}>User ID</Text>
          <Text style={styles.value}>{user?.id ?? '-'}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          logout();
          router.replace('/');
        }}
      >
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.background,
  },
  container: {
    flex: 1,
    backgroundColor: palette.background,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#DCEBFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: palette.primary,
    fontSize: 42,
    fontFamily: type.display,
  },
  title: {
    marginTop: spacing.sm,
    fontSize: 28,
    color: palette.text,
    fontFamily: type.display,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: palette.textMuted,
    fontSize: 14,
    fontFamily: type.body,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.lg,
    ...shadow,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: palette.textMuted,
    fontSize: 14,
    fontFamily: type.body,
  },
  value: {
    color: palette.text,
    fontSize: 18,
    fontFamily: type.title,
  },
  divider: {
    height: 1,
    backgroundColor: palette.border,
    marginVertical: spacing.md,
  },
  logoutButton: {
    marginTop: spacing.lg,
    alignSelf: 'center',
    backgroundColor: '#E9EFFA',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  logoutText: {
    color: palette.textMuted,
    fontSize: 14,
    fontFamily: type.emphasis,
  },
});

export default ProfileScreen;
