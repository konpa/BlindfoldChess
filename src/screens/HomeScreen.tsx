import React, {
  useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import axios from 'axios';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RefreshControl } from 'react-native';
import {
  Box, Center, Stack, Button, HStack, VStack, Spacer, Avatar, FlatList, Text,
  Pressable, Icon,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import { AuthContext } from '../context/AuthProvider';
import { RootStackParamList } from '../types/RouteTypes';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const mountedRef = useRef(false);

  const { user } = useContext(AuthContext);

  const [games, setGames] = useState(null);
  const [loading, setLoading] = useState(false);

  const getMyOngoingGames = useCallback(() => {
    setLoading(true);
    axios({
      method: 'get',
      url: 'https://lichess.org/api/account/playing',
      headers: {
        Authorization: `Bearer ${user?.token.accessToken}`,
      },
    })
      .then((response) => {
        if (mountedRef.current) {
          setGames(response.data.nowPlaying);
          setLoading(false);
        }
      });
  }, [user?.token.accessToken]);

  useEffect(() => {
    mountedRef.current = true;

    if (games === null) {
      getMyOngoingGames();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [games, getMyOngoingGames]);

  const gameItem = ({ item }: { item: any }) => (
    <Pressable
      key={item.gameId}
      onPress={() => navigation.navigate('PlayGame', {
        gameId: item.gameId,
      })}
    >
      <Box
        rounded="lg"
        pl="4"
        pr="5"
        py="5"
        mb="4"
        _dark={{ bg: 'light.700' }}
        _light={{ bg: 'light.200' }}
      >
        <HStack space={3} justifyContent="space-between">
          <Avatar bg={item.color} size="48px" />
          <VStack>
            <Text bold>
              {item.opponent.username}
            </Text>
            <Text>
              {item.lastMove}
            </Text>
          </VStack>
          <Spacer />
          <Text>
            {item.isMyTurn && (
              <Icon as={MaterialIcons} name="timer" color="amber.500" />
            )}
          </Text>
        </HStack>
      </Box>
    </Pressable>
  );

  return (
    <>
      <FlatList
        data={games}
        renderItem={gameItem}
        keyExtractor={(item) => item.gameId}
        refreshControl={(
          <RefreshControl
            refreshing={loading}
            onRefresh={getMyOngoingGames}
          />
        )}
        p="2"
      />
      <Box
        position="absolute"
        bottom="5"
        left="0"
        right="0"
        py="3"
      >
        <Center>
          <Stack space={3} w="90%" maxW="400">
            <Button
              onPress={() => navigation.navigate('CreateGame')}
              colorScheme="amber"
              isLoading={loading}
              py="3"
            >
              NEW GAME
            </Button>
          </Stack>
        </Center>
      </Box>
    </>
  );
}
