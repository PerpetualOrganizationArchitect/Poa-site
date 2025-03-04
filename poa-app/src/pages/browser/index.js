import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useprofileHubContext } from "../../context/profileHubContext";
import { useIPFScontext } from "@/context/ipfsContext";
import Link from "next/link";
import { Flex, VStack, Box, Text, Image, Heading, Grid, GridItem } from "@chakra-ui/react";

const BrowserPage = () => {
  const { perpetualOrganizations, setprofileHubLoaded } = useprofileHubContext();
  const { fetchImageFromIpfs } = useIPFScontext();
  const [images, setImages] = useState({});

  useEffect(() => {
    if (perpetualOrganizations.length === 0) {
      setprofileHubLoaded(true);
    } else {
      perpetualOrganizations.forEach(async (po) => {
        if (po.logoHash) {
          const imageUrl = await fetchImageFromIpfs(po.logoHash);
          setImages((prevImages) => ({ ...prevImages, [po.id]: imageUrl }));
        }
      });
    }
  }, [perpetualOrganizations, fetchImageFromIpfs]);

  return (
    <Layout>
      <Flex
        direction="column"
        align="center"
        minH="100vh"
      >
        {/* Hero Section */}
        <Box
          w="100%"
          bgSize="cover"
          bgPosition="center"
          py="30px"
          textAlign="center"
        >
          <Heading as="h1" size={["md","2xl"]} fontWeight="bold">
            Browse and Join a Perpetual Organization
          </Heading>
          <Text mt="4" ml="2" mr="2" fontSize={["xs","xl"]}>
            Discover communities that share your interests and passions
          </Text>
        </Box>
        {/* Cards Grid */}
        <Grid
          templateColumns="repeat(auto-fit, minmax(250px, 1fr))"
          gap={6}
          maxW="80%"
          px="2rem"
        >
          {perpetualOrganizations.map((po) => (
            <GridItem key={po.id}>
              <Link href={`/home?userDAO=${po.id}`}>
                <Box
                  bg="rgba(0, 0, 0, 0.73)"
                  backdropFilter="blur(10px)"
                  borderRadius="lg"
                  p="1.5rem"
                  boxShadow="lg"
                  _hover={{
                    transform: "scale(1.05)",
                    transition: "transform 0.3s",
                    boxShadow: "xl",
                  }}
                  textAlign="center"
                >
                  <VStack spacing="1rem">
                    <Image
                      width={["55%", "45%"]}
                      height="auto"
                      src={images[po.id] || '/images/poa_logo.png'}
                      alt={po.id}
                      borderRadius="xl"
                      bg="white"
                      boxShadow="md"
                    />
                    <Text fontWeight="700" fontSize="21px" color="white">
                      {po.id}
                    </Text>
                    {po.aboutInfo?.description && (
                      <Text fontWeight={"500"} fontSize="16px" color="gray.100">
                        {po.aboutInfo.description}
                      </Text>
                    )}
                    {po.totalMembers && (
                      <Text fontSize="14px" color="gray.200">
                        {po.totalMembers} Members
                      </Text>
                    )}
                  </VStack>
                </Box>
              </Link>
            </GridItem>
          ))}
        </Grid>
      </Flex>
    </Layout>
  );
};

export default BrowserPage;
