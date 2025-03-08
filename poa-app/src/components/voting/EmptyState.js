import React from "react";
import { Box, Flex, Text, Icon, useBreakpointValue } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";

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

const EmptyState = ({ text }) => {
  // Use responsive sizing based on breakpoints
  const textSize = useBreakpointValue({ base: "xl", md: "2xl" });
  const paddingX = useBreakpointValue({ base: 6, md: 12 });
  const paddingY = useBreakpointValue({ base: 8, md: 14 });
  const iconSize = useBreakpointValue({ base: 6, md: 8 });

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
      p={{ base: 3, md: 4 }}
      zIndex={1}
      color="rgba(333, 333, 333, 1)"
      transition="all 0.3s ease"
      _hover={{ 
        transform: "translateY(-3px)",
        boxShadow: "xl",
        "& .glass": {
          boxShadow: "inset 0 0 20px rgba(148, 115, 220, 0.25)",
          border: "1px solid rgba(148, 115, 220, 0.3)",
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
      
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={paddingY}
        px={paddingX}
        textAlign="center"
        width="100%"
      >
        <Icon 
          as={InfoIcon} 
          color="purple.400" 
          boxSize={iconSize} 
          mb={3}
          opacity={0.8} 
        />
        
        <Text
          fontSize={textSize}
          fontWeight="bold"
          bgGradient="linear(to-r, purple.400, blue.300)"
          bgClip="text"
        >
          {text}
        </Text>
      </Flex>
    </Box>
  );
};

export default EmptyState; 