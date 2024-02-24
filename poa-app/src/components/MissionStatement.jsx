import React from "react";
import { Flex, Box, Button, Text } from "@chakra-ui/react";

const MissionStatement = () => {
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" p={4}>
      <p>
        Our mission is to simplify the creation of and participation in fully
        community owned organizations by leveraging AI for onboarding and
        decentralized technologies for the infrastructure. Full decentralization
        is our priority. We want to ensure that the created Perpetual
        Organizations can’t be stopped or changed by anyone but the community
        members.
      </p>

      <Button colorScheme="teal" variant="outline" mt={4}>
        Learn More
      </Button>
    </Flex>
  );
};

export default MissionStatement;
