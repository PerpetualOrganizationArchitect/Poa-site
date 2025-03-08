import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
  VStack,
  HStack,
  Progress,
  Box,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useRouter } from "next/router";

const glassLayerStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(9px)",
  backgroundColor: "rgba(33, 33, 33, 0.97)",
  boxShadow: "inset 0 0 15px rgba(148, 115, 220, 0.15)",
  border: "1px solid rgba(148, 115, 220, 0.2)",
};

const CompletedPollModal = ({ onOpen, isOpen, onClose, selectedPoll, voteType }) => {
  const router = useRouter();
  const { userDAO } = router.query;
  const [processedOptions, setProcessedOptions] = useState([]);

  const handleModalClose = () => {
    onClose();
    router.push(`/voting/?userDAO=${userDAO}`);
  };

  // Process vote data when the poll changes
  useEffect(() => {
    if (!selectedPoll || !selectedPoll.options) return;
    
    console.log("Modal Poll Data:", JSON.stringify(selectedPoll, null, 2));
    
    // Calculate total votes accurately by adding up all votes
    let calculatedTotalVotes = 0;
    const normalizedOptions = [];
    
    // First pass - calculate total votes
    selectedPoll.options.forEach((option, index) => {
      let voteCount = 0;
      
      try {
        if (option.votes !== undefined) {
          if (typeof option.votes === 'number') {
            voteCount = option.votes;
          } else if (typeof option.votes === 'string') {
            voteCount = parseInt(option.votes, 10) || 0;
          } else if (typeof option.votes === 'object') {
            if (option.votes && option.votes._hex) {
              voteCount = parseInt(option.votes._hex, 16) || 0;
            } else if (option.votes && typeof option.votes.toNumber === 'function') {
              try {
                voteCount = option.votes.toNumber() || 0;
              } catch (e) {
                console.error("Error converting BigNumber:", e);
                voteCount = 0;
              }
            }
          }
        }
      } catch (error) {
        console.error("Error calculating vote count:", error);
        voteCount = 0;
      }
      
      normalizedOptions.push({
        ...option,
        normalizedVotes: voteCount,
        name: option.name || `Option ${index + 1}`,
      });
      
      calculatedTotalVotes += voteCount;
    });
    
    // Ensure we have at least 1 for division
    const totalVotes = calculatedTotalVotes || 1;
    
    console.log("Calculated Total Votes:", calculatedTotalVotes);
    
    // Second pass - process options with vote counts and percentages
    const processed = normalizedOptions.map((option, index) => {      
      // Calculate percentage relative to the total votes
      let percentage = 0;
      if (totalVotes > 0) {
        percentage = (option.normalizedVotes / totalVotes) * 100;
      } else if (option.currentPercentage) {
        percentage = Number(option.currentPercentage);
      }
      
      console.log(`Option ${index} (${option.name}) - Votes: ${option.normalizedVotes} / ${totalVotes} = ${percentage.toFixed(1)}%`);
      
      return {
        ...option,
        processedVotes: option.normalizedVotes,
        percentage: percentage,
        isWinner: index === selectedPoll.winningOptionIndex,
      };
    });
    
    setProcessedOptions(processed);
  }, [selectedPoll]);

  return (
    <Modal onOpen={onOpen} isOpen={isOpen} onClose={handleModalClose} size="lg">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent
        alignItems="center"
        justifyContent="center"
        borderRadius="3xl"
        boxShadow="lg"
        display="flex"
        w="100%"
        maxWidth="600px"
        bg="transparent"
        position="relative"
        p={4}
        zIndex={1}
        mt="10%"
        color="ghostwhite"
      >
        <Box
          className="glass" 
          style={glassLayerStyle} 
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          borderRadius="inherit"
          zIndex={-1}
        />
        
        <ModalHeader
          color="rgba(333, 333, 333, 1)"
          fontWeight="extrabold"
          fontSize="2xl"
        >
          {selectedPoll?.name}
        </ModalHeader>
        <ModalCloseButton color="white" />
        
        <ModalBody width="100%">
          <VStack spacing={6} align="stretch" width="100%">
            {/* Description Section */}
            {selectedPoll?.description && (
              <Box p={4} bg="whiteAlpha.100" borderRadius="md">
                <Text color="rgba(333, 333, 333, 1)" fontSize="md">
                  {selectedPoll.description}
                </Text>
              </Box>
            )}

            {/* Results Section */}
            <VStack color="rgba(333, 333, 333, 1)" spacing={4} align="stretch">
              <Text fontSize="lg" fontWeight="bold" borderBottom="1px solid" borderColor="whiteAlpha.300" pb={2}>
                Results:
              </Text>
              
              {processedOptions.map((option, index) => (
                <VStack key={index} align="stretch" spacing={1}>
                  <HStack justify="space-between">
                    <Text 
                      fontWeight={option.isWinner ? "bold" : "normal"}
                      color={option.isWinner ? "purple.300" : "white"}
                    >
                      {option.name} 
                      {option.isWinner && " (Winner)"}
                    </Text>
                    <Text>
                      {option.processedVotes} vote{option.processedVotes !== 1 ? 's' : ''} ({option.percentage.toFixed(1)}%)
                    </Text>
                  </HStack>
                  <Progress 
                    value={option.percentage} 
                    size="sm" 
                    colorScheme={option.isWinner ? "purple" : "blue"} 
                    borderRadius="full"
                    bg="whiteAlpha.200"
                  />
                </VStack>
              ))}
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button 
            colorScheme="purple" 
            onClick={handleModalClose} 
            mr={3}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CompletedPollModal;
