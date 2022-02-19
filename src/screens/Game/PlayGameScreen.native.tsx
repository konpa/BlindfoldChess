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
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

import { Chess } from 'chess.js';

import { AuthContext } from '../../context/AuthProvider';
import { RootStackParamList } from '../../types/RouteTypes';
import {
  readStream, orderMoves, GameLine, GameLines,
} from '../../helpers/GameHelpers';

polyfillEncoding();
polyfillReadableStream();
polyfillFetch();

type Props = NativeStackScreenProps<RootStackParamList, 'PlayGame'>;

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
        _dark={{ bg: 'light.700' }}
        _light={{ bg: 'light.200' }}
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
              <Icon as={MaterialIcons} name="timer" color="amber.500" />
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
                  _light={{ bg: 'light.200' }}
                  px="6"
                  py="2"
                  rounded="4"
                  alignItems="center"
                >
                  <Box minW="12">
                    <Text bold color="light.400">{ `${line?.number}.` }</Text>
                  </Box>
                  <Box minW="20">
                    <Text
                      bold
                      _light={{
                        color: line?.lastMove === 'white' ? 'amber.500' : 'black',
                      }}
                      _dark={{
                        color: line?.lastMove === 'white' ? 'amber.500' : 'white',
                      }}
                    >
                      {line?.whitePiece ? (
                        <>
                          <Icon
                            as={FontAwesome5}
                            name={`chess-${line?.whitePiece}`}
                            size="4"
                            pr="1"
                            _light={{
                              color: line?.lastMove === 'white' ? 'amber.500' : 'black',
                            }}
                            _dark={{
                              color: line?.lastMove === 'white' ? 'amber.500' : 'white',
                            }}
                          />
                          <Text>{ line?.whiteMove.substring(1) }</Text>
                        </>
                      ) : (
                        <Text>{ line?.whiteMove }</Text>
                      )}
                    </Text>
                  </Box>
                  <Box minW="20">
                    <Text
                      bold
                      _light={{
                        color: line?.lastMove === 'black' ? 'amber.500' : 'black',
                      }}
                      _dark={{
                        color: line?.lastMove === 'black' ? 'amber.500' : 'white',
                      }}
                    >
                      {line?.blackPiece ? (
                        <>
                          <Icon
                            as={FontAwesome5}
                            name={`chess-${line?.blackPiece}`}
                            size="4"
                            pr="1"
                            _light={{
                              color: line?.lastMove === 'black' ? 'amber.500' : 'black',
                            }}
                            _dark={{
                              color: line?.lastMove === 'black' ? 'amber.500' : 'white',
                            }}
                          />
                          <Text>{ line?.blackMove.substring(1) }</Text>
                        </>
                      ) : (
                        <Text>{ line?.blackMove }</Text>
                      )}
                    </Text>
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
        _dark={{ bg: 'light.700' }}
        _light={{ bg: 'light.200' }}
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
              <Icon as={MaterialIcons} name="timer" color="amber.500" />
            )}
          </Text>
        </HStack>
      </Box>
    </Center>
  );
}
