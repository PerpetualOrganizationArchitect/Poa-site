import React from "react";
import { Flex, Heading, Spacer, Text, Box, Icon, useBreakpointValue } from "@chakra-ui/react";
import { CheckCircleIcon, LockIcon } from "@chakra-ui/icons";

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

const HeadingVote = ({ selectedTab, PTVoteType }) => {
  // Use responsive sizing based on breakpoints
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const iconSize = useBreakpointValue({ base: 5, md: 6 });
  const textSize = useBreakpointValue({ base: "md", md: "lg" });
  const paddingY = useBreakpointValue({ base: 1, md: 2 });

  const getIcon = () => {
    if (selectedTab === 0) {
      return CheckCircleIcon;
    } else if (PTVoteType === "Hybrid") {
      return LockIcon;
    } else {
      return CheckCircleIcon;
    }
  };

  const getTagline = () => {
    if (selectedTab === 0) {
      return "Equal Vote for All";
    } else if (PTVoteType === "Hybrid") {
      return "Combination of Direct and Weighted Votes";
    } else {
      return "Participation Based Voting";
    }
  };

  return (
    <Flex
      align="center"
      mb={{ base: 4, md: 6 }}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      borderRadius="3xl"
      boxShadow="lg"
      p={{ base: "3%", md: "2%" }}
      w="100%"
      maxW="1440px"
      mx="auto"
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

      <Flex direction="column" align="center" py={paddingY}>
        <Flex align="center" mb={1}>
          <Icon as={getIcon()} color="purple.400" mr={2} boxSize={iconSize} />
          <Heading 
            color="ghostwhite" 
            size={headingSize} 
            bgGradient="linear(to-r, purple.400, blue.300)" 
            bgClip="text"
            textAlign="center"
          >
            {selectedTab === 0 
              ? "Democracy Voting" 
              : PTVoteType === "Hybrid" 
              ? "Hybrid Voting" 
              : "Participation Voting"}
          </Heading>
        </Flex>

        <Text 
          mt={{ base: 1, md: 2 }} 
          color="ghostwhite" 
          fontSize={textSize} 
          fontWeight="medium" 
          textAlign="center"
        >
          {getTagline()}
        </Text>
      </Flex>

      <Spacer />
    </Flex>
  );
};

export default HeadingVote;
