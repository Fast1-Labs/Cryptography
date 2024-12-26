import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, ScrollView } from 'react-native';

import MyCoinsListItem from './MyCoinsListItem';

import { colors } from '~/constants/colors';
import { useCoinStore } from '~/store/store';

export default function MyTokenListItem() {
  const { coins, loading, error, fetchCoins } = useCoinStore();

  useEffect(() => {
    fetchCoins();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error while fetching coins...</Text>;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <Text>Token List Item</Text>
      </View>
      <View>
        <FlatList
          data={coins}
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
});
