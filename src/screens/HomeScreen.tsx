import React, { useContext } from 'react';
import {
  StatusBar, Box, HStack, IconButton, Icon, Text, Center, Stack, Button,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import { AuthContext } from '../context/AuthProvider';

export default function HomeScreen() {
  const { logout } = useContext(AuthContext);

  return (
    <>
      <StatusBar />
      <Box safeAreaTop />
      <HStack
        px="1"
        py="3"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        _dark={{ bg: 'light.900' }}
      >
        <HStack>
          <IconButton icon={<Icon size="sm" as={MaterialIcons} name="menu" _dark={{ color: 'light.300' }} />} />
        </HStack>
        <HStack>
          <Text
            fontSize="sm"
            fontWeight="bold"
            textTransform="uppercase"
            _dark={{ color: 'light.300' }}
          >
            Blindfold Chess
          </Text>
        </HStack>
        <HStack>
          <IconButton
            onPress={() => logout()}
            icon={<Icon as={MaterialIcons} name="logout" size="sm" _dark={{ color: 'light.300' }} />}
          />
        </HStack>
      </HStack>
      <Box
        w="100%"
        h="100%"
        _dark={{ bg: 'light.800' }}
      />
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        py="3"
      >
        <Center>
          <Stack space={3} w="90%" maxW="400">
            <Button
              colorScheme="amber"
            >
              NEW GAME
            </Button>
          </Stack>
        </Center>
      </Box>
    </>
  );
}
