// src/components/Navigation.jsx
import React from "react";
import Link from "next/link";
import { Flex, Button } from "@chakra-ui/react";

const Navigation = () => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg="pink.100"
      opacity="0.5"
    >
      {/* Wrap each Link in a Button component */}
      <Link href="/dashboard" passHref>
        <Button variant="ghost" p={4}>
          Home
        </Button>
      </Link>
      <Link href="/about" passHref>
        <Button variant="ghost" p={4}>
          About
        </Button>
      </Link>
      <Link href="/architect" passHref>
        <Button variant="ghost" p={4}>
          Architect
        </Button>
      </Link>

      <Link href="/browser" passHref>
        <Button variant="ghost" p={4}>
          Browser
        </Button>
      </Link>
    </Flex>
  );
};

export default Navigation;
