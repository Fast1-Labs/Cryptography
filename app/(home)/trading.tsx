import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

import { colors } from '~/constants/colors';

export default function Details() {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>Trading</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  title: {
    fontSize: 30,
    color: colors.primary.dark,
    padding: 20,
    fontWeight: 'bold',
  },
});
