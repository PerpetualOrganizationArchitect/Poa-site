import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import * as React from "react";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";

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
        p={10}
      >
        <Text fontSize="70" color="black.900">
          Poa.
        </Text>
        <TypeAnimation
          sequence={[
            // Same substring at the start will only be typed once, initially
            "where community is decentralized.",
            1000,
            "where community is the future.",
            1000,
            "where community belongs to the community.",
            1000,
            "where community is fully yours, forever.",
            1000,
          ]}
          speed={28}
          style={{ fontSize: "2em" }}
          repeat={0}
        />

        <Link href="/dashboard" passHref>
          {" "}
          {/* Use Link to navigate */}
          <Button size="lg" colorScheme="blue" variant="outline" mt={4}>
            Explore Poa
          </Button>
        </Link>
      </Flex>
    </>
  );
}
