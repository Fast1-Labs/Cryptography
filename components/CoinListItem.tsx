import { View, Text, StyleSheet, Dimensions } from 'react-native';

import { colors } from '~/constants/colors';
import { Coin } from '~/store/store';

export default function CoinListItem({ coin }: { coin: Coin }) {
  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <View style={styles.symbolContainer}>
          <Text style={styles.coinSymbol}>{coin.symbol}</Text>
        </View>
        <View style={styles.coinNameContainer}>
          <Text style={styles.coinName}>{coin.name}</Text>
          <Text
            style={[
              coin.change_24h > 0
                ? { color: colors.secondary.main }
                : { color: colors.secondary.accent },
            ]}>
            {coin.change_24h.toFixed(5)}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.coinPrice}>$ {coin.price_usd.toFixed(4)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  bodyContainer: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'gray',
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolContainer: {
    width: Dimensions.get('window').width / 3,
  },
  coinNameContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 5,
    flex: 1,
  },
  coinName: {
    color: colors.primary.light,
    fontWeight: 'bold',
    fontSize: 18,
  },
  coinSymbol: {
    color: colors.primary.dark,
    fontWeight: 'bold',
  },
  priceContainer: {},
  coinPrice: {
    color: colors.primary.light,
  },
});
