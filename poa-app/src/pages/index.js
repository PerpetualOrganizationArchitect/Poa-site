import Head from "next/head";
import Link from "next/link";
import { Flex, Box, Button, Text } from "@chakra-ui/react";
import { TypeAnimation } from "react-type-animation";
import AutoPlayVideo1 from "@/components/AutoPlayVideo1";

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
        <Text fontSize={["77px", "88px", "99px"]} color="black.900" mt="7%">
          Poa
        </Text>
        <Text mb="2" mt="-6" fontSize={["14px", "16px", "18px"]} color="gray.600">
          pʌ oʊ ə
        </Text>
        <Text mb="8" fontSize={["13px", "15px", "17px"]} color="black.900">
          Perpetual Organization Architect
        </Text>

        <TypeAnimation
          sequence={[
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
          style={{ fontSize: "2em" }}
          repeat={0}
        />

        <Link href="/landing" passHref>
          <Button size={"lg"} colorScheme="blue" variant="outline" mt={8}>
            Explore Poa
          </Button>
        </Link>

        <AutoPlayVideo1 />

        <Text fontSize={["20px", "25px", "30px", "33px"]} color="black.900" mt="6%">
          What is a Perpetual Organization?
        </Text>
        <Text fontSize={["18px", "20px", "21px"]} color="black.900" mt="7" w={["95%", "85%", "7%", "555px"]} >
          Perpetual Organizations are fully decentralized, unstoppable, and community-owned organizations based on contribution and democracy, not investment.
        </Text>

        <Link href="/about" passHref>
          <Button size={"lg"} colorScheme="blue" variant="outline" mt={8}>
            Learn More
          </Button>
        </Link>
      </Flex>
    </>
  );
}
