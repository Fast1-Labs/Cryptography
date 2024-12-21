import { Text, StyleSheet, Pressable, View } from 'react-native';

import { colors } from '~/constants/colors';

export default function Picker({ coinName }: { coinName: any }) {
  const onNamePress = ({ coinName }: { coinName: any }) => {};
  return (
    <View style={styles.container}>
      <Pressable style={styles.coinContainer} onPress={() => onNamePress(coinName)}>
        <Text style={styles.coinName}>{coinName.toUpperCase()}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coinContainer: {
    backgroundColor: colors.primary.light,
    borderRadius: 10,
  },
  coinName: {
    color: colors.primary.main,
    fontWeight: 'bold',
    padding: 5,
  },
});
