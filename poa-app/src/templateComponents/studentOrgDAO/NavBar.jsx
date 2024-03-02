import React from "react";
import { Box, Flex, Image, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import {useRouter} from "next/router";

//import { useWeb3Context } from '../contexts/Web3Context';

const Navbar = () => {
  const router = useRouter();
  const { userDAO } = router.query;
  // const { isConnected } = useWeb3Context();
  return (
    <Box bg="black" p={4}>
      <Flex
        alignItems="center"
        h="100%"
        maxH="62px"
        maxW={"100%"}
        justifyContent="space-between"
      >
        <Box h="100%" w="12%" mr={{ base: "4", md: "8" }}>
          <Link as={NextLink} href={`/${userDAO}/home`} passHref>
            <Image
              src="/images/poa_character.png"
              alt="Your Logo"
              w="auto"
              maxW="65%"
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
            href={`/${userDAO}/tasks`}
            color="white"
            fontWeight="extrabold"
            fontSize="xl"
            mx={"2%"}
          >
            Tasks
          </Link>
          {/* <Link as={NextLink} href="/Leaderboard" color="white" fontWeight="extrabold" fontSize="xl" mx={"2%"}>
            Leaderboard
          </Link> */}
          <Link
            as={NextLink}
            href={`/${userDAO}/voting`}
            color="white"
            fontWeight="extrabold"
            fontSize="xl"
            mx={"2%"}
          >
            Voting
          </Link>
          <Box>
            <Text
              fontSize="xs"
              ml={4}
              mb={3}
              mt={-8}
              //   color={isConnected ? "green.500" : "red.500"}
            >
              {/* {isConnected ? "Connected" : "Not Connected"} */}
            </Text>
            <Link
              as={NextLink}
              href={`/${userDAO}/user`}
              color="white"
              fontWeight="extrabold"
              fontSize="xl"
              mx={"2%"}
            >
              User
            </Link>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
