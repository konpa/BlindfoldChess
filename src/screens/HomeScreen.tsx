import React, { useContext } from 'react';
import {
  StatusBar, Box, HStack, IconButton, Icon, Text,
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
        _dark={{ bg: 'coolGray.800' }}
      >
        <HStack alignItems="center">
          <IconButton icon={<Icon size="sm" as={MaterialIcons} name="menu" />} />
          <Text fontSize="20" fontWeight="bold">
            Blindfold Chess
          </Text>
        </HStack>
        <HStack>
          <IconButton
            onPress={() => logout()}
            icon={<Icon as={MaterialIcons} name="logout" size="sm" />}
          />
        </HStack>
      </HStack>
    </>
  );
}
