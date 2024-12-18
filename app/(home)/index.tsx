import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';

import { colors } from '~/constants/colors';

export default function Home() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.header}>
          Cryto<Text style={{ color: colors.primary.main }}>graphy</Text>
        </Text>
      </SafeAreaView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
});
