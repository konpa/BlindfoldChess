import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';

import Router from './src/routes/Router';
import { AuthProvider } from './src/context/AuthProvider';

const config = {
  useSystemColorMode: true,
  initialColorMode: 'light',
};

const customTheme = extendTheme({ config });

export default function App() {
  return (
    <NativeBaseProvider theme={customTheme}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </NativeBaseProvider>
  );
}
