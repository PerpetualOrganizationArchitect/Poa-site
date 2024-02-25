import React from "react";
import Navigation from "./Navigation";
import { Box, Flex, Image } from "@chakra-ui/react";

const Layout = ({ children, isArchitectPage }) => {
  return (
    <>
      {isArchitectPage ? (
        <Flex
          align="center"
          justify="space-between"
          wrap="wrap"
          padding="1rem"
          bg="transparent"
        >
          <Image
            src="/images/poa_logo.png"
            alt="Logo"
            width="54px"
            height="48px"
          />
        </Flex>
      ) : (
        <Box pt="4rem" p={4}>
          <Navigation />
        </Box>
      )}
      <Box p={4} minHeight={isArchitectPage ? "100vh" : "auto"}>
        {children}
      </Box>
      {!isArchitectPage && (
        <Box p={4}>
          © {new Date().getFullYear()} Perpetuate. All rights reserved.
        </Box>
      )}
    </>
  );
};

export default Layout;
