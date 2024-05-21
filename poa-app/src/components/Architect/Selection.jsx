// Selection.jsx
import React, { forwardRef } from "react";
import { Button, VStack } from "@chakra-ui/react";

const Selection = forwardRef(({ options, onOptionSelected }, ref) => {

  return (
    <VStack ref={ref} spacing={4} p={15}>
      {options.map((option, index) => (
        <Button
          key={index}
          colorScheme="teal"
          onClick={() => onOptionSelected(option.value)} // Assuming you want to pass the value on selection
        >
          {option.label}
        </Button>
      ))}
    </VStack>
  );
});

export default Selection;
