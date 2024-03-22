import React from "react";
import { Box, Flex, Image, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import {useRouter} from "next/router";


const Navbar = () => {
  const router = useRouter();
  const { userDAO } = router.query;
  return (
    <Box bg="black" p={4}>
      <Flex
        alignItems="center"
        h="100%"
        maxH="62px"
        maxW={"100%"}
        justifyContent="space-between"
      >
        <Box h="100%" w="12%" mr={{ base: "2", md: "4" }}>
          <Link as={NextLink} href={`/home/?userDAO=${userDAO}`} passHref>
            <Image
              src="/images/poa_character.png"
              alt="Your Logo"
              w="45%"
            />
          </Link>
        </Box>
        <Flex
          justifyContent="space-between"
          flexGrow={1}
          ml={0}
          mr={4}
          alignItems="center"
        >
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
          <Link as={NextLink} href={`/leaderboard/?userDAO=${userDAO}`} color="white" fontWeight="extrabold" fontSize="xl" mx={"2%"}>
            Leaderboard
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

            <Link
              as={NextLink}
              href={`/user/?userDAO=${userDAO}`}
              color="white"
              fontWeight="extrabold"
              fontSize="xl"
              mx={"2%"}
            >
              User
            </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
