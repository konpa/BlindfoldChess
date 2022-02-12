import React, { useContext } from 'react';
import {
  Box, Button, Center, Stack, Alert, VStack, HStack, Text, IconButton, CloseIcon, Heading, Link,
} from 'native-base';

import { AuthContext } from '../context/AuthProvider';

export default function LoginScreen() {
  const { login, isLoading, error } = useContext(AuthContext);

  return (
    <>
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
          <Link href="lichess.org" ml="1">lichess.org</Link>
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
    </>
  );
}
