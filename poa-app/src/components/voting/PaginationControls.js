import React from "react";
import { HStack, IconButton, Spacer } from "@chakra-ui/react";
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";

const PaginationControls = ({ onPrevious, onNext }) => {
  return (
    <>
      <Spacer />
      <HStack justifyContent="bottom" spacing={4}>
        <IconButton
          aria-label="Previous"
          background="transparent"
          border="none"
          _hover={{ bg: 'transparent' }} 
          _active={{ bg: 'transparent' }}
          icon={
            <ArrowBackIcon 
              boxSize="6" 
              color="white"
            />
          }
          onClick={onPrevious}
        />
        <IconButton
          aria-label="Next"
          background="transparent"
          border="none"
          _hover={{ bg: 'transparent' }} 
          _active={{ bg: 'transparent' }}
          icon={
            <ArrowForwardIcon 
              boxSize="6" 
              color="white"
            />
          }
          onClick={onNext}
        />
      </HStack>
    </>
  );
};

export default PaginationControls; 