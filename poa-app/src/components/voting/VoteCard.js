import React from "react";
import { Box, Text, Button, HStack } from "@chakra-ui/react";
import CountDown from "@/templateComponents/studentOrgDAO/voting/countDown";

const glassLayerStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(20px)",
  backgroundColor: "rgba(0, 0, 0, .8)",
};

const VoteCard = ({ 
  proposal, 
  showDetermineWinner, 
  getWinner, 
  calculateRemainingTime, 
  onPollClick, 
  contractAddress 
}) => {
  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      borderRadius="3xl"
      boxShadow="lg"
      display="flex"
      w="30%"
      minW="30%"
      maxWidth="30%"
      bg="transparent"
      position="relative"
      color="rgba(333, 333, 333, 1)"
      p={2}
      zIndex={1}
      _hover={{ bg: "black", boxShadow: "md", transform: "scale(1.05)" }}
      onClick={() => {
        if (!showDetermineWinner) {
          onPollClick(proposal);
        }
      }}
    >
      <div className="glass" style={glassLayerStyle} />
      <Text mb="4" fontSize="xl" fontWeight="extrabold">{proposal.name}</Text>
      {showDetermineWinner ? (
        <Button
          colorScheme="gray"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            getWinner(contractAddress, proposal.id);
          }}
        >
          Determine Winner
        </Button>
      ) : (
        <CountDown duration={calculateRemainingTime(proposal?.experationTimestamp)} />
      )}
      <Text mt="2"> Voting Options:</Text>
      <HStack mb={2} spacing={6}>
        {proposal.options.map((option, index) => (
          <Text fontSize="sm" fontWeight="extrabold" key={index}>{option.name}</Text>
        ))}
      </HStack>
    </Box>
  );
};

export default VoteCard; 