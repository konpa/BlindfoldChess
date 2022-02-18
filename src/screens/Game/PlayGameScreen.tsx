import React from 'react';
import { Text } from 'native-base';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../types/RouteTypes';

type Props = NativeStackScreenProps<RootStackParamList, 'PlayGame'>;

export default function PlayGameScreen({ route }: Props) {
  const { gameId } = route.params;

  return (
    <Text>{ gameId }</Text>
  );
}
