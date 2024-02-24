import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import About from "@/components/About";
import { Box, Button, Text } from "@chakra-ui/react";

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
      <Box p={4}>
        <Text fontSize="xl" color="gray.600">
          Welcome to Poa.
        </Text>
        <Button colorScheme="teal" variant="outline">
          Button
        </Button>
      </Box>
      <About />
    </>
  );
}
