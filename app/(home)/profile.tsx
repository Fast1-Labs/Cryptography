import { useClerk, useUser } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import { colors } from '~/constants/colors';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { password, setPassword } = useState('');

  const handleChangePassword = async () => {
    try {
      await user?.updatePassword(password);
    } catch (error) {
      console.error(error);
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
            placeholder="New Password..."
            secureTextEntry
            onChangeText={setPassword}
            placeholderTextColor="white"
          />
          <Button title="Update" onPress={handleChangePassword} />
        </View>
        <Button title="Sign Out" onPress={() => signOut()} />
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
