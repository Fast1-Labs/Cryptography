import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ActivityIndicator, FlatList } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

import CoinListItem from '~/components/CoinListItem';
import Top5 from '~/components/Top5';
import { colors } from '~/constants/colors';
import { useCoinStore } from '~/store/store';

export default function Home() {
  const { coins, loading, error, fetchCoins } = useCoinStore();
  const [search, setSearch] = useState('');

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

  // Filter coins based on search query
  const filteredCoins = search
    ? coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase())
      )
    : coins;

  return (
    <LinearGradient style={styles.container} colors={['#3E1D92', '#1B1030', '#000000']}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.header}>
            Cryto<Text style={{ color: colors.primary.main }}>graphy</Text>
          </Text>
          <View style={styles.topContainer}>
            <Text style={styles.topTitle}>Top Winners Today</Text>
            <FlatList
              scrollEnabled={false}
              data={topGainers}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item }) => <Top5 coin={item} />}
            />
          </View>
          <View style={styles.topContainer}>
            <Text style={styles.topTitle}>Top Losers Today</Text>
            <FlatList
              scrollEnabled={false}
              data={topLosers}
              renderItem={({ item }) => <Top5 coin={item} />}
              contentContainerStyle={{ gap: 10 }}
            />
          </View>
          <View style={styles.coinContainer}>
            <Text style={styles.bodyTitle}>Coins</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Enter the name of your coin..."
                placeholderTextColor={colors.primary.light}
                value={search}
                onChangeText={setSearch}
              />
              <FontAwesome name="search" size={20} color={colors.primary.light} />
            </View>
            <FlatList
              data={search ? filteredCoins : coins}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item }) => <CoinListItem coin={item} />}
            />
          </View>
          <StatusBar style="light" />
        </ScrollView>
      </SafeAreaView>
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
  searchContainer: {
    backgroundColor: '#121212',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: colors.primary.light,
    borderWidth: 0.5,
    margin: 10,
  },
  searchInput: {
    padding: 10,
    flex: 1,
    color: colors.primary.light,
  },
  topTitle: {
    color: colors.primary.light,
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  coinContainer: {
    flex: 1,
    gap: 5,
  },
  bodyTitle: {
    color: colors.primary.light,
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
  },
});
