import Head from "next/head";
import Link from "next/link";
import {
  Flex,
  Box,
  Button,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Image,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

import dynamic from "next/dynamic";

const AutoPlayVideo1 = dynamic(() => import("../components/AutoPlayVideo1"), {
  ssr: false,
});

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/browser");
  };

  const jsonLD = {
    "@context": "http://schema.org",
    "@type": "Organization",
    "name": "Poa",
    "url": "https://poa.community",
    "logo": "https://poa.community/images/high_res_poa.png",
    "sameAs": ["https://twitter.com/PoaPerpetual"],
    "description":
      "Poa is a no code DAO builder that makes it easy to create and join fully community owned censorship resistant organizations called Perpetual Organizations. Poa leverages web3 tech to keep the Perpetual Organizations fully community owned and operated.",
  };

  const breadcrumb = {
    "@context": "http://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://poa.community",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Docs",
        "item": "https://poa.community/docs",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "AlphaV1",
        "item": "https://poa.community/docs/AlphaV1",
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Poa - Perpetual Organization Architect</title>
        <meta
          name="description"
          content="Poa, the Perpetual Organization Architect, helps you create and manage worker-owned DAOs with no coding required. Start building your community-driven organization today with Poa."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://poa.community" />
        <meta
          property="og:title"
          content="Poa - Perpetual Organization Architect"
        />
        <meta
          property="og:description"
          content="Poa helps you create and manage fully worker-owned DAOs with no coding required. Start building your community-driven organization today with Poa."
        />
        <meta property="og:url" content="https://poa.community" />
        <meta
          property="og:image"
          content="https://poa.community/images/high_res_poa.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Poa - Perpetual Organization Architect"
        />
        <meta
          name="twitter:description"
          content="Poa helps you create and manage fully worker-owned DAOs with no coding required. Start building your community-driven organization today with Poa."
        />
        <meta
          name="twitter:image"
          content="https://poa.community/images/high_res_poa.png"
        />

        {/* Import Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD Scripts */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
        />
      </Head>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="top"
        minH="100vh"
        p={6}
        position="relative"
        fontFamily="Inter, sans-serif"
      >
        {/* Background Gradient */}
        <Box
          position="absolute"
          top={["-12", "0"]}
          left="0"
          right="0"
          bottom="0"
          bg="radial-gradient(circle, rgba(255, 255, 255, 10) 80%, rgba(154, 215, 255, 0.8) 115%)"
        />

        {/* Beta Badge */}
        <Box
          position="absolute"
          top="14px"
          left="14px"
          display={["none", "none", "block"]}
          bg="red.500"
          color="white"
          px={6}
          py={3}
          borderRadius="md"
          fontWeight="bold"
          zIndex={2}
        >
          Beta
        </Box>
        {/* Hamburger Menu */}
        <Box position="absolute" top="30px" right="7%" zIndex={4}>
          <Menu zIndex={4}>
            <MenuButton

              as={IconButton}
              icon={<HamburgerIcon w={[6,8]} h={[6,8]} />} 
              variant="outline"
              aria-label="Options"
              borderWidth="2px" 
              borderColor="gray.400" 
              bg="white" 
              _hover={{ bg: "gray.100" }} 
              _active={{ bg: "gray.200" }} 
            />
            <MenuList>
              <MenuItem onClick={() => router.push("/docs")}>Docs</MenuItem>
              <MenuItem onClick={() => router.push("/about")}>About</MenuItem>
              <MenuItem onClick={() => router.push("/browser")}>Browse</MenuItem>
              <MenuItem onClick={() => router.push("/create")}>Create</MenuItem>
            </MenuList>
          </Menu>
        </Box>
        {/* Logo */}
        <Image
          src="/images/poa_logo.png"
          alt="Poa Perpetual Organization Architect Logo"
          width={["110px", "130px", "180px"]}
          mt={["0", "2", "4"]}
          zIndex={1}
        />
        <Text
          zIndex={1}
          mb={["2", "4", "6"]}
          fontSize={["8px", "12px", "14px"]}
          color="gray.600"
        >
          Perpetual Organization Architect
        </Text>

        {/* Main Heading */}
        <Text
          zIndex={3}
          fontWeight="1000"
          fontSize={["25px", "27px", "31px", "39px"]}
          textAlign="center"
          mt={["8", "6", "6"]}
          css={{
            lineHeight: "1.3",
            background: "linear-gradient(90deg, #ff416c, #f28500)",
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent",
            textShadow: "1px 1px 10px rgba(255, 255, 255, 0.5)",
          }}
          fontFamily="Roboto, sans-serif"
        >
          Quickly Build Organizations Owned Fully by Your Community
        </Text>

        {/* Subheading */}
        <Text
          mt={["10", "10"]}
          zIndex={1}
          fontSize={["17px", "21px", "23px"]}
          fontWeight="700"
          textAlign="center"
          color="gray.700"
          w={["95%", "65%"]}
          fontFamily="Inter, sans-serif"
        >
          Manage Projects, Track Participation, and Govern Collectively with Poa
        </Text>
        <Text
          mt="8"
          zIndex={1}
          fontSize={["14px", "16px", "19px"]}
          fontWeight="500"
          textAlign="center"
          color="gray.600"
          w={["95%", "65%"]}
          display={["none", "none", "block"]}
          fontFamily="Inter, sans-serif"
        >
          Voting power is based on Membership and Contribution, not capital
        </Text>

        {/* Main Content */}
        <Flex
          justifyContent={["center", "center", "center"]}
          direction={["column", "column", "row"]}
          gap={12}
          mt={["15", "12"]}
          mb={["6"]}
          zIndex={1}
        >
          {/* Left Box */}
          <Box
            _hover={{ transform: "scale(1.05)", transition: "transform 0.3s" }}
            onClick={() => router.push("/create")}
            cursor="pointer"
            maxW={["100%", "100%", "650px"]}
            flex="1"
            order={[2, 2, 1]}
          >
            <HStack
              display="flex"
              spacing={[2, 4]}
              bg="purple.200"
              borderRadius="3xl"
              p={[4, 6]}
              justifyContent="center"
            >
              <Image
                mr={["1", "4"]}
                src="/images/high_res_poa.png"
                alt="Poa Logo"
                width={[100, 140, 180, 220]}
                height={[100, 140, 180, 220]}
              />
              <Box borderRadius="2xl" bg="white" p={[3, 4]}>
                <Text
                  fontWeight="400"
                  fontSize={["12px", "14px", "16px"]}
                  color="black.900"
                  fontFamily="Inter, sans-serif"
                >
                  Hi, I'm Poa! I'll help you Customize your own
                  Community-powered Organization!
                </Text>
                <Text
                  mt={3}
                  fontSize={["15px", "17px", "19px"]}
                  color="black.900"
                  fontWeight="800"
                  fontFamily="Roboto, sans-serif"
                >
                  Build your Organization for Free in Minutes
                </Text>
              </Box>
            </HStack>
          </Box>

          {/* Right Box */}
          <Box mb="6" maxW={["100%", "100%", "650px"]} flex="1" order={[1, 1, 2]}>
            {/* Mobile View */}
            <VStack
              display={["flex", "flex", "none"]}
              spacing={4}
              bg="blue.200"
              borderRadius="3xl"
              p={6}
            >
              <Box borderRadius="2xl" bg="white" p={[4, 4]}>
                <Text
                  fontWeight="600"
                  fontSize={["16px", "16px", "18px"]}
                  color="black.900"
                  fontFamily="Roboto, sans-serif"
                >
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
                    fontFamily="Roboto, sans-serif"
                  >
                    Perpetual Organization
                  </Text>
                </Text>
                <Text
                  mt={2}
                  color="black.900"
                  fontSize={["13px", "14px", "16px"]}
                  fontWeight="500"
                  fontFamily="Inter, sans-serif"
                >
                  POs are community-owned, unstoppable organizations based on
                  contribution and democracy, not investment.
                </Text>
                <Button
                  size="sm"
                  mt={4}
                  colorScheme="blue"
                  variant="outline"
                  _hover={{
                    transform: "scale(1.05)",
                    transition: "transform 0.3s",
                  }}
                  onClick={() => router.push("/about")}
                >
                  Learn More
                </Button>
              </Box>
              <Box
                height="100%"
                width="90%"
                bg={useColorModeValue("gray.800", "white")}
                borderRadius="xl"
                p={["4", "6"]}
                textAlign="center"
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                transition="all 0.3s ease"
                onClick={handleClick}
                cursor="pointer"
                mt="2"
              >
                <Text
                  mt="-1"
                  fontSize={["23px", "23px", "30px"]}
                  fontWeight="bold"
                  color={useColorModeValue("lightgreen", "white")}
                  fontFamily="Roboto, sans-serif"
                >
                  Explore
                </Text>
                <Text
                  mt="2"
                  fontSize={["12px", "14px", "16px"]}
                  fontWeight="bold"
                  color="white"
                  fontFamily="Inter, sans-serif"
                >
                  Discover and join existing Perpetual Organizations
                </Text>
              </Box>
            </VStack>

            {/* Desktop View */}
            <HStack
              display={["none", "none", "flex"]}
              spacing={8}
              bg="blue.200"
              borderRadius="3xl"
              p={6}
              justifyContent="center"
            >
              <Box
                bg={useColorModeValue("gray.800", "white")}
                borderRadius="xl"
                p={5}
                textAlign="center"
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
                transition="all 0.3s ease"
                onClick={handleClick}
                cursor="pointer"
                maxW={["100%", "100%", "600px"]}
                flex="1"
              >
                <Text
                  mt="-2"
                  fontSize={["16px", "22px", "30px"]}
                  fontWeight="bold"
                  color={useColorModeValue("lightgreen", "white")}
                  fontFamily="Roboto, sans-serif"
                >
                  Explore
                </Text>
                <Text
                  mt="2"
                  mb="-2"
                  fontSize={["12px", "12px", "14px"]}
                  color="white"
                  fontFamily="Inter, sans-serif"
                >
                  Discover and join existing Perpetual Organizations
                </Text>
              </Box>
              <Box borderRadius="2xl" bg="white" p={[2, 4]}>
                <Text
                  fontWeight="500"
                  fontSize={["12px", "14px", "20px"]}
                  color="black.900"
                  fontFamily="Roboto, sans-serif"
                >
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
                <Text
                  mt={2}
                  color="black.900"
                  fontSize={["12px", "14px", "16px"]}
                  fontWeight="400"
                  fontFamily="Inter, sans-serif"
                >
                  POs are community-owned, unstoppable organizations based on
                  contribution and democracy, not investment.
                </Text>
                <Button
                  size="md"
                  mt={4}
                  colorScheme="blue"
                  variant="outline"
                  _hover={{
                    transform: "scale(1.05)",
                    transition: "transform 0.3s",
                  }}
                  onClick={() => router.push("/about")}
                >
                  Learn More
                </Button>
              </Box>
            </HStack>
          </Box>
        </Flex>

        {/* AutoPlay Video */}
        <AutoPlayVideo1 />

        {/* Community Links */}
        <VStack mt="14" zIndex={"4"}>
          <Text
            fontSize={["sm", "xl"]}
            fontWeight="bold"
            textColor={"gray.900"}
            fontFamily="Roboto, sans-serif"
          >
            Join our Community
          </Text>
          <HStack spacing={4} align="center">
            <Box width={["10", "20"]}>
              <Link href="https://discord.gg/kKDKgetdNx" passHref>
                <Image src="/images/discord.png" alt="Poa Discord" />
              </Link>
            </Box>
            <Box width={["10", "20"]}>
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
