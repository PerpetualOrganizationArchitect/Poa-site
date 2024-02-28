// pages/[userDAO]/tasks/index.js
import React from "react";
import { useRouter } from "next/router";
import { Box, Text } from "@chakra-ui/react";

const Tasks = () => {
  const router = useRouter();
  const { userDAO } = router.query;

  return (
    <Box p={4}>
      <Text fontSize="xl">Tasks for {userDAO}</Text>
      {/* Placeholder content */}
      <Text>This is the Tasks page for the organization {userDAO}.</Text>
    </Box>
  );
};

export default Tasks;
