import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import * as React from "react";
import Link from "next/link";

import { Flex, Box, Button, Text } from "@chakra-ui/react";
import MissionStatement from "@/components/MissionStatement";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Poa</title>
        <meta name="description" content="Perpetual Organization Architect" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        h="100vh" // Set the height of the Flex container to 100% of the viewport height
        p={4}
      >
        <Text fontSize="55" color="black.900">
          Welcome to Poa.
        </Text>
        <MissionStatement />
        <Link href="/dashboard" passHref>
          {" "}
          {/* Use Link to navigate */}
          <Button size="lg" colorScheme="teal" variant="solid" mt={4}>
            Get Started
          </Button>
        </Link>
      </Flex>
    </>
  );
}
