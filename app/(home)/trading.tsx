import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Text, StyleSheet, SafeAreaView, ActivityIndicator, Dimensions } from 'react-native';
import { LineGraph, GraphPoint } from 'react-native-graph';

import { colors } from '~/constants/colors';
import { useCoinStore } from '~/store/store';

export default function Details() {
  const { historicalData, loading, error, fetchHistoricalData } = useCoinStore();
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchHistoricalData(selectedCoin, days);
  }, [selectedCoin, days]);

  const data = historicalData[selectedCoin] || [];
  const graphData = data.map((point) => ({
    x: new Date(point.timestamp).getTime(),
    y: point.value,
    value: point.value,
    date: new Date(point.timestamp),
  }));

  console.log(graphData);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color={colors.primary.main}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    );

  if (error)
    return (
      <SafeAreaView>
        <Text
          style={{
            color: 'red',
            alignSelf: 'center',
          }}>
          Failed to fetch historical coin data
        </Text>
      </SafeAreaView>
    );

  return (
    <LinearGradient style={styles.container} colors={['#3E1D92', '#1B1030', '#000000']}>
      <SafeAreaView>
        <Text style={styles.title}>Trading</Text>
        <Text style={styles.coinTitle}>
          {selectedCoin.toUpperCase()} - Last {days} Days
        </Text>
        {graphData.length > 0 ? (
          <LineGraph style={styles.graph} points={graphData} animated color={colors.primary.main} />
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    color: colors.primary.dark,
    padding: 20,
    fontWeight: 'bold',
  },
  coinTitle: {
    color: colors.primary.light,
    fontSize: 20,
    textAlign: 'center',
  },
  graph: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 3,
    padding: 20,
  },
  noDataText: {
    color: 'red',
    textAlign: 'center',
  },
});
