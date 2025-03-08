import React from "react";
import { HStack, IconButton, Flex } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const PaginationControls = ({ onPrevious, onNext }) => {
  return (
    <Flex justify="center" align="center" width="100%">
      <HStack spacing={4}>
        <IconButton
          aria-label="Previous"
          icon={<ChevronLeftIcon boxSize="6" />}
          onClick={onPrevious}
          size="md"
          colorScheme="purple"
          variant="ghost"
          borderRadius="full"
          _hover={{ 
            bg: "rgba(148, 115, 220, 0.2)",
            transform: "translateX(-2px)"
          }}
          _active={{ 
            bg: "rgba(148, 115, 220, 0.3)"
          }}
          transition="all 0.2s ease"
        />
        <IconButton
          aria-label="Next"
          icon={<ChevronRightIcon boxSize="6" />}
          onClick={onNext}
          size="md"
          colorScheme="purple"
          variant="ghost"
          borderRadius="full"
          _hover={{ 
            bg: "rgba(148, 115, 220, 0.2)",
            transform: "translateX(2px)"
          }}
          _active={{ 
            bg: "rgba(148, 115, 220, 0.3)"
          }}
          transition="all 0.2s ease"
        />
      </HStack>
    </Flex>
  );
};

export default PaginationControls; 