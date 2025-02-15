import { useClerk, useUser } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import { colors } from '~/constants/colors';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all password fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    try {
      await user?.updatePassword({
        currentPassword,
        newPassword: password,
      });
      Alert.alert('Success', 'Password updated successfully!');
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to update password.');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await user?.delete();
      Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
      router.push('/(auth)/sign-in');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to delete account.');
    }
  };

  return (
    <LinearGradient style={styles.container} colors={['#3E1D92', '#1B1030', '#000000']}>
      <SafeAreaView>
        <Text style={styles.title}>Profile</Text>
        {user?.imageUrl && <Image source={{ uri: user?.imageUrl }} style={styles.image} />}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Email Address:</Text>
          <Text style={styles.infoText}>{user?.primaryEmailAddress?.emailAddress}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Current Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Current Password..."
            value={currentPassword}
            secureTextEntry
            onChangeText={setCurrentPassword}
            placeholderTextColor="white"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>New Password:</Text>
          <TextInput
            style={styles.input}
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
            style={styles.input}
            placeholder="Confirm New Password..."
            value={confirmPassword}
            secureTextEntry
            onChangeText={setConfirmPassword}
            placeholderTextColor="white"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Update Password"
            onPress={handleChangePassword}
            color={colors.primary.light}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Delete User" onPress={handleDeleteUser} color="red" />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Sign Out" onPress={() => signOut()} color={colors.primary.light} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 30,
    alignSelf: 'center',
    margin: 10,
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
    marginVertical: 8,
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
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.primary.light,
    borderBottomWidth: 1,
    borderColor: colors.primary.light,
    padding: 5,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});
