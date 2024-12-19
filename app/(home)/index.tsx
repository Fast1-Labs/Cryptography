import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import CoinListItem from '~/components/CoinListItem';
import Top5 from '~/components/Top5';
import { colors } from '~/constants/colors';
import { useCoinStore } from '~/store/store';

export default function Home() {
  const { coins, loading, error, fetchCoins } = useCoinStore();

  useEffect(() => {
    fetchCoins();
  }, []);

  if (loading) return <ActivityIndicator style={{ alignSelf: 'center' }} />;
  if (error) return <Text>Failed while fetching coins</Text>;

  const sortedCoins = [...coins].sort(
    (a, b) => parseFloat(b.change_24h) - parseFloat(a.change_24h)
  );
  const topGainers = sortedCoins.slice(0, 5);
  const topLosers = sortedCoins.slice(-5).reverse();

  return (
    <LinearGradient style={styles.container} colors={['#3E1D92', '#1B1030', '#000000']}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <Text style={styles.header}>
            Cryto<Text style={{ color: colors.primary.main }}>graphy</Text>
          </Text>
          <View style={styles.topContainer}>
            <Text style={styles.topTitle}>Top Winners Today</Text>
            <FlatList
              data={topGainers}
              scrollEnabled={false}
              contentContainerStyle={{ gap: 20 }}
              renderItem={({ item }) => <Top5 coin={item} />}
            />
          </View>
          <View style={styles.topContainer}>
            <Text style={styles.topTitle}>Top Losers Today</Text>
            <FlatList
              data={topLosers}
              scrollEnabled={false}
              renderItem={({ item }) => <Top5 coin={item} />}
              contentContainerStyle={{ gap: 10 }}
            />
          </View>
          <View style={styles.coinContainer}>
            <Text style={styles.bodyTitle}>Coins</Text>
            <FlatList
              data={coins}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item }) => <CoinListItem coin={item} />}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      <StatusBar style="light" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topContainer: {
    padding: 20,
  },
  topTitle: {
    color: colors.primary.light,
    fontSize: 20,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  coinContainer: {
    flex: 1,
  },
  bodyTitle: {
    color: colors.primary.light,
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
  },
});
