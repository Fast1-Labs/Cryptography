import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';

import CoinListItem from '~/components/CoinListItem';
import { colors } from '~/constants/colors';
import { useCoinStore } from '~/store/store';

export default function Home() {
  const { coins, loading, error, fetchCoins } = useCoinStore();

  useEffect(() => {
    fetchCoins();
  }, []);

  if (loading) return <ActivityIndicator style={{ alignSelf: 'center' }} />;
  if (error) return <Text>Failed while fetching coins</Text>;

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.header}>
          Cryto<Text style={{ color: colors.primary.main }}>graphy</Text>
        </Text>
        <View style={styles.coinContainer}>
          <Text style={styles.bodyTitle}>Crypto Coins</Text>
          <FlatList data={coins} renderItem={({ item }) => <CoinListItem coin={item} />} />
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
