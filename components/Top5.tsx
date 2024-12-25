import { View, Text, StyleSheet } from 'react-native';

import { colors } from '~/constants/colors';
import { Coin } from '~/store/store';

export default function Top5({ coin }: { coin: Coin }) {
  return (
    <View style={styles.container}>
      <View style={styles.coinContainer}>
        <Text style={styles.coinSymbol}>{coin.symbol}</Text>
        <Text style={styles.coinName}>{coin.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>$ {coin.price_usd.toFixed(4)}</Text>
          <Text
            style={[
              coin.change_24h > 0
                ? { color: colors.secondary.main }
                : { color: colors.secondary.accent },
            ]}>
            % {coin.change_24h.toFixed(4)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coinContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  priceContainer: {},
  price: {
    color: colors.primary.light,
  },
  coinSymbol: {
    color: colors.primary.light,
    fontSize: 14,
    width: 70,
  },
  coinName: {
    color: colors.primary.light,
    fontSize: 18,
    fontWeight: 'semibold',
    flex: 1,
  },
});
