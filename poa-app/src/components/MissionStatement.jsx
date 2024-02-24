import React from "react";
import { Flex, Box, Button, Text } from "@chakra-ui/react";

const MissionStatement = () => {
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" p={4}>
      <p>Meet true decentralization.</p>

      <Button colorScheme="teal" variant="outline" mt={4}>
        Read our Mission
      </Button>
    </Flex>
  );
};

export default MissionStatement;
