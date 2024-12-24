import { useSignIn } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Pressable,
} from 'react-native';

import { colors } from '~/constants/colors';

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = useState('');

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <LinearGradient
      style={styles.container}
      colors={['#000000', colors.primary.main, colors.primary.dark]}>
      <SafeAreaView style={styles.bodyContainer}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.inputText}>Email</Text>
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
        <Text style={styles.inputText}>Password</Text>
        <TextInput
          style={styles.textInput}
          value={password}
          placeholder="Enter password"
          secureTextEntry
          onChangeText={(password) => setPassword(password)}
        />
        {error && <Text style={styles.errorMessage}>{error}</Text>}
        <Button title="Sign in" onPress={onSignInPress} color="cyan" />
        <View style={styles.signupContainer}>
          <Text style={styles.bottomText}>Don't have an account?</Text>
          <Link href="/sign-up" asChild>
            <Pressable style={styles.signupButton}>
              <Text style={styles.signupText}>Sign Up</Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
      <StatusBar style="light" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    color: colors.primary.light,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 30,
  },
  bodyContainer: {
    gap: 5,
    width: Dimensions.get('window').width,
  },
  textInput: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  inputText: {
    color: colors.primary.light,
    fontWeight: 'bold',
    paddingLeft: 20,
  },
  bottomText: {
    color: colors.primary.light,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  signupContainer: {
    gap: 20,
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: colors.primary.light,
    padding: 10,
    borderRadius: 10,
    zIndex: 10,
    width: Dimensions.get('window').width / 2,
  },
  signupText: {
    color: colors.primary.main,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  errorMessage: {
    color: colors.secondary.accent,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
