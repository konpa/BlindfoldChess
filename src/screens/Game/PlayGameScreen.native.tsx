// @ts-ignore: no types available
import { polyfill as polyfillEncoding } from 'react-native-polyfill-globals/src/encoding';
// @ts-ignore: no types available
import { polyfill as polyfillReadableStream } from 'react-native-polyfill-globals/src/readable-stream';
// @ts-ignore: no types available
import { polyfill as polyfillFetch } from 'react-native-polyfill-globals/src/fetch';

import React, {
  useEffect, useRef, useState, useContext,
} from 'react';

import {
  Center, Box, VStack, HStack, ScrollView, Text, Avatar, Spacer, Icon,
} from 'native-base';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

import { Chess } from 'chess.js';

import { AuthContext } from '../../context/AuthProvider';
import { RootStackParamList } from '../../types/RouteTypes';

polyfillEncoding();
polyfillReadableStream();
polyfillFetch();

type Props = NativeStackScreenProps<RootStackParamList, 'PlayGame'>;

const readStream = (processLine: any) => (response: any) => {
  const stream = response.body.getReader();
  const matcher = /\r?\n/;
  const decoder = new TextDecoder();
  let buf = '';

  const loop = () => {
    stream.read().then(({ done, value }: any) => {
      if (done) {
        if (buf.length > 0) processLine(JSON.parse(buf));
      } else {
        const chunk = decoder.decode(value, {
          stream: true,
        });
        buf += chunk;

        const parts = buf.split(matcher);
        buf = parts.pop() ?? '';

        // eslint-disable-next-line no-restricted-syntax
        for (const i of parts.filter((p) => p)) processLine(JSON.parse(i));

        return loop();
      }

      return true;
    });
  };

  return loop();
};

type GameLine = {
  number: number,
  whiteMove: string,
  blackMove: string,
};

type GameLines = Array<GameLine>;

const orderMoves = (array: Array<string>): GameLines => {
  let lineNumber = 1;

  let orderedMoves = Array.from(array, (value, index) => {
    const line = {
      number: 0,
      whiteMove: '',
      blackMove: '',
    };

    if (index % 2 === 0 || index === 0) {
      line.number = lineNumber;
      line.whiteMove = array[index];
      if (array[index + 1] !== undefined) {
        line.blackMove = array[index + 1];
      }

      lineNumber += 1;

      return line;
    }

    return null;
  });

  orderedMoves = orderedMoves.filter((n) => n);

  return orderedMoves.reverse();
};

export default function PlayGameScreen({ route }: Props) {
  const mountedRef = useRef(false);

  const { gameId } = route.params;

  const { user } = useContext(AuthContext);

  const [gameLines, setGameLines] = useState<GameLines>([]);
  const [turn, setTurn] = useState('');
  const [players, setPlayers] = useState({
    white: {
      name: '',
      level: '',
    },
    black: {
      name: '',
      level: '',
    },
  });

  useEffect(() => {
    mountedRef.current = true;

    const chess = new Chess();

    const stream = fetch(`https://lichess.org/api/board/game/stream/${gameId}`, {
      // @ts-ignore: Added by polyfill
      reactNative: { textStreaming: true },
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user?.token.accessToken}`,
        Accept: 'application/x-ndjson',
      },
    });

    stream
      .then(readStream((obj: any) => {
        let moves;

        if (mountedRef.current && obj.type === 'gameFull') {
          const objPlayers = {
            white: {
              name: '',
              level: '',
            },
            black: {
              name: '',
              level: '',
            },
          };

          if (obj.white.name) {
            objPlayers.white.name = obj.white.name;
            objPlayers.white.level = obj.white.rating;
          } else {
            objPlayers.white.name = 'Sotckfish';
            objPlayers.white.level = `level ${obj.white.aiLevel}`;
          }

          if (obj.black.name) {
            objPlayers.black.name = obj.black.name;
            objPlayers.black.level = obj.black.rating;
          } else {
            objPlayers.black.name = 'Sotckfish';
            objPlayers.black.level = `level ${obj.black.aiLevel}`;
          }

          setPlayers(objPlayers);

          moves = obj.state.moves;
        } else if (mountedRef.current && obj.type === 'gameState') {
          moves = obj.moves;
        }

        chess.load_pgn(moves, {
          sloppy: true,
        });

        const lines = orderMoves(chess.history());

        setGameLines(lines);
        setTurn(chess.turn());
      }))
      .then(() => {
        // the stream has ended
      });

    return () => {
      mountedRef.current = false;
    };
  }, [user?.token.accessToken, gameId]);

  return (
    <Center w="100%">
      <Box
        pl="4"
        pr="5"
        py="2"
        mt="4"
        rounded="8"
        w="300"
        _dark={{
          bg: turn === 'w' ? 'amber.600' : 'light.700',
        }}
      >
        <HStack alignItems="center" space={3}>
          <Avatar size="24px" bg="white" />
          <VStack>
            <Text bold>
              { players.white.name }
            </Text>
            <Text>
              { players.white.level }
            </Text>
          </VStack>
          <Spacer />
          <Text>
            {turn === 'w' && (
              <Icon as={MaterialIcons} name="timer" />
            )}
          </Text>
        </HStack>
      </Box>
      <ScrollView h="172px" px="4" my="4">
        <Box>
          <VStack space={4}>
            <VStack space={2}>
              {gameLines.map((line: GameLine, index: number) => (
                <HStack
                  key={index.toString()}
                  _dark={{ bg: 'light.700' }}
                  px="6"
                  py="2"
                  rounded="4"
                  alignItems="center"
                >
                  <Box minW="12">
                    <Text bold color="light.400">{ `${line.number}.` }</Text>
                  </Box>
                  <Box minW="20">
                    <Text bold>{ line.whiteMove }</Text>
                  </Box>
                  <Box>
                    <Text bold>{ line.blackMove }</Text>
                  </Box>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
      <Box
        pl="4"
        pr="5"
        py="2"
        rounded="8"
        w="300"
        _dark={{
          bg: turn === 'b' ? 'amber.600' : 'light.700',
        }}
      >
        <HStack alignItems="center" space={3}>
          <Avatar size="24px" bg="black" />
          <VStack>
            <Text bold>
              { players.black.name }
            </Text>
            <Text>
              { players.black.level }
            </Text>
          </VStack>
          <Spacer />
          <Text>
            {turn === 'b' && (
              <Icon as={MaterialIcons} name="timer" />
            )}
          </Text>
        </HStack>
      </Box>
    </Center>
  );
}