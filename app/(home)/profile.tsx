import { useClerk, useUser } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import { colors } from '~/constants/colors';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { password, setPassword } = useState('');
  const { confirmPassword, setConfirmPassword } = useState('');

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      return;
    }
    try {
      await user?.updatePassword(password);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await user?.delete();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <LinearGradient style={styles.container} colors={['#3E1D92', '#1B1030', '#000000']}>
      <SafeAreaView>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Email Adress:</Text>
          <Text style={styles.infoText}>{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Password:</Text>
          <TextInput
            style={styles.infoText}
            placeholder="Enter New Password..."
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            placeholderTextColor="white"
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Confirm Password:</Text>
          <TextInput
            style={styles.infoText}
            placeholder="Confirm New Password..."
            value={confirmPassword}
            secureTextEntry
            onChangeText={setConfirmPassword}
            placeholderTextColor="white"
          />
        </View>
        <Button title="Update Password" onPress={handleChangePassword} />
        <Button
          title="Delete User"
          onPress={() => {
            handleDeleteUser();
            router.push('/(auth)/sign-in');
          }}
          color="red"
        />
        <Button title="Sign Out" onPress={() => signOut()} />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.primary.dark,
    padding: 20,
  },
  infoContainer: {
    alignItems: 'center',
    borderColor: colors.primary.dark,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 10,
  },
  infoTitle: {
    color: colors.primary.light,
    fontSize: 18,
    fontWeight: 'bold',
    width: 150,
  },
  infoText: {
    color: colors.primary.light,
    fontSize: 16,
    flex: 1,
  },
});
