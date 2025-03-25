import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import { colors } from '~/constants/colors';
import { supabase } from '~/utils/supabase';

type NewsArticle = {
  id?: number;
  title: string;
  description?: string | null;
  url: string;
  image_url?: string | null;
  source: string;
  published_at: string;
};

export default function News() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAndStoreCryptoNews();
  }, []);

  const fetchAndStoreCryptoNews = async () => {
    try {
      setLoading(true);

      const today = new Date().toISOString().split('T')[0];

      const { data: existingNews, error: checkError } = await supabase
        .from('crypto_news')
        .select('*')
        .gte('created_at', today);

      if (checkError) {
        console.error('Error checking news:', checkError);
        setLoading(false);
        return;
      }

      if (existingNews && existingNews.length > 0) {
        console.log('Using cached news from Supabase.');
        setNews(existingNews);
        setLoading(false);
        return;
      }

      console.log('Fetching fresh news from API Tube...');
      const response = await fetch('https://api.apitube.io/v1/news/everything', {
        headers: {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_APITUBE_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });
      const { articles }: { articles: NewsArticle[] } = await response.json();

      if (!articles || articles.length === 0) {
        console.warn('No news articles found.');
        setLoading(false);
        return;
      }

      const formattedNews: NewsArticle[] = articles.map((article) => ({
        title: article.title,
        description: article.description || null,
        url: article.url,
        image_url: article.image_url || null,
        source: article.source || 'Unknown',
        published_at: article.published_at,
        created_at: new Date().toISOString(),
      }));

      const { error: insertError } = await supabase.from('crypto_news').insert(formattedNews);

      if (insertError) {
        console.error('Error inserting news:', insertError);
      } else {
        console.log('Crypto news stored successfully!');
        setNews(formattedNews);
      }
    } catch (err) {
      console.error('Error fetching crypto news:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient style={styles.container} colors={['#3E1D92', '#1B1030', '#000000']}>
      <SafeAreaView
        style={{
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        }}>
        <Text style={styles.headerTitle}>Crypto News</Text>
      </SafeAreaView>

      {loading ? (
        <ActivityIndicator size="large" className="self-center" />
      ) : news.length === 0 ? (
        <Text style={styles.noNewsText}>No news found!</Text>
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.newsItem}>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsSource}>{item.source}</Text>
            </View>
          )}
        />
      )}
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
  noNewsText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
  },
  newsItem: {
    backgroundColor: '#222',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  newsTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  newsSource: {
    fontSize: 12,
    color: '#bbb',
  },
});
