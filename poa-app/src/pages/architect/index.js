// src/pages/about/index.js
import React from "react";
import Layout from "../../components/Layout";
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ArrowUpIcon } from "@chakra-ui/icons";

const ArchitectPage = () => {
  return (
    <Layout>
      <p>architect page</p>
      <InputGroup>
        <Input pr="4.5rem" placeholder="Type here..." borderColor="blue.900" />
        <InputRightElement>
          <IconButton
            icon={<ArrowUpIcon color="teal" />}
            variant="ghost"
            aria-label="Home"
          />
        </InputRightElement>
      </InputGroup>
    </Layout>
  );
};

export default ArchitectPage;
