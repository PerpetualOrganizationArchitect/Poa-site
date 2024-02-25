import React from "react";
import Navigation from "./Navigation";
import { Box, Flex, Image, IconButton } from "@chakra-ui/react";
import Link from "next/link";

const Layout = ({ children, isArchitectPage }) => {
  return (
    <>
      {isArchitectPage ? (
        <Flex padding="1rem" position="fixed" top={0}>
          <Link href="/dashboard" passHref>
            <IconButton
              icon={
                <Image
                  src="/images/poa_logo.png"
                  alt="Home"
                  width="auto"
                  height="8"
                />
              }
              variant="ghost"
              aria-label="Home"
            />
          </Link>
        </Flex>
      ) : (
        <Box>
          <Navigation />
        </Box>
      )}
      <Box as="main" pt="5rem" minHeight={isArchitectPage ? "100vh" : "auto"}>
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
