import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Button } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import CoinListItem from '~/components/CoinListItem';
import { colors } from '~/constants/colors';
import { useCoinStore } from '~/store/store';

export default function InvestmentsScreen() {
  const { coins, loading, error, fetchCoins } = useCoinStore();
  const [search, setSearch] = useState('');
  const [searchedCoin, setSearchedCoin] = useState();

  const handleSearch = async (search: string) => {
    try {
      fetchCoins();
      const searchedCoin = coins.filter((coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase())
      );
      setSearchedCoin(searchedCoin);
    } catch (error) {
      console.log(error);
    }
  };

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
          {search && <CoinListItem coin={searchedCoin} />}
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
});
