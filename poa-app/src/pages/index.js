import Head from "next/head";
import Link from "next/link";
import { Flex, Box, Button, Text, Image, VStack, HStack, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
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
            "sameAs": ["https://twitter.com/PoaPerpetual"],
            "description": "Poa is a no code DAO builder that makes it easy to create and join fully community owned censorship resistant organizations called Perpetual Organizations."
          })}
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
          bg="radial-gradient(circle, rgba(255, 255, 255, 1) 80%, rgba(154, 215, 255, 0.8) 115%)"
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
          zIndex={1}
          fontWeight="1000"
          fontSize={["25px", "27px", "31px", "39px"]}
          textAlign="center"
          mt={["4", "4", "4"]}
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
          mt={["6", "10"]}
          zIndex={1}
          fontSize={["16px", "19px", "23px"]}
          fontWeight="700"
          textAlign="center"
          color="gray.800"
          w={["95%", "65%"]}
        >
          Unite your Community, simplify Collaboration, and manage funds Collectively with Poa
        </Text>
        <Text
          mt={["6", "8"]}
          zIndex={1}
          fontSize={["15px", "18px", "19px"]}
          fontWeight="500"
          textAlign="center"
          color="gray.700"
          w={["90%", "60%"]}
        >
          Decisions are made Directly by your Community through Contribution-based voting and Democracy
        </Text>
        <Text mt={["8", "10"]} zIndex={1} fontSize={["19px", "23px", "27px"]} fontWeight="700" textAlign="center" color="gray.900">
          No Coding Required. No Middlemen. No Censorship.
        </Text>

        <Flex direction={["column", "column", "row"]} gap={12} mt={["6", "14"]} zIndex={1}>
          <Box
            _hover={{ transform: "scale(1.05)", transition: "transform 0.3s" }}
            onClick={() => router.push("/create")}
            cursor="pointer"
            maxW={["100%", "100%", "45%"]}
          >
            <HStack spacing={[2, 4]} bg="purple.200" borderRadius="3xl" p={[4, 6]}>
              <Image
                mr={["1", "4"]}
                src="/images/high_res_poa.png"
                alt="Poa Logo"
                width={[100, 140, 180]}
                height={[100, 140, 180]}
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
          <Box maxW={["100%", "100%", "45%"]}>
            <VStack display={["flex", "flex", "none"]} spacing={4} bg="blue.200" borderRadius="3xl" p={6}>
            <Box borderRadius="2xl" bg="white" p={[2, 4]}>
                <Text fontWeight="500" fontSize={["12px", "14px", "16px"]} color="black.900">
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
                <Button mt={4} colorScheme="blue" variant="outline" _hover={{ transform: "scale(1.05)", transition: "transform 0.3s" }} onClick={() => router.push("/about")}>
                  Learn More
                </Button>
              </Box>
              <Box
                height="100%"
                width="100%"
                bg={useColorModeValue("gray.800", "white")}
                borderRadius="xl"
                p={6}
                textAlign="center"
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                transition="all 0.3s ease"
                onClick={handleClick}
                cursor="pointer"
              >
                <Text fontSize={["16px", "22px", "30px"]} fontWeight="bold" color={useColorModeValue("lightgreen", "white")}>
                  Explore
                </Text>
                <Text fontSize={["12px", "14px", "16px"]} fontWeight="bold" color="white">
                  Discover and join existing Perpetual Organizations.
                </Text>
              </Box>

            </VStack>
            <HStack display={["none", "none", "flex"]} spacing={4} bg="blue.200" borderRadius="3xl" p={6}>
              <Box
                height="100%"
                width="100%"
                bg={useColorModeValue("gray.800", "white")}
                borderRadius="xl"
                p={6}
                textAlign="center"
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                transition="all 0.3s ease"
                onClick={handleClick}
                cursor="pointer"
              >
                <Text fontSize={["16px", "22px", "30px"]} fontWeight="bold" color={useColorModeValue("lightgreen", "white")}>
                  Explore
                </Text>
                <Text fontSize={["12px", "14px", "16px"]} fontWeight="bold" color="white">
                  Discover and join existing Perpetual Organizations.
                </Text>
              </Box>
              <Box borderRadius="2xl" bg="white" p={[2, 4]}>
                <Text fontWeight="500" fontSize={["12px", "14px", "16px"]} color="black.900">
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
                <Button mt={4} colorScheme="blue" variant="outline" _hover={{ transform: "scale(1.05)", transition: "transform 0.3s" }} onClick={() => router.push("/about")}>
                  Learn More
                </Button>
              </Box>
            </HStack>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
