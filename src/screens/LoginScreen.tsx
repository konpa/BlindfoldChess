import React, { useContext } from 'react';
import {
  Box, Button, Text, Heading, Link,
} from 'native-base';

import { AuthContext } from '../context/AuthProvider';

export default function LoginScreen() {
  const { login, isLoading } = useContext(AuthContext);

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      flex={1}
      p="5"
      _dark={{ bg: 'light.800' }}
    >
      <Heading size="lg" style={{ textTransform: 'uppercase' }} _dark={{ color: 'light.300' }}>Blindfold Chess</Heading>
      <Text mb="16" _dark={{ color: 'light.300' }}>
        Powered by
        { ' ' }
        <Link href="lichess.org">lichess.org</Link>
      </Text>
      <Button
        onPress={() => login()}
        mt="2"
        w="100%"
        maxW="300"
        isLoading={isLoading}
        colorScheme="amber"
      >
        SIGN IN
      </Button>
      <Text mt="2" fontSize="xs" _dark={{ color: 'light.300' }}>
        Sign in with your lichess account
      </Text>
    </Box>
  );
}
