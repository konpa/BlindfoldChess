import React, { useContext } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  useColorMode, Box, HStack, Spinner, Heading, Text, CloseIcon,
  IconButton, Icon, Center, Stack, Alert, VStack,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import { AuthContext } from '../context/AuthProvider';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateGameScreen from '../screens/Game/CreateGameScreen';
import PlayGameScreen from '../screens/Game/PlayGameScreen';

type RootStackParamList = {
  SignIn: undefined;
  Home: undefined;
  CreateGame: undefined;
  PlayGame: { gameId: string };
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

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
  const { user, isLoading, error } = useContext(AuthContext);

  const scheme = useColorMode().colorMode;
  const NavigatorDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: 'rgb(41, 37, 36)', // light.800
      card: 'rgb(28, 25, 23)', // light.800
    },
  };

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
        <RootStack.Navigator initialRouteName="SignIn">
          <RootStack.Screen
            name="SignIn"
            component={LoginScreen}
            options={{
              title: 'Log In - Blindfold Chess',
              headerShown: false,
            }}
          />
        </RootStack.Navigator>
      ) : (
        <RootStack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: 'center',
            headerRight: LogoutButton,
          }}
        >
          <RootStack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Blindfold Chess',
            }}
          />
          <RootStack.Screen
            name="CreateGame"
            component={CreateGameScreen}
            options={{
              title: 'New Game',
            }}
          />
          <RootStack.Screen
            name="PlayGame"
            component={PlayGameScreen}
            options={{
              title: 'Play Game',
            }}
          />
        </RootStack.Navigator>
      )}
      {error && (
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          py="3"
        >
          <Center>
            <Stack space={3} w="90%" maxW="400">
              <Alert w="100%" status="error" variant="left-accent">
                <VStack space={2} flexShrink={1} w="100%">
                  <HStack flexShrink={1} space={2} justifyContent="space-between">
                    <HStack space={2} flexShrink={1}>
                      <Alert.Icon mt="1" />
                      <Text fontSize="md" color="coolGray.800">
                        {error.toString()}
                      </Text>
                    </HStack>
                    <IconButton variant="unstyled" icon={<CloseIcon size="3" color="coolGray.600" />} />
                  </HStack>
                </VStack>
              </Alert>
            </Stack>
          </Center>
        </Box>
      )}
    </NavigationContainer>
  );
}
