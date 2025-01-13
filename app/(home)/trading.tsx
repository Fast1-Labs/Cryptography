import { AntDesign } from '@expo/vector-icons';
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
  Pressable,
  TouchableOpacity,
  Modal,
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
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchCoins();
  }, []);

  useEffect(() => {
    if (selectedCoin) {
      fetchHistoricalData(selectedCoin, days);
    }
  }, [selectedCoin, days]);

  useEffect(() => {
    setSelectedPoint(null);
  }, [selectedCoin]);

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

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDaySelection = (selectedDays: number) => {
    setDays(selectedDays);
    toggleModal();
  };
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
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
          <Text style={styles.coinTitle}>
            {selectedCoin.toUpperCase()} - Last {days} Days
          </Text>
          <Pressable style={{ alignItems: 'center' }} onPress={toggleModal}>
            <AntDesign name="caretdown" color={colors.primary.light} size={20} />
          </Pressable>
        </View>
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
        <View style={styles.informationTable}>
          {/* Coin Information */}
          <Text style={styles.sectionTitle}>Coin Details</Text>
          <Text style={styles.informationText}>
            High: ${Math.max(...graphData.map((point) => point.value)).toFixed(2) || '--'}
          </Text>
          <Text style={styles.informationText}>
            Low: ${Math.min(...graphData.map((point) => point.value)).toFixed(2) || '--'}
          </Text>
          <Text style={styles.informationText}>
            Average: $
            {(graphData.reduce((sum, point) => sum + point.value, 0) / graphData.length).toFixed(
              2
            ) || '--'}
          </Text>
          <Text style={styles.informationText}>
            Performance Change:{' '}
            {(
              ((graphData[graphData.length - 1]?.value - graphData[0]?.value) /
                graphData[0]?.value) *
                100 || 0
            ).toFixed(2)}
            %
          </Text>
        </View>
        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
          onRequestClose={toggleModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {[1, 7, 30, 90, 360].map((day) => (
                <TouchableOpacity
                  key={day}
                  style={styles.modalOption}
                  onPress={() => handleDaySelection(day)}>
                  <Text style={styles.modalOptionText}>{day} Days</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
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
  informationTable: {
    padding: 10,
    backgroundColor: colors.primary.dark,
    margin: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.primary.light,
    fontWeight: 'bold',
    marginTop: 5,
  },
  informationText: {
    fontSize: 16,
    color: colors.primary.light,
    marginVertical: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.primary.dark,
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalOption: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: colors.primary.main,
    borderRadius: 5,
  },
  modalOptionText: {
    color: colors.primary.light,
    textAlign: 'center',
    fontSize: 18,
  },
});
