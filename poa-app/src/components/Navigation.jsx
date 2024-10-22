// src/components/Navigation.jsx
import React from "react";
import Link from "next/link";
import {
  Flex,
  Button,
  IconButton,
  Box,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Image from "next/image";

const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN;

const Navigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      bg="rgba(0, 0, 0, 0.03)"
      backdropFilter="blur(6px)"
      position="fixed"
      top={0}
      w="100%"
      shadow="md"
      zIndex="banner"
    >
      {/* Logo or Brand Name */}
      <Box>
        <Link href="/" passHref>
          <Image src="/images/poa_logo.png" alt="Logo" width={50} height={50} />
        </Link>
      </Box>

      {/* Hamburger Menu Icon */}
      <Box display={{ base: "block", md: "none" }}>
        <IconButton
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="outline"
          aria-label="Toggle Navigation"
          onClick={isOpen ? onClose : onOpen}
        />
      </Box>

      {/* Navigation Links */}
      <Box
        display={{ base: isOpen ? "block" : "none", md: "flex" }}
        flexBasis={{ base: "100%", md: "auto" }}
      >
        <Stack
          spacing={4}
          align="center"
          justify={["center", "flex-end"]}
          direction={["column", "row"]}
          pt={[4, 0]}
        >
          <Link href="/about" passHref>
            <Button variant="outline" p={4} colorScheme="black">
              About
            </Button>
          </Link>
          <Link href="/docs" passHref>
            <Button variant="outline" p={4} colorScheme="black">
              Docs
            </Button>
          </Link>
          <Link href="/browser" passHref>
            <Button variant="outline" p={4} colorScheme="black">
              Browser
            </Button>
          </Link>
          <Link href="/create" passHref>
            <Button variant="outline" p={4} colorScheme="black">
              Architect
            </Button>
          </Link>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Navigation;
