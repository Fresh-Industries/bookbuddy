import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { addBookToLibrary, getBook } from '../../../../apis/books/books';
import { useAuth } from '../../../../context/AuthContext';
import { palette, radius, shadow, spacing, type } from '../../../../theme/tokens';

const stripHtml = (input) => `${input || ''}`.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const BookDetail = () => {
  const { id } = useLocalSearchParams();
  const { authToken } = useAuth();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadBook = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setStatusMessage('');
        setIsAdded(false);
        const response = await getBook(id);
        if (mounted) {
          setBook(response);
        }
      } catch (error) {
        console.error('Error loading book detail:', error);
        if (mounted) {
          setStatusMessage(error?.message || 'Could not load this book.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadBook();
    return () => {
      mounted = false;
    };
  }, [id]);

  const normalized = useMemo(() => {
    const info = book?.volumeInfo || {};
    return {
      title: info.title || 'Untitled',
      authors: Array.isArray(info.authors) && info.authors.length ? info.authors.join(', ') : 'Unknown author',
      category: Array.isArray(info.categories) && info.categories.length ? info.categories[0] : 'General',
      pageCount: info.pageCount || null,
      year: info.publishedDate ? `${info.publishedDate}`.slice(0, 4) : null,
      rating: typeof info.averageRating === 'number' ? info.averageRating.toFixed(1) : null,
      description: stripHtml(info.description),
      thumbnail: info.imageLinks?.thumbnail || null,
    };
  }, [book]);

  const addToLibrary = async () => {
    if (!book) return;
    if (!authToken) {
      setStatusMessage('Log in first to add books to your library.');
      return;
    }

    try {
      setIsAdding(true);
      setStatusMessage('');
      const info = book.volumeInfo || {};
      const details = {
        googleBooksId: book.id,
        imageUrl: info.imageLinks?.thumbnail || null,
        title: info.title || 'Untitled',
        authors: Array.isArray(info.authors) ? info.authors : [],
        categories: Array.isArray(info.categories) ? info.categories : [],
        pageCount: info.pageCount || null,
      };
      await addBookToLibrary(details, authToken);
      setIsAdded(true);
      setStatusMessage('Added to your library.');
    } catch (error) {
      console.error('Error adding book to library:', error);
      setStatusMessage(error?.message || 'Could not add this book.');
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={palette.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!book) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingWrap}>
          <Text style={styles.errorText}>{statusMessage || 'Book not found.'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const shortDescription =
    normalized.description.length > 380 && !showFullDescription
      ? `${normalized.description.slice(0, 380)}...`
      : normalized.description;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backChip} onPress={() => router.back()}>
          <Text style={styles.backChipText}>‹ Back to search</Text>
        </TouchableOpacity>

        <View style={styles.heroCard}>
          {normalized.thumbnail ? (
            <Image source={{ uri: normalized.thumbnail }} style={styles.cover} />
          ) : (
            <View style={[styles.cover, styles.coverPlaceholder]}>
              <Text style={styles.coverPlaceholderText}>No Cover</Text>
            </View>
          )}

          <View style={styles.heroText}>
            <Text style={styles.title}>{normalized.title}</Text>
            <Text style={styles.author}>{normalized.authors}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaPill}>{normalized.category}</Text>
              {normalized.year && <Text style={styles.metaPill}>{normalized.year}</Text>}
              {normalized.pageCount && <Text style={styles.metaPill}>{normalized.pageCount} pp</Text>}
              {normalized.rating && <Text style={styles.metaPill}>★ {normalized.rating}</Text>}
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={addToLibrary}
          style={[styles.addButton, isAdded && styles.addedButton]}
          disabled={isAdding || isAdded}
        >
          {isAdding ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.addButtonText}>{isAdded ? 'Added to Library' : 'Add to Library'}</Text>
          )}
        </TouchableOpacity>

        {!!statusMessage && <Text style={styles.statusText}>{statusMessage}</Text>}

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>About This Book</Text>
          <Text style={styles.descriptionText}>
            {shortDescription || 'No description available for this title.'}
          </Text>
          {normalized.description.length > 380 && (
            <TouchableOpacity onPress={() => setShowFullDescription((value) => !value)}>
              <Text style={styles.moreText}>{showFullDescription ? 'Show less' : 'Read more'}</Text>
            </TouchableOpacity>
          )}
        </View>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 120,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: palette.primary,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontFamily: type.emphasis,
  },
  errorText: {
    color: palette.danger,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: type.body,
  },
  backChip: {
    alignSelf: 'flex-start',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  backChipText: {
    color: palette.textMuted,
    fontSize: 13,
    fontFamily: type.emphasis,
  },
  heroCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    ...shadow,
  },
  cover: {
    width: 118,
    height: 176,
    borderRadius: radius.md,
    backgroundColor: palette.surfaceMuted,
  },
  coverPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPlaceholderText: {
    color: palette.textMuted,
    fontSize: 12,
    fontFamily: type.body,
  },
  heroText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    color: palette.text,
    fontFamily: type.display,
  },
  author: {
    marginTop: spacing.xs,
    color: palette.textMuted,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: type.body,
  },
  metaRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  metaPill: {
    color: palette.primary,
    backgroundColor: palette.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    fontSize: 11,
    fontFamily: type.emphasis,
  },
  addButton: {
    marginTop: spacing.md,
    backgroundColor: palette.primary,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    ...shadow,
  },
  addedButton: {
    backgroundColor: palette.success,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: type.title,
  },
  statusText: {
    marginTop: spacing.xs,
    color: palette.textMuted,
    fontSize: 13,
    fontFamily: type.body,
  },
  descriptionCard: {
    marginTop: spacing.md,
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
    ...shadow,
  },
  descriptionTitle: {
    color: palette.text,
    fontSize: 20,
    fontFamily: type.title,
    marginBottom: spacing.xs,
  },
  descriptionText: {
    color: palette.text,
    fontSize: 15,
    lineHeight: 23,
    fontFamily: type.body,
  },
  moreText: {
    marginTop: spacing.sm,
    color: palette.primary,
    fontSize: 14,
    fontFamily: type.emphasis,
  },
});

export default BookDetail;

