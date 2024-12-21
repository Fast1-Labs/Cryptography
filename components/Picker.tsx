import { Text, StyleSheet, Pressable, View } from 'react-native';

import { colors } from '~/constants/colors';

export default function Picker({ coinName, onPress }: { coinName: any; onPress: () => void }) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.coinContainer} onPress={onPress}>
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
