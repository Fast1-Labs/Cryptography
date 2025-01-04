import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Button } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import { colors } from '~/constants/colors';
import { Coin, useCoinStore } from '~/store/store';

export default function InvestmentsScreen() {
  const { coins, loading, error, fetchCoins } = useCoinStore();
  const [search, setSearch] = useState('');
  const [coin, setCoin] = useState<Coin | null>(null);

  useEffect(() => {
    fetchCoins();
  }, []);

  const handleSearch = (search: string) => {
    const searchedCoin = coins.find(
      (coin) =>
        coin.name.toLowerCase() === search.toLowerCase() ||
        coin.symbol.toLowerCase() === search.toLowerCase()
    );
    setCoin(searchedCoin || null);
  };

  const addToWallet = () => {};

  if (loading) return <ActivityIndicator />;
  if (error) return <Text style={{ color: 'red', fontSize: 20, fontWeight: 'bold' }}>{error}</Text>;

  return (
    <View style={styles.container}>
      <LinearGradient style={styles.container} colors={['#3E1D92', '#1B1030', '#000000']}>
        <SafeAreaView>
          {/* Header Title */}
          <Text style={styles.headerTitle}>My Invesments</Text>
          {/* Coin add search */}
          <View style={styles.coinSearchContainer}>
            <TextInput
              placeholder="Search for coins..."
              value={search}
              onChangeText={setSearch}
              style={styles.input}
            />
            <Button title="Search" onPress={() => handleSearch(search)} />
          </View>
          {/* Searched coin result */}
          {coin && (
            <View style={styles.coinContainer}>
              <Text style={styles.coinText}>{coin.symbol}</Text>
              <Text style={styles.coinText}>{coin.name}</Text>
              <Text style={styles.coinText}>$ {coin.price_usd.toFixed(4)}</Text>
              <Text
                style={{
                  color: coin.change_24h > 0 ? colors.secondary.main : colors.secondary.accent,
                }}>
                % {coin.change_24h.toFixed(4)}
              </Text>
              <Button title="Add" onPress={addToWallet} />
            </View>
          )}
          {/* Total Balance of User */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>Total Balance $: </Text>
          </View>
          {/* List of Wallet Items */}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.primary.dark,
    padding: 20,
  },
  coinSearchContainer: {
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: colors.primary.light,
    padding: 5,
    margin: 10,
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    color: colors.primary.light,
  },
  coinContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    borderWidth: 0.5,
    borderColor: colors.primary.dark,
    borderRadius: 10,
  },
  coinText: {
    color: colors.primary.light,
    fontSize: 16,
    fontWeight: 'semibold',
  },
  balanceContainer: {
    padding: 20,
    alignItems: 'center',
  },
  balanceText: {
    color: colors.primary.light,
    fontSize: 20,
  },
});
