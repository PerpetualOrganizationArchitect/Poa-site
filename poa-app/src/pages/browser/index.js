import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useprofileHubContext } from "../../context/profileHubContext";
import { useIPFScontext } from "@/context/ipfsContext";
import Link from "next/link";
import { Flex, VStack, Box, Text, Image } from "@chakra-ui/react";

const BrowserPage = () => {
  const { perpetualOrganizations, setprofileHubLoaded } = useprofileHubContext();
  const { fetchImageFromIpfs } = useIPFScontext();
  const [images, setImages] = useState({});

  useEffect(() => {
    console.log("dash");
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
    <>
      <Layout />
      <Flex
        direction="column"
        align="center"
        h="100vh"
        pt="3rem"
      >
        <Text mt="70px" textAlign="center" fontSize="2xl" fontWeight="bold" color="gray.800">
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
                w="220px" 
              >
                <VStack>
                  <Text fontWeight={"bold"} fontSize="24px">{po.id}</Text>
                  <Text fontSize="16px">{po.aboutInfo?.description}</Text>
                  <Image 
                    width="150px" 
                    src={images[po.id] || '/images/poa_logo.png'} 
                    alt={po.id} 
                  />
                </VStack>
              </Box>
            </Link>
          ))}
        </Flex>
      </Flex>
    </>
  );
};

export default BrowserPage;
