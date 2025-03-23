import { LinearGradient } from 'expo-linear-gradient';
import { Platform, SafeAreaView, StatusBar, View, StyleSheet, Text } from 'react-native';

import { colors } from '~/constants/colors';

export default function News() {
  return (
    <LinearGradient style={styles.container} colors={['#3E1D92', '#1B1030', '#000000']}>
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        }}
      />
      <Text style={styles.headerTitle}>Crypto News</Text>
      <View />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.primary.dark,
    padding: 20,
  },
});
