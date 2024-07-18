import React from "react";
import { Box, Flex, Image, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import LoginButton from "@/components/LoginButton";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
  const router = useRouter();
  const { userDAO } = router.query;
  return (
    <Box bg="black" p={2.5} >
      <Flex
        alignItems="center"
        h="60px"
        maxW="100%"
        justifyContent="space-between"
      >
        <Box h="100%" w="12%" mr={{ base: "2", md: "4" }}>
          <Link as={NextLink} href={`/home/?userDAO=${userDAO}`} passHref>
            <Image
              src="/images/poa_character.png"
              alt="Your Logo"
              height="107%"
              width="auto"
              objectFit="contain"
            />
          </Link>
        </Box>
        
        <Flex
          justifyContent="space-between"
          flexGrow={1}
          ml={4}
          mr={4}
          alignItems="center"
        >
          <Link as={NextLink} href={`/dashboard/?userDAO=${userDAO}`} color="white" fontWeight="extrabold" fontSize="xl" mx={"2%"}>
            Dashboard
          </Link>
          <Link
            as={NextLink}
            href={`/tasks/?userDAO=${userDAO}`}
            color="white"
            fontWeight="extrabold"
            fontSize="xl"
            mx={"2%"}
          >
            Tasks
          </Link>
          <Link
            as={NextLink}
            href={`/voting/?userDAO=${userDAO}`}
            color="white"
            fontWeight="extrabold"
            fontSize="xl"
            mx={"2%"}
          >
            Voting
          </Link>
          <LoginButton />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
