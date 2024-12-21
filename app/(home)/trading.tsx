import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  View,
  FlatList,
} from 'react-native';
import { LineGraph, GraphPoint } from 'react-native-graph';

import Picker from '~/components/Picker';
import { colors } from '~/constants/colors';
import { useCoinStore } from '~/store/store';

export default function Details() {
  const { historicalData, loading, error, fetchHistoricalData } = useCoinStore();
  const { coins, fetchCoins } = useCoinStore();
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [days, setDays] = useState(30);
  const [selectedPoint, setSelectedPoint] = useState<GraphPoint | null>(null);

  useEffect(() => {
    fetchCoins();
  }, []);

  useEffect(() => {
    if (selectedCoin) {
      fetchHistoricalData(selectedCoin, days);
    }
  }, [selectedCoin, days]);

  const data = historicalData[selectedCoin] || [];
  const graphData = data
    .map((point) => ({
      x: new Date(point.timestamp).getTime(),
      y: point.value,
      value: point.value,
      date: new Date(point.timestamp),
    }))
    .filter((point) => !isNaN(point.x) && !isNaN(point.y));

  const onPointSelected = (point: GraphPoint) => {
    setSelectedPoint(point);
  };

  useEffect(() => {
    setSelectedPoint(null);
  }, [selectedCoin]);

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
        <FlatList
          data={coins}
          renderItem={({ item }) => (
            <Picker coinName={item.name} onPress={() => setSelectedCoin(item.id)} />
          )}
          horizontal
          contentContainerStyle={{ padding: 20, gap: 10 }}
        />
        <Text style={styles.coinTitle}>
          {selectedCoin.toUpperCase()} - Last {days} Days
        </Text>
        {graphData.length > 0 ? (
          <LineGraph
            style={styles.graph}
            points={graphData}
            animated
            color={colors.primary.main}
            gradientFillColors={[colors.primary.dark, '#7476df00']}
            enablePanGesture
            indicatorPulsating
            enableFadeInMask
            enableIndicator
            onPointSelected={onPointSelected}
          />
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}
        <View style={styles.coinInfoContainer}>
          <Text style={styles.bodyText}>
            {selectedPoint?.date?.toDateString() || 'Select a point'}
          </Text>
          <Text style={styles.bodyText}>$ {selectedPoint?.value?.toFixed(4) || '--'}</Text>
        </View>
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
    paddingBottom: 10,
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
  bodyText: {
    color: colors.primary.light,
    textAlign: 'center',
    fontSize: 20,
  },
  coinInfoContainer: {
    gap: 5,
  },
});
