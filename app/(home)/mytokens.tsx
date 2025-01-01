import { LinearGradient } from 'expo-linear-gradient';
import { Text, StyleSheet, SafeAreaView, View } from 'react-native';

import MyTokenListItem from '~/components/MyTokenListItem';
import { colors } from '~/constants/colors';

export default function MyTokens() {
  return (
    <LinearGradient style={styles.container} colors={['#3E1D92', '#1B1030', '#000000']}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.title}>My Tokens</Text>
        <View style={styles.bodyContainer}>{/* <MyTokenListItem />*/}</View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.primary.dark,
    padding: 20,
  },
  bodyContainer: {},
});
