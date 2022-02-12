import React, { useContext } from 'react';
import {
  Box, Button, Center, Stack, Alert, VStack, HStack, Text, IconButton, CloseIcon,
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
        _dark={{ bg: 'coolGray.800' }}
      >
        <Button
          onPress={() => login()}
          mt="2"
          colorScheme="tertiary"
          isLoading={isLoading}
        >
          Sign in with Lichess.org
        </Button>
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
