import React from "react";
import { Flex, VStack, Box } from "@chakra-ui/react";
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
  boxShadow: "inset 0 0 15px rgba(148, 115, 220, 0.15)",
  border: "1px solid rgba(148, 115, 220, 0.2)",
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
      p="3%"
      w="100%"
      mx="auto"
      maxW="1400px"
      bg="transparent"
      position="relative"
      display="flex"
      zIndex={0}
      transition="all 0.3s ease"
      _hover={{ 
        transform: "translateY(-3px)",
        boxShadow: "xl"
      }}
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
      
      <Flex w="100%" flexDirection="column">
        <VStack alignItems={"flex-start"} spacing={8} w="100%">
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