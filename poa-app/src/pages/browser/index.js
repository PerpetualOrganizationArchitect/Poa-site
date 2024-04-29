import React from "react";
import { useEffect } from "react";
import Layout from "../../components/Layout";


import { useDashboardContext } from "../../context/dashboardContext";
import Link from "next/link";
import { Flex, VStack, Box, Text } from "@chakra-ui/react";

const BrowserPage = () => {
  const { perpetualOrganizations, setDashboardLoaded } = useDashboardContext();

  useEffect(() => {
    if(perpetualOrganizations.length === 0) {
      return
    }
    setDashboardLoaded(true);
  }, [perpetualOrganizations]);

  return (
    <>
    <Layout>
    </Layout>
    <>
    <Flex
  direction="column"
  align="center"
  h="100vh"
  pt="3rem"
>
  <Text textAlign="center" fontSize="2xl" fontWeight="bold" color="gray.800">
    Browse and Join a Perpetual Organization
  </Text>
  <Flex
    wrap="wrap"
    justify="center"
    align="center"
    maxW="66%"
    mt="2rem"
  >
    {perpetualOrganizations.map((po) => (
      <Link href={`/home?userDAO=${po.id}`} key={po.id}>
        <Box
          border="1px"
          borderRadius="md"
          m="1rem"
          p="1rem"
          boxShadow="base"
          _hover={{ transform: "scale(1.05)", transition: "transform 0.3s", boxShadow: "lg" }}
          w="220px" // Adjust this width so that 4 boxes fit in the maxW of Flex
        >
          <VStack>
            <Text fontSize="24px">{po.id}</Text>
            <img width="100px" src="/images/poa_logo.png" alt={po.id} />
          </VStack>
        </Box>
      </Link>
    ))}
  </Flex>
</Flex>


      </>
      </>
  );
};

export default BrowserPage;