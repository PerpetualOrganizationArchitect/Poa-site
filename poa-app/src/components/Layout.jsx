// src/components/Layout.jsx
import React from "react";
import Navigation from "./Navigation"; // Import your Navigation component
import { Box } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <>
     <Navigation />
      <Box as="main" p={4}>
        {children}
      </Box>
      <Box as="footer" p={4}>
        © {new Date().getFullYear()} Poa. All rights reserved.
      </Box>
    </>
  );
};

export default Layout;
