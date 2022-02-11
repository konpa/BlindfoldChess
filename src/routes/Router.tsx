import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../context/AuthProvider';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function Router() {
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    setUser({ name: 'alskaa' });
  }, [setUser]);

  return (
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
  );
}
