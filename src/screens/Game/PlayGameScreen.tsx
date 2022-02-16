import React from 'react';
import { Text } from 'native-base';

export default function CreateGameScreen({ route, navigation }) {
  const { gameId } = route.params;

  return (
    <Text>{ gameId }</Text>
  );
}
