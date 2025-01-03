import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

import { colors } from '~/constants/colors';

export default function InvestmentsScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient style={styles.container} colors={['#3E1D92', '#1B1030', '#000000']}>
        {/* Header Title */}
        <SafeAreaView>
          <Text style={styles.headerTitle}>My Invesments</Text>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.primary.dark,
    padding: 20,
  },
});
