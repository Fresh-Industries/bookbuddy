import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getStats, getHistory } from '../../../apis/stats/stats';
import { useAuth } from '../../../context/AuthContext';
import { palette, radius, shadow, spacing, type } from '../../../theme/tokens';

const PERIODS = ['week', 'month', 'year'];

const StatsScreen = () => {
  const { authToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState({});
  const [period, setPeriod] = useState('month');

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (!authToken) return;
        try {
          const statsData = await getStats(authToken);
          const historyData = await getHistory(authToken, period);
          setStats(statsData || null);
          setHistory(historyData || {});
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      };
      fetchData();
    }, [authToken, period])
  );

  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    return Array.from({ length: 7 }).map((_, idx) => {
      const offset = 6 - idx;
      const date = new Date(today);
      date.setDate(date.getDate() - offset);
      const dateStr = date.toISOString().split('T')[0];
      return {
        day: days[date.getDay()],
        pages: history?.[dateStr]?.pages || 0,
        isToday: offset === 0,
      };
    });
  }, [history]);

  const maxPages = Math.max(...weeklyData.map((d) => d.pages), 1);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Reading Analytics</Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Current Streak</Text>
          <View style={styles.heroRow}>
            <Text style={styles.heroValue}>{stats?.currentStreak || 0}</Text>
            <Text style={styles.heroUnit}>days</Text>
          </View>
          <Text style={styles.heroSub}>Longest: {stats?.longestStreak || 0} days</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.chart}>
            {weeklyData.map((day) => (
              <View key={day.day} style={styles.barContainer}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${Math.max((day.pages / maxPages) * 100, day.pages > 0 ? 8 : 0)}%` },
                      day.isToday && styles.barFillToday,
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, day.isToday && styles.barLabelToday]}>{day.day}</Text>
                <Text style={styles.barValue}>{day.pages}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{stats?.totalPagesRead || 0}</Text>
            <Text style={styles.metricLabel}>Pages Read</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{stats?.totalBooksRead || 0}</Text>
            <Text style={styles.metricLabel}>Books Finished</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{Math.round((stats?.totalMinutesRead || 0) / 60)}h</Text>
            <Text style={styles.metricLabel}>Reading Time</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{stats?.longestStreak || 0}</Text>
            <Text style={styles.metricLabel}>Best Streak</Text>
          </View>
        </View>

        <View style={styles.segment}>
          {PERIODS.map((value) => (
            <TouchableOpacity
              key={value}
              style={[styles.segmentItem, period === value && styles.segmentItemActive]}
              onPress={() => setPeriod(value)}
            >
              <Text style={[styles.segmentText, period === value && styles.segmentTextActive]}>
                {value[0].toUpperCase() + value.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
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
    paddingTop: spacing.xl,
    paddingBottom: 120,
  },
  title: {
    fontSize: 30,
    color: palette.text,
    fontFamily: type.display,
    marginBottom: spacing.md,
  },
  heroCard: {
    backgroundColor: '#0F1A2E',
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow,
  },
  heroLabel: {
    color: '#AFC2DF',
    fontSize: 13,
    fontFamily: type.emphasis,
  },
  heroRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  heroValue: {
    color: '#FFFFFF',
    fontSize: 56,
    lineHeight: 60,
    fontFamily: type.display,
  },
  heroUnit: {
    color: '#E2EAF7',
    fontSize: 18,
    paddingBottom: spacing.xs,
    fontFamily: type.title,
  },
  heroSub: {
    marginTop: spacing.xs,
    color: '#BFD0EA',
    fontSize: 14,
    fontFamily: type.body,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow,
  },
  cardTitle: {
    color: palette.text,
    fontSize: 18,
    fontFamily: type.title,
    marginBottom: spacing.sm,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 124,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: 28,
    height: 84,
    borderRadius: radius.sm,
    backgroundColor: '#E9EFF7',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#7AB4FF',
    borderRadius: radius.sm,
  },
  barFillToday: {
    backgroundColor: palette.primary,
  },
  barLabel: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: palette.textMuted,
    fontFamily: type.body,
  },
  barLabelToday: {
    color: palette.primary,
    fontFamily: type.emphasis,
  },
  barValue: {
    marginTop: 2,
    fontSize: 11,
    color: palette.textMuted,
    fontFamily: type.mono,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  metric: {
    width: '48%',
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
    ...shadow,
  },
  metricValue: {
    color: palette.text,
    fontSize: 28,
    fontFamily: type.display,
  },
  metricLabel: {
    color: palette.textMuted,
    fontSize: 13,
    marginTop: spacing.xs,
    fontFamily: type.body,
  },
  segment: {
    backgroundColor: palette.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 4,
    flexDirection: 'row',
    ...shadow,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  segmentItemActive: {
    backgroundColor: palette.primary,
  },
  segmentText: {
    color: palette.textMuted,
    fontSize: 14,
    fontFamily: type.emphasis,
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
});

export default StatsScreen;
