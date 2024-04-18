import React from "react";
import Layout from "../../components/Layout";
import { Box, Text } from "@chakra-ui/react";

const BrowserPage = () => {
  return (
    <Layout>
      <Box pt="4.5rem" w="full" overflowY="auto" textAlign={"center"}>
        <Text m="20" fontWeight="bold" fontSize={"xl"}>
          Public perpetual organizations will appear here.{" "}
        </Text>
      </Box>
    </Layout>
  );
};

export default BrowserPage;
