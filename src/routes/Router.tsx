import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  useColorMode, Box, HStack, Spinner, Heading, IconButton, Icon,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import { AuthContext } from '../context/AuthProvider';
import { LichessCtrl } from '../services/LichessCtrl';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateGameScreen from '../screens/Game/CreateGameScreen';

const Stack = createNativeStackNavigator();

function LogoutButton() {
  const { logout } = useContext(AuthContext);

  return (
    <IconButton
      onPress={() => logout()}
      icon={<Icon as={MaterialIcons} name="logout" size="sm" _dark={{ color: 'light.300' }} />}
      colorScheme="amber"
    />
  );
}

export default function Router() {
  const [isLoading, setIsLoading] = useState(true);
  const {
    user, setUser, setError,
  } = useContext(AuthContext);

  const scheme = useColorMode().colorMode;
  const NavigatorDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: 'rgb(41, 37, 36)', // light.800
      card: 'rgb(28, 25, 23)', // light.800
    },
  };

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
    <NavigationContainer theme={scheme === 'dark' ? NavigatorDarkTheme : DefaultTheme}>
      {user == null ? (
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen
            name="SignIn"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
        // No token found, user isn't signed in
      ) : (
        // User is signed in
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
            headerRight: LogoutButton,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Blindfold Chess',
            }}
          />
          <Stack.Screen
            name="CreateGame"
            component={CreateGameScreen}
            options={{
              title: 'New Game',
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
