import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import MyCoinsListItem from './MyCoinsListItem';

import { colors } from '~/constants/colors';
import { addCoin, removeCoin, updateCoin } from '~/slices/coinSlice';
import { useCoinStore } from '~/store/store'; // For accessing state

export default function MyTokenListItem() {
  const { coins, loading, error, fetchCoins } = useCoinStore();
  const [search, setSearch] = useState('');
  const [coinName, setCoinName] = useState('');
  const [coinAmount, setCoinAmount] = useState('');
  const userCoins = useSelector((state: any) => state.coins.coins);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCoins();
  }, []);

  const filteredCoins = search
    ? coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase())
      )
    : coins;

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error while fetching coins...</Text>;
  }

  const handleAddCoin = () => {
    if (!coinName || !coinAmount) return;
    const amount = parseFloat(coinAmount);
    if (isNaN(amount) || amount <= 0) return alert('Invalid amount!');

    dispatch(addCoin({ name: coinName, amount }));
    setCoinName('');
    setCoinAmount('');
  };

  const calculateTotalBalance = () => {
    return userCoins.reduce((total, userCoin) => {
      const currentCoin = coins.find((coin) => coin.name === userCoin.name);
      return total + (currentCoin?.price || 0) * userCoin.amount;
    }, 0);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Total Balance: ${calculateTotalBalance().toFixed(2)}</Text>
      </View>
      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Coin Name"
          placeholderTextColor={colors.primary.light}
          value={coinName}
          onChangeText={setCoinName}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          placeholderTextColor={colors.primary.light}
          value={coinAmount}
          onChangeText={setCoinAmount}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCoin}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search coins..."
          placeholderTextColor={colors.primary.light}
          value={search}
          onChangeText={setSearch}
        />
        <FontAwesome name="search" size={20} color={colors.primary.light} />
      </View>
      <FlatList
        data={userCoins}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => <MyCoinsListItem coin={item} removeCoin={handleRemoveCoin} />}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  balanceContainer: {
    padding: 10,
    backgroundColor: colors.primary.dark,
    borderRadius: 10,
    margin: 10,
  },
  balanceText: {
    color: colors.primary.light,
    fontSize: 18,
    fontWeight: 'bold',
  },
  addContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 10,
    color: colors.primary.light,
    marginHorizontal: 5,
    borderRadius: 5,
    borderColor: colors.primary.light,
    borderWidth: 0.5,
  },
  addButton: {
    backgroundColor: colors.secondary.accent,
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: colors.secondary.accent,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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
});
