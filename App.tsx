import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, extendTheme } from 'native-base';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

const config = {
  useSystemColorMode: true,
  initialColorMode: 'light',
};

const customTheme = extendTheme({ config });

const user = null;

export default function App() {
  return (
    <NativeBaseProvider theme={customTheme}>
      <NavigationContainer>
        <Stack.Navigator>
          {user == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="Sign In"
              component={LoginScreen}
              options={{ headerShown: false }}
            />

          ) : (
            // User is signed in
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
