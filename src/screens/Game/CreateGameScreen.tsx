import React from 'react';
import {
  Center, Box, VStack, FormControl, Button, Select, Radio, Badge,
} from 'native-base';

export default function CreateGameScreen() {
  const [level, setLevel] = React.useState('1');

  return (
    <Center w="100%">
      <Box safeArea p="2" py="8" w="90%" maxW="290">
        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Variant</FormControl.Label>
            <Select
              selectedValue="standard"
              isDisabled
            >
              <Select.Item label="Standard" value="standard" />
            </Select>
          </FormControl>
          <FormControl mt="5">
            <FormControl.Label>Time Control</FormControl.Label>
            <Select
              selectedValue="correspondence"
              isDisabled
            >
              <Select.Item label="Correspondence" value="correspondence" />
            </Select>
          </FormControl>
          <FormControl mt="5">
            <FormControl.Label>
              Stockfish level
              <Badge ml="2">Elo</Badge>
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
          <Button mt="2" colorScheme="amber">
            Play
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
