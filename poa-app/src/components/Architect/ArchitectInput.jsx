import React from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Box
} from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";

const ArchitectInput = ({ value, onChange, onSubmit, isDisabled }) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSubmit(); 
    }
  };

  return (
    <Box ml="13%" mr="13%" mt="4" mb="4">
      <InputGroup>
        <Input
          value={value}
          onChange={onChange}
          placeholder="Message Poa"
          borderColor="blue.500"
          backgroundColor="whiteAlpha.900"
          borderRadius="full"
          py={6} 
          px={4}
          fontSize="md"
          transition="border-color 0.2s ease, box-shadow 0.2s ease"  // Smooth transition on focus
          _placeholder={{ color: "gray.500" }}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          boxShadow="md"
          _focus={{
            borderColor: "blue.500",
            boxShadow: "0 0 0 2px rgba(0, 23, 255, 0.3)", // Subtle outer glow on focus
            outline: "none", // Remove default outline
          }}
        />
        <InputRightElement>
          <IconButton
            mt="2.5"
            mr="6"
            icon={<ArrowUpIcon color="teal.400" />}
            variant="ghost"
            aria-label="Send"
            onClick={onSubmit}
            _hover={{ background: "teal.50" }}
          />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default ArchitectInput;
