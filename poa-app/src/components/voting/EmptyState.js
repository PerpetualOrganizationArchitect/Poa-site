import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

const glassLayerStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(20px)",
  backgroundColor: "rgba(0, 0, 0, .8)",
};

const EmptyState = ({ text }) => {
  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      borderRadius="3xl"
      boxShadow="lg"
      display="flex"
      w="100%"
      maxWidth="100%"
      bg="transparent"
      position="relative"
      p={4}
      zIndex={1}
      color="rgba(333, 333, 333, 1)"
    >
      <div className="glass" style={glassLayerStyle} />
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Text
          mb="2"
          fontSize="2xl"
          fontWeight="extrabold"
          pl={12}
          pr={12}
          pt={14}
          pb={14}
        >
          {text}
        </Text>
      </Flex>
    </Box>
  );
};

export default EmptyState; 