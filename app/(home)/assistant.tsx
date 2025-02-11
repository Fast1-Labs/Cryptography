import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, KeyboardAvoidingView, Platform, StyleSheet, SafeAreaView } from 'react-native';

import { colors } from '~/constants/colors';

export default function Assistant() {
  return (
    <LinearGradient style={styles.container} colors={['#3E1D92', '#1B1030', '#000000']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <SafeAreaView>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>AI Finance Assistant</Text>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerContainer: {
    padding: 20,
  },
  header: {
    color: colors.primary.dark,
    fontWeight: 'bold',
    fontSize: 25,
  },
});
