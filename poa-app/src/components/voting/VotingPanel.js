import React from "react";
import { Flex, VStack } from "@chakra-ui/react";
import OngoingVotes from "./OngoingVotes";
import VotingHistory from "./VotingHistory";

const glassLayerStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(20px)",
  backgroundColor: "rgba(0, 0, 0, .8)",
};

const VotingPanel = ({
  displayedOngoingProposals,
  displayedCompletedProposals,
  showDetermineWinner,
  getWinner,
  calculateRemainingTime,
  contractAddress,
  onPollClick,
  onPreviousOngoingClick,
  onNextOngoingClick,
  onPreviousCompletedClick,
  onNextCompletedClick,
  onCreateClick,
  showCreatePoll
}) => {
  return (
    <Flex
      align="center"
      mb={8}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      borderRadius="3xl"
      boxShadow="lg"
      p="2%"
      w="100%"
      bg="transparent"
      position="relative"
      display="flex"
      zIndex={0}
    >
      <div className="glass" style={glassLayerStyle} />
      <Flex w="100%" flexDirection="column">
        <VStack alignItems={"flex-start"} spacing={6}>
          <OngoingVotes
            displayedProposals={displayedOngoingProposals}
            showDetermineWinner={showDetermineWinner}
            getWinner={getWinner}
            calculateRemainingTime={calculateRemainingTime}
            contractAddress={contractAddress}
            onPollClick={onPollClick}
            onPreviousClick={onPreviousOngoingClick}
            onNextClick={onNextOngoingClick}
            onCreateClick={onCreateClick}
            showCreatePoll={showCreatePoll}
          />
          <VotingHistory
            displayedProposals={displayedCompletedProposals}
            onPollClick={onPollClick}
            onPreviousClick={onPreviousCompletedClick}
            onNextClick={onNextCompletedClick}
          />
        </VStack>
      </Flex>
    </Flex>
  );
};

export default VotingPanel; 