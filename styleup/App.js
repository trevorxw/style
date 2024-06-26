import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './apps/screens/LoginScreen';
import { Clerk, ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './apps/navigations/TabNavigation';

export default function App() {
  return (
    <ClerkProvider publishableKey='pk_test_bGlnaHQtZWFnbGUtNTguY2xlcmsuYWNjb3VudHMuZGV2JA=='>
      <View style={styles.container}>
        <StatusBar style="light" />
        <SignedIn> 
          <NavigationContainer>
            <TabNavigation/>
          </NavigationContainer>
        </SignedIn>
        <SignedOut>
          <LoginScreen/>
        </SignedOut>
      </View>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
