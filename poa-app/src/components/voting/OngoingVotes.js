import React from "react";
import { HStack, Heading, Box, Flex, Text, Button } from "@chakra-ui/react";
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
  return (
    <>
      <HStack w="100%" justifyContent="space-between">
        <Heading pl={2} color="rgba(333, 333, 333, 1)">
          Ongoing Votes
        </Heading>
        <Button
          fontWeight="black"
          p="1%"
          w="20%"
          bg="green.300"
          mt="1%"
          onClick={onCreateClick}
          _hover={{ bg: "green.400", transform: "scale(1.05)" }}
        >
          {showCreatePoll ? "Hide Create Vote Form" : "Create Vote"}
        </Button>
      </HStack>
      <HStack justifyContent={"flex-start"} w="100%" spacing={4}>
        {displayedProposals.length > 0 ? (
          displayedProposals.map((proposal, index) => (
            <VoteCard
              key={index}
              proposal={proposal}
              showDetermineWinner={showDetermineWinner[proposal.id]}
              getWinner={getWinner}
              calculateRemainingTime={calculateRemainingTime}
              onPollClick={onPollClick}
              contractAddress={contractAddress}
            />
          ))
        ) : (
          <EmptyState text="No Ongoing Votes" />
        )}
        {displayedProposals.length > 0 && (
          <PaginationControls
            onPrevious={onPreviousClick}
            onNext={onNextClick}
          />
        )}
      </HStack>
    </>
  );
};

export default OngoingVotes; 