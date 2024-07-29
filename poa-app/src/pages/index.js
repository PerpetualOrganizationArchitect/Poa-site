import Head from "next/head";
import Link from "next/link";
import { Flex, Box, Button, Text, Image, VStack, HStack, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import AutoPlayVideo1 from "@/components/AutoPlayVideo1";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/browser");
  };

  return (
    <>
      <Head>
        <title>Poa - Perpetual Organization Architect</title>
        <meta name="description" content="Poa, the Perpetual Organization Architect, helps you create and manage worker-owned DAOs with no coding required. Start building your community-driven organization today with Poa." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://poa.community" />
        <meta property="og:title" content="Poa - Perpetual Organization Architect" />
        <meta property="og:description" content="Poa helps you create and manage fully worker-owned DAOs with no coding required. Start building your community-driven organization today with Poa." />
        <meta property="og:url" content="https://poa.community" />
        <meta property="og:image" content="https://poa.community/images/high_res_poa.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Poa - Perpetual Organization Architect" />
        <meta name="twitter:description" content="Poa helps you create and manage fully worker-owned DAOs with no coding required. Start building your community-driven organization today with Poa." />
        <meta name="twitter:image" content="https://poa.community/images/high_res_poa.png" />
        <script type="application/ld+json">
          {`
          {
            "@context": "http://schema.org",
            "@type": "Organization",
            "name": "Poa",
            "url": "https://poa.community",
            "logo": "https://poa.community/images/high_res_poa.png",
            "sameAs": ["https://twitter.com/PoaPerpetual"],
            "description": "Poa is a no code DAO builder that makes it easy to create and join fully community owned censorship resistant organizations called Perpetual Organizations. Poa leverages web3 tech to keep the Perpetual Organizations fully community owned and operated.",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://poa.community"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Docs",
                  "item": "https://poa.community/docs"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "AlphaV1",
                  "item": "https://poa.community/docs/AlphaV1"
                }
              ]
            }
          }
          `}
        </script>
      </Head>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="top"
        minH="100vh"
        p={6}
      >
        <Box
          position="absolute"
          top={["-12", "0"]}
          left="0"
          right="0"
          bottom="0"
          bg="radial-gradient(circle, rgba(255, 255, 255, 10) 80%, rgba(154, 215, 255, 0.8) 115%)"
        />
        <Image
          src="/images/poa_logo.png"
          alt="Poa Perpetual Organization Architect Logo"
          width={["110px", "130px", "180px"]}
          mt={["0", "2", "4"]}
          zIndex={1}
        />
        <Text zIndex={1} mb={["2", "4", "6"]} fontSize={["8px", "12px", "14px"]} color="gray.600">
          Perpetual Organization Architect
        </Text>
        <Text
          zIndex={3}
          fontWeight="1000"
          fontSize={["25px", "27px", "31px", "39px"]}
          textAlign="center"
          mt={["4", "4", "6"]}
          css={{
            lineHeight: "1.3",
            background: "linear-gradient(90deg, #ff416c, #f28500)",
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent",
            textShadow: "1px 1px 10px rgba(255, 255, 255, 0.5)",
          }}
        >
          Build Organizations Owned Fully by Your Community
        </Text>
        <Text
          mt={["8", "10"]}
          zIndex={1}
          fontSize={["16px", "19px", "21px"]}
          fontWeight="700"
          textAlign="center"
          color="gray.700"
          w={["95%", "65%"]}
        >
          Unite your Community, simplify Collaboration, and manage funds Collectively with Poa
        </Text>

        <Flex justifyContent={["center", "center", "center"]} direction={["column", "column", "row"]} gap={12} mt={["8", "14"]} zIndex={1}>
          <Box
            _hover={{ transform: "scale(1.05)", transition: "transform 0.3s" }}
            onClick={() => router.push("/create")}
            cursor="pointer"
            maxW={["100%", "100%", "650px"]}
            flex="1"
          >
            <HStack display="flex" spacing={[2, 4]} bg="purple.200" borderRadius="3xl" p={[4, 6]} justifyContent="center" >
              <Image
                mr={["1", "4"]}
                src="/images/high_res_poa.png"
                alt="Poa Logo"
                width={[100,140,180,240]}
                height={[100,140,180,240]}
              />
              <Box borderRadius="2xl" bg="white" p={[3, 4]}>
                <Text fontWeight="500" fontSize={["13px", "15px", "17px"]} color="black.900">
                  Hi, I'm Poa, and I'll help you Customize your own Perpetual Organization!
                </Text>
                <Text mt={3} fontSize={["14px", "16px", "18px"]} color="black.900" fontWeight="800">
                  Let's Chat! Click me to get started.
                </Text>
              </Box>
            </HStack>
          </Box>
          <Box mt="-4" mb="8" maxW={["100%", "100%", "650px"]} flex="1">
            <VStack display={["flex", "flex", "none"]} spacing={4} bg="blue.200" borderRadius="3xl" p={6}>
              <Box borderRadius="2xl" bg="white" p={[4, 4]}>
                <Text fontWeight="600" fontSize={["16px", "16px", "18px"]} color="black.900">
                  What is a{" "}
                  <Text
                    as="span"
                    fontWeight="900"
                    css={{
                      background: "linear-gradient(90deg, #ff416c, #f28500)",
                      "-webkit-background-clip": "text",
                      "-webkit-text-fill-color": "transparent",
                      textShadow: "1px 1px 10px rgba(255, 255, 255, 0.5)",
                    }}
                    fontSize={["16px", "16px", "18px"]}
                  >
                    Perpetual Organization
                  </Text>
                </Text>
                <Text mt={2} color="black.900" fontSize={["13px", "14px", "16px"]} fontWeight="500">
                  POs are community-owned, unstoppable organizations based on contribution and democracy, not investment.
                </Text>
                <Button size="sm" mt={4} colorScheme="blue" variant="outline" _hover={{ transform: "scale(1.05)", transition: "transform 0.3s" }} onClick={() => router.push("/about")}>
                  Learn More
                </Button>
              </Box>
              <Box
                height="100%"
                width="90%"
                bg={useColorModeValue("gray.800", "white")}
                borderRadius="xl"
                p={["2","6"]}
                textAlign="center"
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                transition="all 0.3s ease"
                onClick={handleClick}
                cursor="pointer"
                mt="2" 
              >
                <Text fontSize={["19px", "22px", "30px"]} fontWeight="bold" color={useColorModeValue("lightgreen", "white")}>
                  Explore
                </Text>
                <Text mt="2" fontSize={["12px", "14px", "16px"]} fontWeight="bold" color="white">
                  Discover and join existing Perpetual Organizations
                </Text>
              </Box>
            </VStack>
            <HStack display={["none", "none", "flex"]} spacing={8} bg="blue.200" borderRadius="3xl" p={6} justifyContent="center">
              <Box
                height="100%"
                width="100%"
                bg={useColorModeValue("gray.800", "white")}
                borderRadius="xl"
                p={8}
                textAlign="center"
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                transition="all 0.3s ease"
                onClick={handleClick}
                cursor="pointer"
                maxW={["100%", "100%", "650px"]}
                flex="1"
              >
                <Text mt="-2"fontSize={["16px", "22px", "34px"]} fontWeight="bold" color={useColorModeValue("lightgreen", "white")}>
                  Explore
                </Text>
                <Text mt="2"  mb="-2"  fontSize={["12px", "14px", "16px"]}  color="white">
                  Discover and join existing Perpetual Organizations
                </Text>
              </Box>
              <Box borderRadius="2xl" bg="white" p={[2, 4]}>
                <Text fontWeight="500" fontSize={["12px", "14px", "20px"]} color="black.900">
                  What is a{" "}
                  <Text
                    as="span"
                    fontWeight="900"
                    css={{
                      background: "linear-gradient(90deg, #ff416c, #f28500)",
                      "-webkit-background-clip": "text",
                      "-webkit-text-fill-color": "transparent",
                      textShadow: "1px 1px 10px rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    Perpetual Organization
                  </Text>
                </Text>
                <Text mt={2} color="black.900" fontSize={["12px", "14px", "16px"]} fontWeight="400">
                  POs are community-owned, unstoppable organizations based on contribution and democracy, not investment.
                </Text>
                <Button size="md" mt={4} colorScheme="blue" variant="outline" _hover={{ transform: "scale(1.05)", transition: "transform 0.3s" }} onClick={() => router.push("/about")}>
                  Learn More
                </Button>
              </Box>
            </HStack>
          </Box>
        </Flex>
        <AutoPlayVideo1 />

       <VStack zIndex={"4"}>
        <Text fontSize={["sm", "xl"]} fontWeight="bold" textColor={"gray.900"}>
          Join our Community
        </Text>
        <HStack  spacing={4} align="center">
          {" "}
          <Box width={["10","20"]}>
            <Link href="https://discord.gg/kKDKgetdNx" passHref>
              <Image src="/images/discord.png" alt="Poa Discord" />
            </Link>
          </Box>
          <Box width={["10","20"]}>
            <Link href="https://twitter.com/PoaPerpetual" passHref>
              <Image src="/images/x.png" alt="Poa Twitter" />
            </Link>
          </Box>
        </HStack>
        </VStack>
      </Flex>
    </>
  );
}
