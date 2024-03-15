import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './apps/screens/LoginScreen';
import { Clerk, ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';

export default function App() {
  return (
    <ClerkProvider publishableKey='pk_test_bGlnaHQtZWFnbGUtNTguY2xlcmsuYWNjb3VudHMuZGV2JA'>
      <View className="flex-1 bg-white">
        <StatusBar style="auto" />
        <SignedIn>
          <Text className="mt-10">You are Signed in</Text>
        </SignedIn>
        <SignedOut>
          <LoginScreen/>
        </SignedOut>
      </View>
    </ClerkProvider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
