import React from "react";
import { Heading, Box, Flex, SimpleGrid } from "@chakra-ui/react";
import HistoryCard from "./HistoryCard";
import PaginationControls from "./PaginationControls";
import EmptyState from "./EmptyState";

const VotingHistory = ({
  displayedProposals,
  onPollClick,
  onPreviousClick,
  onNextClick
}) => {
  // Calculate appropriate column sizing based on number of proposals and make sure they fit on smaller screens
  const getColumnCount = (count) => {
    if (count === 1) return { base: 1 };
    if (count === 2) return { base: 1, md: 2 };
    return { base: 1, md: 2, lg: 3, xl: 3 };
  };

  return (
    <Box w="100%" mt={6}>
      <Heading pl={2} color="rgba(333, 333, 333, 1)" fontSize="2xl" mb={4}>
        Voting History
      </Heading>
      
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
                  <HistoryCard
                    proposal={proposal}
                    onPollClick={onPollClick}
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
          <EmptyState text="No Voting History" />
        )}
      </Flex>
    </Box>
  );
};

export default VotingHistory; 