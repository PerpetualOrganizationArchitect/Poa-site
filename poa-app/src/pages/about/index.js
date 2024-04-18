// src/pages/about/index.js
import React from "react";
import {
  Box,
  Flex,
  Button,
  VStack,
  HStack,
  Text,
  Image,
} from "@chakra-ui/react";
import Layout from "../../components/Layout"; // If you have a Layout component
import Link from "next/link";

// import { useMetaMask } from "../../components/Metamask";
const AboutPage = () => {
  //const { connectWallet, accounts } = useMetaMask();

  return (
    <Layout>
      <VStack
        spacing={8}
        align="stretch"
        p={8}
        alignItems={"center"}
        pt="4.5rem"
        w="full"
        overflowY="auto"
        pr="1.5rem"
        pl="1.5rem"
      >
        {/* {accounts.length > 0 ? (
          <Text>Connected as {accounts[0]}</Text>
        ) : (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        )} */}
        <Text fontSize="5xl" fontWeight="bold" color="grey.600" pt="2rem">
          What is Poa?
        </Text>
        <Text fontSize={"2xl"} textAlign={"center"} pr="15vh" pl="15vh">
          The Perpetual Organization Architect, or Poa, is a friendly chat bot
          that guides you through a no-code process of building a perpetual
          organization.
        </Text>
        <Text fontSize="4xl" fontWeight="bold" color="grey.600">
          Purpose
        </Text>
        <Text
          fontSize={"xl"}
          textAlign={"center"}
          pr="15vh"
          pl="15vh"
          color="grey.600"
        >
          Poa aims to simplify the{" "}
          <Text as="span" fontWeight="bold">
            creation
          </Text>{" "}
          of and{" "}
          <Text as="span" fontWeight="bold">
            participation
          </Text>{" "}
          in fully community-owned organizations by leveraging{" "}
          <Text as="span" fontWeight="bold">
            AI
          </Text>{" "}
          for onboarding and{" "}
          <Text as="span" fontWeight="bold">
            decentralized technologies
          </Text>{" "}
          for the infrastructure.{" "}
        </Text>
        <Text
          textAlign={"center"}
          pr="15vh"
          pl="15vh"
          fontSize="xl"
          fontWeight="bold"
          color="grey.600"
        >
          Full decentralization is our priority. We want to ensure that the
          created Perpetual Organizations can’t be stopped or changed by anyone
          but the community members.{" "}
        </Text>
        <Box
          bgColor="white"
          p="8"
          borderRadius="xl"
          opacity="0.7"
          textAlign="center"
        >
          <HStack pt="5vh" spacing={4} align="center">
            {" "}
            <Text fontSize="3xl" fontWeight="semibold">
              Our community
            </Text>
            <VStack align="center">
              <Image
                src="/images/l_to_r_arrow.png"
                alt="Descriptive Alt Text"
                width="90px"
                objectFit="contain"
              />
              <Text fontSize="xs" fontWeight="semibold">
                is building
              </Text>
            </VStack>
            <Text fontSize="3xl" fontWeight="semibold">
              Poa
            </Text>
          </HStack>
          <Text fontSize="md" m="5" fontWeight="bold" color="grey.600">
            so that
          </Text>
          <HStack pb="5vh" spacing={4} align="center">
            {" "}
            <Text fontSize="3xl" fontWeight="semibold">
              Poa
            </Text>
            <VStack align="center">
              <Image
                src="/images/l_to_r_arrow.png"
                alt="Descriptive Alt Text"
                width="90px"
                objectFit="contain"
              />
              <Text fontSize="xs" fontWeight="semibold">
                can build
              </Text>
            </VStack>
            <Text fontSize="3xl" fontWeight="semibold">
              Communities
            </Text>
          </HStack>
        </Box>
        <Text fontSize="lg" fontWeight="bold" color="grey.600">
          Join our community
        </Text>
        <HStack spacing={4} align="center">
          {" "}
          <Box width="20">
            <Link href="https://discord.gg/kKDKgetdNx" passHref>
              <Image src="/images/discord.png" alt="Descriptive Alt Text" />
            </Link>
          </Box>
          <Box width="20">
            <Link href="https://discord.gg/kKDKgetdNx" passHref>
              <Image src="/images/x.png" alt="Descriptive Alt Text" />
            </Link>
          </Box>
        </HStack>
      </VStack>
    </Layout>
  );
};

export default AboutPage;

// The Perpetual Organization Architect also known as Poa will be a
//           friendly chat bot that guides you through the process of building a no
//           code perpetual organization. It will explain what a perpetual
//           organization is, give a few examples, and expand on that info if you
//           request. Next, Poa will ask you what your idea for your organization
//           is and based off your response will walk you through and give specific
//           suggestion for picking a UI template, voting system, reward system,
//           and other features. At the end, it will display your selected features
//           and then deploy all necessary smart contracts and subgraph
//           information. There will eventually be a site to browse all the
//           perpetual organizations and open tasks so you can do work for an
//           organization without being a member. The last component is the
//           Perpetual Fund which will be a community run startup fund for
//           Perpetual Organizations.
