import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';

import { colors } from '~/constants/colors';

export default function Home() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.header}>Crytography</Text>
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
    color: colors.primary.main,
  },
});
