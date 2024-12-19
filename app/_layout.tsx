import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { tokenCache } from '../utils/cache';

export default function Layout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache} key={publishableKey}>
      <ClerkLoaded>
        <GestureHandlerRootView>
          <Slot />
        </GestureHandlerRootView>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
