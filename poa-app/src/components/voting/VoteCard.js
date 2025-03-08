import React from "react";
import { Box, Text, Button, HStack, VStack, Badge, Flex } from "@chakra-ui/react";
import CountDown from "@/templateComponents/studentOrgDAO/voting/countDown";

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
      justifyContent="space-between"
      borderRadius="2xl"
      boxShadow="lg"
      display="flex"
      w="100%"
      maxWidth="380px"
      bg="transparent"
      position="relative"
      color="rgba(333, 333, 333, 1)"
      p={4}
      zIndex={1}
      h="200px"
      transition="all 0.3s ease"
      cursor="pointer"
      _hover={{ 
        transform: "translateY(-5px) scale(1.02)", 
        boxShadow: "0 10px 20px rgba(148, 115, 220, 0.2)",
        "& .glass": {
          border: "1px solid rgba(148, 115, 220, 0.5)",
          boxShadow: "inset 0 0 20px rgba(148, 115, 220, 0.3)",
        }
      }}
      onClick={() => {
        if (!showDetermineWinner) {
          onPollClick(proposal);
        }
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
        transition="all 0.3s ease"
      />
      
      <VStack spacing={2} align="stretch" w="100%">
        <Box h="48px" mb={1}>
          <Text 
            fontSize="md" 
            fontWeight="extrabold"
            borderBottom="2px solid rgba(148, 115, 220, 0.5)" 
            pb={1}
            textAlign="center"
            noOfLines={2}
            title={proposal.name}
          >
            {proposal.name}
          </Text>
        </Box>
        
        <Flex justify="center" align="center" flex="1">
          {showDetermineWinner ? (
            <Button
              colorScheme="purple"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                getWinner(contractAddress, proposal.id);
              }}
              variant="outline"
              borderColor="rgba(148, 115, 220, 0.6)"
              _hover={{ bg: "rgba(148, 115, 220, 0.2)" }}
            >
              Determine Winner
            </Button>
          ) : (
            <VStack spacing={1}>
              <Badge colorScheme="purple" fontSize="xs" mb={1}>Time Remaining</Badge>
              <CountDown duration={calculateRemainingTime(proposal?.experationTimestamp)} />
            </VStack>
          )}
        </Flex>
        
        <VStack align="stretch" mt={1}>
          <Text fontWeight="bold" fontSize="xs" color="rgba(148, 115, 220, 0.9)">
            Voting Options:
          </Text>
          <HStack mb={1} spacing={2} flexWrap="wrap" justify="center">
            {proposal.options.map((option, index) => (
              <Badge 
                key={index} 
                colorScheme={index % 2 === 0 ? "purple" : "blue"} 
                variant="subtle"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
              >
                {option.name}
              </Badge>
            ))}
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default VoteCard; 