import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, SafeAreaView, Pressable, Image, Dimensions } from 'react-native';

//@ts-ignore
import image from '../assets/bitcoin.png';

import { colors } from '~/constants/colors';

export default function Page() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.title}>
          Crypto<Text style={{ color: colors.primary.main }}>Graphy</Text>
        </Text>
        <Image
          source={image}
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height / 2,
            padding: 10,
            marginTop: 70,
          }}
        />
        <View style={styles.body}>
          <Text style={styles.bodyHeader}>
            Jump start your crypto career with Crypto
            <Text style={{ color: colors.primary.main }}>Graphy</Text>
          </Text>
          <Text style={styles.subText}>Take your investment portfolio to next level</Text>
        </View>
        <Link asChild href="/(auth)/sign-in">
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Get Started!</Text>
          </Pressable>
        </Link>
      </SafeAreaView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  title: {
    color: colors.primary.light,
    fontWeight: 'bold',
    fontSize: 35,
  },
  button: {
    backgroundColor: colors.primary.main,
    padding: 5,
    margin: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 27,
    fontWeight: 'bold',
    color: colors.primary.light,
    textAlign: 'center',
    margin: 5,
  },
  body: {
    gap: 10,
    flex: 1,
  },
  bodyHeader: {
    color: colors.primary.light,
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 40,
  },
  subText: {
    fontSize: 17,
    color: colors.primary.light,
    fontWeight: 'semibold',
  },
});
