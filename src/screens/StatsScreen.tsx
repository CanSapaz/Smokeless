import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { format, subDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { storage, DailyLog } from '../services/storage';

export const StatsScreen = () => {
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    loadDailyLogs();
  }, []);

  const loadDailyLogs = async () => {
    const logs = await storage.getDailyLogs();
    setDailyLogs(logs);
  };

  const getLast7DaysData = () => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const log = dailyLogs.find(l => l.date === date);
      return {
        date: format(subDays(new Date(), i), 'd MMM', { locale: tr }),
        cravings: log?.cravings || 0,
        mood: log?.mood || 0
      };
    }).reverse();

    return {
      labels: days.map(d => d.date),
      cravings: days.map(d => d.cravings),
      moods: days.map(d => d.mood)
    };
  };

  const data = getLast7DaysData();

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(44, 62, 80, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Günlük Sigara İsteği</Text>
        <LineChart
          data={{
            labels: data.labels,
            datasets: [{
              data: data.cravings
            }]
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          yAxisLabel=""
          yAxisSuffix=" kez"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ruh Hali Değişimi</Text>
        <BarChart
          data={{
            labels: data.labels,
            datasets: [{
              data: data.moods
            }]
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`
          }}
          style={styles.chart}
          yAxisLabel=""
          yAxisSuffix="/5"
          showValuesOnTopOfBars
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Ortalama Günlük İstek</Text>
          <Text style={styles.statValue}>
            {(data.cravings.reduce((a, b) => a + b, 0) / 7).toFixed(1)}
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Ortalama Ruh Hali</Text>
          <Text style={styles.statValue}>
            {(data.moods.reduce((a, b) => a + b, 0) / 7).toFixed(1)}/5
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#f5f6fa',
    borderRadius: 15,
    padding: 15,
    width: '47%',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statTitle: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
});
