// pages/dashboard/index.js
import React from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";
import Layout from "../../components/Layout";
import AboutPreview from "@/components/Dashboard/AboutPreview";
import YourPerpetualOrganizations from "@/components/Dashboard/YourPerpetualOrganizations";
import PoaPreview from "@/components/Dashboard/PoaPreview";

const DashboardPage = () => {
  return (
    <Layout>
      <VStack spacing={6} w="full">
        {/* AboutPreview takes the upper half of the screen */}
        <Box w="full" h="50%">
          <AboutPreview />
        </Box>

        {/* Flex container for the lower half with two children */}
        <Flex w="full" h="50%" direction={{ base: "column", md: "row" }}>
          <Flex flex={1} p={3}>
            <YourPerpetualOrganizations />
          </Flex>
          <Flex flex={1} p={3}>
            <PoaPreview />
          </Flex>
        </Flex>
      </VStack>
    </Layout>
  );
};

export default DashboardPage;
