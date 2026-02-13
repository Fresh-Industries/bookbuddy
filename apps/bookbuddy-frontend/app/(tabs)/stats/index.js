import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getStats, getHistory } from '../../apis/stats/stats';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

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
          setStats(statsData);
          const historyData = await getHistory(authToken, period);
          setHistory(historyData);
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      };
      fetchData();
    }, [authToken, period])
  );

  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      weekData.push({
        day: days[date.getDay()],
        pages: history[dateStr]?.pages || 0,
        isToday: i === 0
      });
    }
    return weekData;
  };

  const maxPages = Math.max(...getWeeklyData().map(d => d.pages), 1);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Reading Stats</Text>
      
      {/* Streak Card */}
      <View style={styles.streakCard}>
        <Text style={styles.streakNumber}>{stats?.currentStreak || 0}</Text>
        <Text style={styles.streakLabel}>Day Streak 🔥</Text>
        <Text style={styles.streakSubtext}>Longest: {stats?.longestStreak || 0} days</Text>
      </View>

      {/* Weekly Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.cardTitle}>This Week</Text>
        <View style={styles.chart}>
          {getWeeklyData().map((day, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { height: `${(day.pages / maxPages) * 100}%` },
                    day.isToday && styles.todayBar
                  ]} 
                />
              </View>
              <Text style={[styles.barLabel, day.isToday && styles.todayLabel]}>{day.day}</Text>
              <Text style={styles.barValue}>{day.pages}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats?.totalPagesRead || 0}</Text>
          <Text style={styles.statLabel}>Pages Read</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats?.totalBooksRead || 0}</Text>
          <Text style={styles.statLabel}>Books</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{Math.round((stats?.totalMinutesRead || 0) / 60)}h</Text>
          <Text style={styles.statLabel}>Time Read</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats?.longestStreak || 0}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        <TouchableOpacity 
          style={[styles.periodBtn, period === 'week' && styles.periodActive]}
          onPress={() => setPeriod('week')}
        >
          <Text style={[styles.periodText, period === 'week' && styles.periodTextActive]}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.periodBtn, period === 'month' && styles.periodActive]}
          onPress={() => setPeriod('month')}
        >
          <Text style={[styles.periodText, period === 'month' && styles.periodTextActive]}>Month</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.periodBtn, period === 'year' && styles.periodActive]}
          onPress={() => setPeriod('year')}
        >
          <Text style={[styles.periodText, period === 'year' && styles.periodTextActive]}>Year</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  streakCard: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#FFF',
  },
  streakLabel: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: '600',
  },
  streakSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  chartCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 80,
    width: 30,
    justifyContent: 'flex-end',
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    backgroundColor: '#DA0D57',
    borderRadius: 6,
    minHeight: 4,
  },
  todayBar: {
    backgroundColor: '#FF6B35',
  },
  barLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  todayLabel: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  barValue: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    width: (width - 48) / 2 - 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodActive: {
    backgroundColor: '#DA0D57',
  },
  periodText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#FFF',
  },
});

export default StatsScreen;
