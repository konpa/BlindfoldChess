import React, { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { LichessCtrl } from '../services/LichessCtrl';

type AuthContextData = {
  user: any,
  setUser: any,
  isLoading: boolean,
  error: any,
  setError: any,
  login(): void,
  logout(): void,
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }:{ children:any }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const AuthContextValue = useMemo(() => ({
    user,
    setUser,
    error,
    setError,
    isLoading,
    login: () => {
      setIsLoading(true);
      new LichessCtrl().login();
    },
    logout: () => {
      setIsLoading(true);
      new LichessCtrl().logout()
        .then(() => {
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
  }), [user, error, isLoading]);

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
