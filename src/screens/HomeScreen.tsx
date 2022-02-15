import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Box, Center, Stack, Button,
} from 'native-base';

type RootStackParamList = {
  CreateGame: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'CreateGame'>;

export default function HomeScreen({ navigation }: Props) {
  return (
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
            onPress={() => navigation.navigate('CreateGame')}
            colorScheme="amber"
          >
            NEW GAME
          </Button>
        </Stack>
      </Center>
    </Box>
  );
}
