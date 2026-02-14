import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { searchBooks } from '../../../apis/books/books';
import { palette, radius, shadow, spacing, type } from '../../../theme/tokens';

const QUICK_TOPICS = ['Fantasy', 'Self Help', 'Psychology', 'Sci-Fi', 'Romance'];

const getAuthorsLabel = (authors) => {
  if (!Array.isArray(authors) || !authors.length) return 'Unknown author';
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
  return `${authors[0]} +${authors.length - 1} more`;
};

const normalizeBook = (raw) => {
  const info = raw?.volumeInfo || {};
  return {
    id: raw?.id,
    title: info.title || 'Untitled',
    authors: getAuthorsLabel(info.authors),
    category: Array.isArray(info.categories) && info.categories.length ? info.categories[0] : 'General',
    publishedYear: info.publishedDate ? `${info.publishedDate}`.slice(0, 4) : null,
    pageCount: info.pageCount || null,
    thumbnail: info.imageLinks?.thumbnail || null,
    rating: typeof info.averageRating === 'number' ? info.averageRating : null,
  };
};

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [rawResults, setRawResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef(null);

  const runSearch = async (input) => {
    const term = `${input ?? ''}`.trim();
    if (!term) {
      setRawResults([]);
      setHasSearched(false);
      setErrorMessage('');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const data = await searchBooks(term);
      setRawResults(Array.isArray(data?.items) ? data.items : []);
      setHasSearched(true);
    } catch (error) {
      console.error('Error with search:', error);
      setErrorMessage(error?.message || 'Search failed. Please try again.');
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      if (!trimmed.length) {
        setRawResults([]);
        setHasSearched(false);
      }
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSearch(trimmed);
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const books = useMemo(() => {
    const mapped = rawResults.map(normalizeBook).filter((book) => !!book.id);
    const uniqueById = new Map(mapped.map((book) => [book.id, book]));
    return Array.from(uniqueById.values()).slice(0, 30);
  }, [rawResults]);

  const onPressBook = (id) => {
    router.push({
      pathname: 'books/[id]',
      params: { id },
    });
  };

  const renderBook = ({ item }) => (
    <Pressable onPress={() => onPressBook(item.id)} style={styles.bookItem}>
      {item.thumbnail ? (
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
          <Text style={styles.placeholderText}>No Cover</Text>
        </View>
      )}
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {item.authors}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaPill}>{item.category}</Text>
          {item.publishedYear && <Text style={styles.metaPill}>{item.publishedYear}</Text>}
          {item.pageCount && <Text style={styles.metaPill}>{item.pageCount} pp</Text>}
          {item.rating && <Text style={styles.metaPill}>★ {item.rating.toFixed(1)}</Text>}
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.hero}>
        <Text style={styles.title}>Search Books</Text>
        <Text style={styles.subtitle}>Type at least 3 letters for instant results, or tap a quick topic.</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Title, author, genre..."
            value={query}
            onChangeText={setQuery}
            placeholderTextColor={palette.textMuted}
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={() => runSearch(query)}
          />
          <TouchableOpacity onPress={() => runSearch(query)} style={styles.searchButton} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.searchButtonText}>Go</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.quickRow}>
          {QUICK_TOPICS.map((topic) => (
            <TouchableOpacity
              key={topic}
              style={styles.quickChip}
              onPress={() => {
                setQuery(topic);
                runSearch(topic);
              }}
            >
              <Text style={styles.quickChipText}>{topic}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>

      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {hasSearched ? 'No books found' : 'Start with a search'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {hasSearched ? 'Try another keyword or broader topic.' : 'Results will appear here.'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  hero: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    color: palette.text,
    fontSize: 30,
    fontFamily: type.display,
  },
  subtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    color: palette.textMuted,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: type.body,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    backgroundColor: palette.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderColor: palette.border,
    borderWidth: 1,
    color: palette.text,
    fontFamily: type.body,
  },
  searchButton: {
    backgroundColor: palette.primary,
    borderRadius: radius.pill,
    justifyContent: 'center',
    minWidth: 74,
    alignItems: 'center',
    ...shadow,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: type.emphasis,
  },
  quickRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  quickChip: {
    backgroundColor: palette.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: palette.border,
  },
  quickChipText: {
    color: palette.textMuted,
    fontSize: 12,
    fontFamily: type.emphasis,
  },
  errorText: {
    marginTop: spacing.xs,
    color: palette.danger,
    fontSize: 13,
    fontFamily: type.body,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  bookItem: {
    flexDirection: 'row',
    backgroundColor: palette.surface,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow,
  },
  thumbnail: {
    width: 84,
    height: 124,
    marginRight: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: palette.surfaceMuted,
  },
  thumbnailPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: palette.textMuted,
    fontSize: 11,
    fontFamily: type.body,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    color: palette.text,
    fontSize: 18,
    fontFamily: type.title,
    lineHeight: 24,
  },
  author: {
    marginTop: spacing.xs,
    color: palette.textMuted,
    fontSize: 14,
    fontFamily: type.body,
  },
  metaRow: {
    marginTop: spacing.xs,
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
  emptyState: {
    marginTop: spacing.xl,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    color: palette.text,
    fontSize: 20,
    fontFamily: type.title,
  },
  emptySubtitle: {
    marginTop: spacing.xs,
    color: palette.textMuted,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: type.body,
  },
});

export default SearchScreen;

