// Selection.jsx
import React, { forwardRef } from "react";
import { Button, HStack, Box } from "@chakra-ui/react";

const Selection = forwardRef(({ options, onOptionSelected }, ref) => {
  return (
    <HStack ref={ref} spacing={4} p={2} width="100%" justifyContent="center">
      {options.map((option, index) => (
        <React.Fragment key={index}>
          {option.isComponent ? (
            <Box p="0">{option.label}</Box>
          ) : (
            <Button
              colorScheme="teal"
              onClick={() => onOptionSelected(option.value)}
              size={["xs","lg"]}
              borderRadius="md"
              boxShadow="md"
              _hover={{ bg: "teal.600", boxShadow: "lg" }}
              _active={{ bg: "teal.700", boxShadow: "inner" }}
              transition="all 0.2s"
            >
              {option.label}
            </Button>
          )}
        </React.Fragment>
      ))}
    </HStack>
  );
});

export default Selection;
