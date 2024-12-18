import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#121212' } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="trading" />
    </Tabs>
  );
}
