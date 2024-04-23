import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import * as React from "react";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";

import { Flex, Box, Button, Text } from "@chakra-ui/react";
import MissionStatement from "@/components/MissionStatement";

import AutoPlayVideo from '@/components/AutoplayVideo';


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
        h="200vh" 
        p={7}
        
      >
        <Text fontSize="99" color="black.900" mt={"7%"}>
          Poa
        </Text>
        <Text mb="2" mt="-6" fontSize="18px" color="gray.600">
        pʌ oʊ ə
      </Text>
        <Text mb="8" fontSize="17" color="black.900" >
          Perpetual Organization Architect
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
          speed={33}
          style={{ fontSize: "2.5em" }}
          repeat={0}
        />

        <Link href="/landing" passHref>
          {" "}
          {/* Use Link to navigate */}
          <Button size={"lg"}  colorScheme="blue" variant="outline" mt={8}>
            Explore Poa
          </Button>
        </Link>
        <AutoPlayVideo />

        <Text fontWeight={"bold"} fontSize="33" color="black.900" mt={"6%"}>
          What is a Perpetual Organization?
        </Text>
        <Text fontSize="21" color="black.900" mt="7" mb="" w="555px">
        Perpetual Organizations are fully decentralized, unstoppable, and community-owned Organizations based on contribution and democracy not investment. The community vote controls every aspect of the organization from the code to the treasury with no reliance on centralized authorities.
        </Text>
        <Link href="/about" passHref>
        <Button size={"lg"} colorScheme="blue" variant="outline" mt={8}>
          Learn More
        </Button>
        </Link>
      </Flex>
      <Box justifyContent="center" alignItems={"center"}>

      </Box>


    </>
  );
}
