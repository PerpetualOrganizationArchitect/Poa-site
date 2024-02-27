import React from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";
import Layout from "../../components/Layout";
import AboutPreview from "@/components/Dashboard/AboutPreview";
import YourPerpetualOrganizations from "@/components/Dashboard/YourPerpetualOrganizations";
import PoaPreview from "@/components/Dashboard/PoaPreview";

const DashboardPage = () => {
  return (
    <Layout>
      <Box pt="4rem" w="full" overflowY="auto">
        <VStack spacing={6} w="full" h="full" justify="center">
          {/* AboutPreview is centered horizontally on the upper half of the page */}
          <Box w="full" flex="1" p={3}>
            <AboutPreview />
          </Box>

          {/* Flex container for the lower half with two children side by side */}
          <Flex
            w="full"
            flex="1"
            direction={{ base: "column", md: "row" }}
            p={3}
          >
            {/* YourPerpetualOrganizations justified to the left half of the bottom half of the screen */}
            <Box w={{ base: "full", md: "50%" }} h="full" p={3}>
              <YourPerpetualOrganizations />
            </Box>

            {/* PoaPreview mirrored on the right, bottom half of the screen */}
            <Box w={{ base: "full", md: "50%" }} h="full" p={3}>
              <PoaPreview />
            </Box>
          </Flex>
        </VStack>
      </Box>
    </Layout>
  );
};

export default DashboardPage;
