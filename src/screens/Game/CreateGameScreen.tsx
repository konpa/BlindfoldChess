import React, { useContext, useState } from 'react';
import axios from 'axios';
import qs from 'qs';
import {
  Center, Box, VStack, FormControl, Button, Select, Radio, Badge,
} from 'native-base';

import { AuthContext } from '../../context/AuthProvider';

export default function CreateGameScreen() {
  const { user } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [level, setLevel] = React.useState('1');
  const [color, setColor] = React.useState('random');

  const challengeAI = () => {
    setIsLoading(true);

    const data = {
      level,
      color,
      variant: 'standard',
    };

    axios({
      method: 'post',
      url: 'https://lichess.org/api/challenge/ai',
      headers: {
        Authorization: `Bearer ${user?.token.accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify(data),
    })
      .then(() => {
        setIsLoading(false);
      });
  };

  return (
    <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>VARIANT</FormControl.Label>
            <Select
              selectedValue="standard"
              isDisabled
            >
              <Select.Item label="Standard" value="standard" />
            </Select>
          </FormControl>
          <FormControl mt="2">
            <FormControl.Label>TIME CONTROL</FormControl.Label>
            <Select
              selectedValue="correspondence"
              isDisabled
            >
              <Select.Item label="Correspondence" value="correspondence" />
            </Select>
          </FormControl>
          <FormControl mt="2">
            <FormControl.Label>COLOR</FormControl.Label>
            <Select
              selectedValue={color}
              onValueChange={(newColor) => setColor(newColor)}
            >
              <Select.Item label="Random" value="random" />
              <Select.Item label="White" value="white" />
              <Select.Item label="Black" value="black" />
            </Select>
          </FormControl>
          <FormControl mt="2">
            <FormControl.Label>
              STOCKFISH LEVEL
              <Badge ml="2">ELO</Badge>
            </FormControl.Label>
            <Radio.Group
              value={level}
              name="level"
              accessibilityLabel="Select the strength"
              onChange={(newLevel) => setLevel(newLevel)}
            >
              <Radio value="1" colorScheme="amber" my={1}>
                Level 1
                <Badge ml="2">800</Badge>
              </Radio>
              <Radio value="2" colorScheme="amber" my={1}>
                Level 2
                <Badge ml="2">1100</Badge>
              </Radio>
              <Radio value="3" colorScheme="amber" my={1}>
                Level 3
                <Badge ml="2">1400</Badge>
              </Radio>
              <Radio value="4" colorScheme="amber" my={1}>
                Level 4
                <Badge ml="2">1700</Badge>
              </Radio>
            </Radio.Group>
          </FormControl>
          <Button
            mt="2"
            py="3"
            colorScheme="amber"
            onPress={() => challengeAI()}
            isLoading={isLoading}
          >
            PLAY
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
