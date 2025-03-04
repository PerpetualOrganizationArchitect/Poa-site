import React from "react";
import { HStack, Heading } from "@chakra-ui/react";
import HistoryCard from "./HistoryCard";
import PaginationControls from "./PaginationControls";
import EmptyState from "./EmptyState";

const VotingHistory = ({
  displayedProposals,
  onPollClick,
  onPreviousClick,
  onNextClick
}) => {
  return (
    <>
      <Heading pl={2} color="rgba(333, 333, 333, 1)">
        History
      </Heading>
      <HStack spacing={4} w="100%" justifyContent="flex-start">
        {displayedProposals.length > 0 ? (
          displayedProposals.map((proposal, index) => (
            <HistoryCard
              key={index}
              proposal={proposal}
              onPollClick={onPollClick}
            />
          ))
        ) : (
          <EmptyState text="No History" />
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

export default VotingHistory; 