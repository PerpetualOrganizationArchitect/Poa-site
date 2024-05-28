// Selection.jsx
import React, { forwardRef } from "react";
import { Button, HStack } from "@chakra-ui/react";

const Selection = forwardRef(({ options, onOptionSelected }, ref) => {
  return (
    <HStack  ref={ref} spacing={4} p={4} width="100%" justifyContent="center">
      {options.map((option, index) => (
        <Button
          key={index}
          colorScheme="teal"
          onClick={() => onOptionSelected(option.value)}
          size="lg"
          borderRadius="md"
          boxShadow="md"
          _hover={{ bg: "teal.600", boxShadow: "lg" }}
          _active={{ bg: "teal.700", boxShadow: "inner" }}
          transition="all 0.2s"
        >
          {option.label}
        </Button>
      ))}
    </HStack>
  );
});

export default Selection;
