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
} from 'react-native';

import MyCoinsListItem from './MyCoinsListItem';

import { colors } from '~/constants/colors';
import { useCoinStore } from '~/store/store';

export default function MyTokenListItem() {
  const { coins, loading, error, fetchCoins } = useCoinStore();
  const [search, setSearch] = useState('');

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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
      <View>
        <FlatList
          data={search ? filteredCoins : coins}
          renderItem={({ item }) => <MyCoinsListItem coin={item} />}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
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
