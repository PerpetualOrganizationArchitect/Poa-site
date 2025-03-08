import React from "react";
import { Heading, Box, Flex, SimpleGrid, useBreakpointValue } from "@chakra-ui/react";
import HistoryCard from "./HistoryCard";
import PaginationControls from "./PaginationControls";
import EmptyState from "./EmptyState";

const VotingHistory = ({
  displayedProposals,
  onPollClick,
  onPreviousClick,
  onNextClick
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
    <Box w="100%" mt={{ base: 4, md: 6 }}>
      <Heading 
        pl={2} 
        color="rgba(333, 333, 333, 1)" 
        fontSize={headingSize} 
        mb={{ base: 3, md: 4 }}
      >
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