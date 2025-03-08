import React from "react";
import { HStack, Heading, Box, Flex, Text, Button, Icon, SimpleGrid, useBreakpointValue } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import VoteCard from "./VoteCard";
import PaginationControls from "./PaginationControls";
import EmptyState from "./EmptyState";

const OngoingVotes = ({
  displayedProposals,
  showDetermineWinner,
  getWinner,
  calculateRemainingTime,
  contractAddress,
  onPollClick,
  onPreviousClick,
  onNextClick,
  onCreateClick,
  showCreatePoll
}) => {
  // Use responsive sizing based on breakpoints
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  
  // Calculate appropriate column sizing based on number of proposals
  const getColumnCount = (count) => {
    if (count === 1) return { base: 1 };
    if (count === 2) return { base: 1, md: 2 };
    return { base: 1, md: 2, lg: 3, xl: 3 };
  };

  return (
    <Box w="100%" mb={8}>
      <Flex 
        justify="space-between" 
        align={{ base: "flex-start", sm: "center" }}
        direction={{ base: "column", sm: "row" }}
        mb={{ base: 3, md: 4 }}
        gap={{ base: 2, sm: 0 }}
      >
        <Heading 
          pl={2} 
          color="rgba(333, 333, 333, 1)" 
          fontSize={headingSize} 
          mb={{ base: 1, sm: 0 }}
        >
          Ongoing Votes
        </Heading>
        {showCreatePoll && (
          <Button
            leftIcon={<AddIcon />}
            colorScheme="purple"
            variant="solid"
            onClick={onCreateClick}
            size={{ base: "md", md: "lg" }}
            px={{ base: 3, md: 4 }}
          >
            Create Vote
          </Button>
        )}
      </Flex>
      
      <Flex direction="column" w="100%" align="center">
        {displayedProposals.length > 0 ? (
          <>
            <SimpleGrid 
              columns={getColumnCount(displayedProposals.length)}
              spacing={4} 
              w="100%"
              justifyItems="center"
              justifyContent="center"
              mb={4}
              maxW="1200px"
              mx="auto"
            >
              {displayedProposals.map((proposal, index) => (
                <Flex w="100%" key={index} justify="center">
                  <VoteCard
                    proposal={proposal}
                    showDetermineWinner={showDetermineWinner[proposal.id]}
                    getWinner={getWinner}
                    calculateRemainingTime={calculateRemainingTime}
                    onPollClick={onPollClick}
                    contractAddress={contractAddress}
                  />
                </Flex>
              ))}
            </SimpleGrid>
            
            <Flex justify="center" mb={2}>
              <PaginationControls
                onPrevious={onPreviousClick}
                onNext={onNextClick}
              />
            </Flex>
          </>
        ) : (
          <EmptyState text="No Ongoing Votes" />
        )}
      </Flex>
    </Box>
  );
};

export default OngoingVotes; 