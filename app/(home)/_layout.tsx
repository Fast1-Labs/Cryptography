import { useAuth } from '@clerk/clerk-expo';
import { FontAwesome } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/tabs';

import { colors } from '~/constants/colors';

export default function Layout() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#121212' },
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: 'white',
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trading"
        options={{
          title: 'Trading',
          tabBarIcon: ({ color }) => <FontAwesome name="money" size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="mytokens"
        options={{
          title: 'My Tokens',
          tabBarIcon: ({ color }) => <FontAwesome name="bitcoin" size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={25} color={color} />,
        }}
      />
    </Tabs>
  );
}
