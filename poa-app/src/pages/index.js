import Head from "next/head";
import Link from "next/link";
import { Flex, Box, Button, Text, Image, HStack, Spacer, useColorModeValue } from "@chakra-ui/react";
import { TypeAnimation } from "react-type-animation";
import AutoPlayVideo1 from "@/components/AutoPlayVideo1";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to the desired route
    router.push("/landing");
  };


  return (
    <>
      <Head>
        <title>Poa - Perpetual Organization Architect</title>
        <meta name="description" content="Poa, the perpetual organization architect, helps you create and manage decentralized autonomous organizations (DAOs) with no coding required. Start building your community-driven organization today." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://poa.community" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://schema.org",
            "@type": "Organization",
            "name": "Poa",
            "url": "https://poa.community",
            "logo": "https://poa.community/images/poa_logo.png",
            "sameAs": [
              "https://twitter.com/PoaPerpetual",
            ],
            "description": "Poa is a no code DAO builder that makes it easy to create and join fully community owned censorship restiant organizations called Perpetual Organizations."
          })}
        </script>
      </Head>
      <Flex
        bg="white"
        direction="column"
        alignItems="center"
        justifyContent="top"
        h="200vh"
        p={6}
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="radial-gradient(circle, rgba(255, 255, 255, 255) 80%, rgba(154, 215, 255, .8) 115%)" 
        />
        {/* <Text fontSize={["70px", "83px", "99px"]} color="black.900" mt="2%">
          Poa
        </Text> */}
        <Image
          src="/images/poa_logo.png"
          alt="Poa Perpetual Organization Architect Logo"
          width={["100px", "130px", "190px"]}
          zIndex={1}
          
          mt={["6","12"]}
        />
        {/* <Text mb="0" mt="-8" fontSize={["12px", "14px", "16px"]} color="gray.600">
          pʌ oʊ ə
        </Text> */}
        <Text zIndex={1} mb={["6","12"]} mt="" fontSize={["7px", "9px", "11px"]} color="gray.600">
          Perpetual Organization Architect
        </Text>

  

        <Text
        ml="1%"
        mr="1%"
    fontWeight={"900"}
    fontSize={["16px","23px", "28px", "38px"]}
    transform={"scale(1)"}
    mt={["2","4"]}
    css={{
      background: "linear-gradient(90deg, #ff416c,  #f28500)",
      "-webkit-background-clip": "text",
      "-webkit-text-fill-color": "transparent",
      textShadow: "1px 1px 10px rgba(255, 255, 255, 0.5)",
    }}
  >
    Build Organizations Owned Fully by Your Community
  </Text>
  <Text  mt="2" zIndex={1} fontSize={["11px", "14px", "16px"]} fontWeight={"400"}>Create a custom system to manage tasks and make group decisions</Text>
                <Text mt={["4","10"]} zIndex={1} fontSize={["15px", "19px", "22px"]} fontWeight={"600"}>No Coding Required. No Middlemen. No Censorship.</Text>
        


        <HStack mt="2" spacing={8}>

        </HStack>
        
        {/* <TypeAnimation
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
        /> */}

      <Flex direction={["column", "column", "row"]} gap={12} mt={["6","14"]} zIndex={1}> 
      <Box
            _hover={{ transform: "scale(1.05)", transition: "transform 0.3s" }}
            onClick={() => router.push("/create")}
            cursor="pointer"
            maxW={["100%", "100%", "100%", "100%"]}
          >
            <HStack  spacing={[2,4]} bg="purple.200" borderRadius={"3xl"} p={["2","6"]}>
              <Image
                mr="4"
                src="/images/high_res_poa.png"
                alt="Poa Logo"
                width={[100,140,180,240]}
                height={[100,140,180,240]}
              />
              <Box width={["170px","230px","260px"]} borderRadius={"2xl"} bg="white">
              <Text
                p={["2","4"]}
                fontWeight="500"
                fontSize={["11px","12px", "14px", "18px"]}
                color="black.900"
              >
                Hi, I'm Poa, and I'll help you customize your own Perpetual Organization! Need inspiration or want to learn more?
              </Text>
              <Text p={["2","4"]} mt="-2"  fontSize={["11px", "14px", "18px"]}  color="black.900" fontWeight="800">Let's Chat. Click me to get started!</Text>
              </Box>
              
            </HStack>
          </Box>
          <Box >
              <HStack  spacing={4} bg="blue.200" borderRadius={"3xl"} p="6">\
              <Box
                height={"100%"}
                width={["160px","200px","240px"]}
                bg={useColorModeValue( "gray.800")}
                borderRadius="xl"
                p={[4,6]}
                textAlign="center"
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                transition="all 0.3s ease"
                onClick={handleClick}
                cursor="pointer"
              >
                <Text fontSize={["16px","22px","30px"]} fontWeight="bold" color={useColorModeValue( "lightgreen")}>
                  Explore
                </Text>
                <Text fontSize={["11px","13px","15px"]} fontWeight="bold" textColor={"white"}>
                  Discover and Join existing Perpetual Organizations
                </Text>
              </Box>


              <Box width={["190px","230px","260px"]} borderRadius={"2xl"} bg="white">

              <Text p="4" fontWeight="500" fontSize={["11px", "13px", "17px"]} color="black.900">
                What is a{" "}
                <Text as="span"
                fontWeight={"900"}
                 css={{
                  background: "linear-gradient(90deg, #ff416c,  #f28500)",
                  "-webkit-background-clip": "text",
                  "-webkit-text-fill-color": "transparent",
                  textShadow: "1px 1px 10px rgba(255, 255, 255, 0.5)",
                }}> 
                  Perpetual Organization
                </Text>
                
              </Text>

              <Text ml="4" mr="4" mb="4" color="black.900" fontSize={["11px", "13px", "15px"]} fontWeight="400">POs are Community-Owned, unstoppable organizations based on contribution and democracy, not investment.</Text>
              <Button ml="4" mb="4" mt="2" colorScheme="blue" variant="outline" _hover={{ transform: "scale(1.05)", transition: "transform 0.3s" }} onClick={() => router.push("/about")}>Learn More</Button>

              </Box>
              
            </HStack>
            
          </Box>
        </Flex>
          <AutoPlayVideo1 />
          


        {/* <Text fontWeight={"bold"} fontSize={["20px", "25px", "30px", "33px"]} color="black.900" mt="6%">
          What is a Perpetual Organization?
        </Text>
        <Text fontSize={["18px", "20px", "21px"]} color="black.900" mt="7" w={["95%", "85%", "7%", "555px"]} >
          Perpetual Organizations are fully decentralized, unstoppable, and community-owned organizations based on contribution and democracy, not investment.
        </Text> */}


      </Flex>
    </>
  );
}
