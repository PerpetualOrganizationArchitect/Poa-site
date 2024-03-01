// Selection.jsx
import React, { forwardRef } from "react";
import { Button, VStack } from "@chakra-ui/react";

const Selection = forwardRef(({ options, onOptionSelected }, ref) => {
  return (
    <VStack ref={ref} spacing={4} p={15} /* Added padding here */>
      {options.map((option, index) => (
        <Button
          key={index}
          colorScheme="teal"
          onClick={() => onOptionSelected(option.action)}
        >
          {option.title}
        </Button>
      ))}
    </VStack>
  );
});

export default Selection;
