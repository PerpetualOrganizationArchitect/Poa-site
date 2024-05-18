import React from "react";
import { Flex, Heading, Spacer, Text } from "@chakra-ui/react";

const glassLayerStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(20px)",
  backgroundColor: "rgba(0, 0, 0, .6)",
};

const HeadingVote = ({ selectedTab }) => {
  return (
    <Flex
      align="center"
      mb={6}
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

      <Heading color="ghostwhite" size="2xl">
        {selectedTab === 0 ? "Democracy Voting" : "Hybrid Voting"}
      </Heading>

      <Text mt={2} color="ghostwhite" fontSize="md" fontWeight="bold">
        {selectedTab === 0
          ? "Equal Vote for All"
          : "Participation Based Voting"}
      </Text>

      <Spacer />
    </Flex>
  );
};

export default HeadingVote;
