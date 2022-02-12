import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Box, HStack, Spinner, Heading,
} from 'native-base';

import { AuthContext } from '../context/AuthProvider';
import { LichessCtrl } from '../services/LichessCtrl';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function Router() {
  const appName = 'Blindfold Chess';
  const [isLoading, setIsLoading] = useState(true);
  const {
    user, setUser, setError,
  } = useContext(AuthContext);

  useEffect(() => {
    setIsLoading(true);
    new LichessCtrl().init()
      .then((response) => {
        setUser(response);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setUser, setError, setIsLoading]);

  if (isLoading) {
    return (
      <Box
        alignItems="center"
        justifyContent="center"
        flex={1}
        _dark={{ bg: 'light.800' }}
      >
        <HStack space={2} justifyContent="center">
          <Spinner accessibilityLabel="Loading" color="amber.500" />
          <Heading color="amber.500" fontSize="md">
            Loading
          </Heading>
        </HStack>
      </Box>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user == null ? (
          // No token found, user isn't signed in
          <Stack.Screen
            name={`Sign In - ${appName}`}
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          // User is signed in
          <Stack.Screen
            name={`Home - ${appName}`}
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
