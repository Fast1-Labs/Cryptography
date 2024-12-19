import { View, Text, StyleSheet } from 'react-native';

import { Coin } from '~/store/store';

export default function CoinListItem({ coin }: { coin: Coin }) {
  return (
    <View style={styles.container}>
      <Text style={styles.coinSymbol}>{coin.symbol}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinSymbol: {},
});
