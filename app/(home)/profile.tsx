import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { colors } from '~/constants/colors';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.title}>Profile</Text>
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
    fontWeight: 'bold',
    color: colors.primary.dark,
    padding: 20,
  },
});
