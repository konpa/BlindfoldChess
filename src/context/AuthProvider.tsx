import React, { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

type AuthContextData = {
  user: any;
  setUser: any;
  error: any;
  login(): void;
  logout(): void;
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
    isLoading,
    login: () => {
      setIsLoading(true);
      setError(null);
    },
    logout: () => {
      setIsLoading(true);
      setError(null);
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
