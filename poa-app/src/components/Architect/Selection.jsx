import React from 'react';
import { Button, Stack } from '@chakra-ui/react';

const Selection = ({ options, onOptionSelected }) => {
  return (
    <Stack direction="column" spacing={4}>
      {options.map((option, index) => (
        <Button key={index} colorScheme="teal" onClick={() => onOptionSelected(option.action)}>
          {option.title}
        </Button>
      ))}
    </Stack>
  );
};

export default Selection;
