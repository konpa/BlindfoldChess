import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Box, Center, Stack, Button,
} from 'native-base';

import { AuthContext } from '../context/AuthProvider';

type RootStackParamList = {
  CreateGame: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'CreateGame'>;

export default function HomeScreen({ navigation }: Props) {
  const { user, setError, setIsLoading } = useContext(AuthContext);

  const getMyOngoingGames = () => {
    setIsLoading(true);

    axios({
      method: 'get',
      url: 'https://lichess.org/api/account/playing',
      headers: {
        Authorization: `Bearer ${user?.token.accessToken}`,
      },
    })
      .then(() => {
        //
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    // getMyOngoingGames();
  });

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
