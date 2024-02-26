import React from "react";
import Layout from "../../components/Layout";
import ArchitectInput from "@/components/Architect/ArchitectInput";
import { Box } from "@chakra-ui/react";

const ArchitectPage = () => {
  return (
    <Layout isArchitectPage>
      <Box position="fixed" bottom="0" width="full" p={4} paddingRight={10}>
        <ArchitectInput />
      </Box>
     
    </Layout>
  );
};

export default ArchitectPage;
