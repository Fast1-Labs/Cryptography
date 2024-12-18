import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { colors } from '~/constants/colors';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#121212' },
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: 'white',
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
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={25} color={color} />,
        }}
      />
    </Tabs>
  );
}
