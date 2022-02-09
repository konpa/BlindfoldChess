import React from 'react';
import { Box, Button } from 'native-base';

export default function LoginScreen() {
  return (
    <Box alignItems="center" justifyContent="center" flex={1} _dark={{ bg: 'coolGray.800' }}>
      <Button mt="2" colorScheme="tertiary">
        Sign in with Lichess.org
      </Button>
    </Box>
  );
}
