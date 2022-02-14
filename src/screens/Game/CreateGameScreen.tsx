import React from 'react';
import { View, Button, Text } from 'native-base';

export default function CreateGameScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Create New Game</Text>
      <Button
        mt="2"
        w="100%"
        maxW="300"
        colorScheme="amber"
      >
        PLAY
      </Button>
    </View>
  );
}
