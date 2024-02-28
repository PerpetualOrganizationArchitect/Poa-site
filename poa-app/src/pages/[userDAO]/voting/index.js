// pages/[userDAO]/voting/index.js
import React from "react";
import { useRouter } from "next/router";
import { Box, Text } from "@chakra-ui/react";

const Voting = () => {
  const router = useRouter();
  const { userDAO } = router.query;

  return (
    <Box p={4}>
      <Text fontSize="xl">Voting for {userDAO}</Text>
      {/* Placeholder content */}
      <Text>This is the Voting page for the organization {userDAO}.</Text>
    </Box>
  );
};

export default Voting;
