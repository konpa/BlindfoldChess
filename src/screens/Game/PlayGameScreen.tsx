// @ts-ignore: no types available
import { polyfill as polyfillEncoding } from 'react-native-polyfill-globals/src/encoding';
// @ts-ignore: no types available
import { polyfill as polyfillReadableStream } from 'react-native-polyfill-globals/src/readable-stream';
// @ts-ignore: no types available
import { polyfill as polyfillFetch } from 'react-native-polyfill-globals/src/fetch';

import React, {
  useEffect, useRef, useState, useContext,
} from 'react';

import { View, Text } from 'native-base';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

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

export default function PlayGameScreen({ route }: Props) {
  const mountedRef = useRef(false);

  const { gameId } = route.params;

  const { user } = useContext(AuthContext);

  const [gameMoves, setGameMoves] = useState([]);

  useEffect(() => {
    mountedRef.current = true;

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
        if (mountedRef.current && obj.type === 'gameFull') {
          setGameMoves(obj.state.moves);
        } else if (mountedRef.current && obj.type === 'gameState') {
          setGameMoves(obj.moves);
        }
      }))
      .then(() => {
        // the stream has ended
      });

    return () => {
      mountedRef.current = false;
    };
  }, [user?.token.accessToken, gameId]);

  return (
    <View>
      <Text>{ gameId }</Text>
      <Text>{ gameMoves }</Text>
    </View>
  );
}
