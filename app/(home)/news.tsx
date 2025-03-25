import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';

import { colors } from '~/constants/colors';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCryptoNews = async () => {
    try {
    } catch (error) {
      console.log('Error fetching news ', error);
    } finally {
      setLoading(false);
    }
  };

  if (news.length === 0) {
    return (
      <LinearGradient style={styles.container} colors={['#3E1D92', '#1B1030', '#000000']}>
        <SafeAreaView>
          <Text style={styles.headerTitle}>Crypto News</Text>
          <Text style={{ textAlign: 'center', color: 'red' }}>No news have been found!</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (loading) return <ActivityIndicator size="large" className="self-center" />;

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
    padding: 5,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.primary.dark,
    padding: 20,
  },
});
