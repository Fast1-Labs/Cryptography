import { useSignUp } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Text, TextInput, Button, StyleSheet, SafeAreaView, Dimensions } from 'react-native';

import { colors } from '~/constants/colors';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState('');

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <LinearGradient
        style={styles.container}
        colors={['#000000', colors.primary.main, colors.primary.dark]}>
        <Text style={styles.title}>Verify your email</Text>
        <TextInput
          style={[styles.textInput, { width: Dimensions.get('window').width / 6 }]}
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
        />
        <Button title="Verify" onPress={onVerifyPress} color="cyan" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      style={styles.container}
      colors={['#000000', colors.primary.main, colors.primary.dark]}>
      <SafeAreaView style={styles.bodyContainer}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.inputText}>Email</Text>

        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
        />
        <Text style={styles.inputText}>Password</Text>
        <TextInput
          style={styles.textInput}
          value={password}
          placeholder="Enter password"
          secureTextEntry
          onChangeText={(password) => setPassword(password)}
        />
        {password.length < 8 && (
          <Text style={styles.warningMessage}>Password must be minimum of 8 characters!</Text>
        )}
        <Button title="Continue" onPress={onSignUpPress} color="cyan" />
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
  bodyContainer: {
    gap: 5,
    width: Dimensions.get('window').width,
  },
  title: {
    color: colors.primary.light,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 30,
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
  warningMessage: {
    color: colors.secondary.accent,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
