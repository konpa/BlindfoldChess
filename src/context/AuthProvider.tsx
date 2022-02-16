import React, {
  createContext, useState, useMemo, useEffect,
} from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {
  makeRedirectUri, useAuthRequest, exchangeCodeAsync, TokenResponse, AuthError,
} from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import PropTypes from 'prop-types';

type AuthContextData = {
  user: any,
  setUser: any,
  isLoading: boolean,
  setIsLoading: any,
  error: any,
  setError: any,
  login(): void,
  logout(): void,
};

type UserData = {
  token: TokenResponse,
};

const useProxy = Platform.select({ web: false, default: true });

const redirectUri = Platform.select({
  web: __DEV__ ? 'http://localhost:19006/expo-auth-session' : makeRedirectUri({ useProxy }),
  default: makeRedirectUri({ useProxy }),
});

WebBrowser.maybeCompleteAuthSession();

const host = 'https://lichess.org';
const clientId = 'io.blindfoldchess';

const discovery = {
  authorizationEndpoint: `${host}/oauth`,
  tokenEndpoint: `${host}/api/token`,
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }:{ children:any }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      redirectUri,
      scopes: ['challenge:write', 'bot:play', 'board:play'],
    },
    discovery,
  );

  useEffect(() => {
    setIsLoading(true);

    function UseAutoExchange(code: string) {
      exchangeCodeAsync(
        {
          clientId,
          code,
          redirectUri,
          extraParams: {
            code_verifier: request?.codeVerifier ? request.codeVerifier : '',
          },
        },
        discovery,
      )
        .then((token) => {
          const authUser = { token };
          AsyncStorage.setItem('@AuthData', JSON.stringify(authUser));
          setUser(authUser);
        })
        .catch((exchangeError) => {
          setError(exchangeError);
        });
    }

    function readResponse() {
      if (response?.type === 'success') {
        UseAutoExchange(response.params.code);
      }

      if (response?.type === 'error') {
        setError(response?.error ? response.error : null);
      }
    }

    if (user === null) {
      AsyncStorage.getItem('@AuthData')
        .then((authData) => {
          if (authData) {
            setUser(JSON.parse(authData));
          } else {
            readResponse();
          }
        });
    }

    setIsLoading(false);
  }, [user, response, request]);

  const AuthContextValue = useMemo(() => ({
    user,
    setUser,
    error,
    setError,
    isLoading,
    setIsLoading,
    login: () => {
      setIsLoading(true);
      promptAsync({ useProxy });
      setIsLoading(false);
    },
    logout: async () => {
      setIsLoading(true);
      axios({
        method: 'delete',
        url: `${host}/api/token`,
        headers: {
          Authorization: `Bearer ${user?.token.accessToken}`,
        },
      })
        .then(async () => {
          await AsyncStorage.removeItem('@AuthData');
          setUser(null);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    },
  }), [user, error, isLoading, promptAsync]);

  return (
    <AuthContext.Provider
      value={AuthContextValue}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
