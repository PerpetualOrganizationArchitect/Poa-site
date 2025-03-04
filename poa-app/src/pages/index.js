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
        p={[3, 4, 6]}
        position="relative"
        fontFamily="Inter, sans-serif"
        overflowX="hidden"
        width="100%"
      >
        {/* Background Gradient - Enhanced with animation */}
        <Box
          position="absolute"
          top={["-12", "0"]}
          left="0"
          right="0"
          bottom="0"
          bg="radial-gradient(circle, rgba(255, 255, 255, 10) 80%, rgba(154, 215, 255, 0.8) 115%)"
          width="100%"
          overflow="hidden"
          _after={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.8) 0%, transparent 40%)',
            animation: 'pulse 10s infinite ease-in-out',
          }}
          sx={{
            '@keyframes pulse': {
              '0%': { opacity: 0.5 },
              '50%': { opacity: 0.8 },
              '100%': { opacity: 0.5 },
            }
          }}
        />

        {/* Beta Badge - Improved styling */}
        <Box
          position="absolute"
          top="14px"
          left="14px"
          display={["none", "none", "block"]}
          bg="linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)"
          color="white"
          px={6}
          py={3}
          borderRadius="full"
          fontWeight="bold"
          zIndex={2}
          boxShadow="0 4px 10px rgba(0,0,0,0.1)"
        >
          Beta
        </Box>
        
        {/* Hamburger Menu - Enhanced mobile styling */}
        <Box position="absolute" top="20px" right={["14px", "7%"]} zIndex={4}>
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
              boxShadow="md"
              borderRadius="full"
              size={["md", "lg"]}
            />
            <MenuList
              borderRadius="xl"
              boxShadow="xl"
              p={2}
              mt={2}
            >
              <MenuItem 
                onClick={() => router.push("/docs")} 
                icon={<Text fontSize="lg">📄</Text>}
                borderRadius="md"
                _hover={{ bg: "blue.50" }}
                fontSize={["sm", "md"]}
                fontWeight="500"
                py={3}
              >
                Docs
              </MenuItem>
              <MenuItem 
                onClick={() => router.push("/about")} 
                icon={<Text fontSize="lg">ℹ️</Text>}
                borderRadius="md"
                _hover={{ bg: "blue.50" }}
                fontSize={["sm", "md"]}
                fontWeight="500"
                py={3}
              >
                About
              </MenuItem>
              <MenuItem 
                onClick={() => router.push("/browser")} 
                icon={<Text fontSize="lg">🔍</Text>}
                borderRadius="md"
                _hover={{ bg: "blue.50" }}
                fontSize={["sm", "md"]}
                fontWeight="500"
                py={3}
              >
                Browse
              </MenuItem>
              <MenuItem 
                onClick={() => router.push("/create")} 
                icon={<Text fontSize="lg">✨</Text>}
                borderRadius="md"
                _hover={{ bg: "blue.50" }}
                fontSize={["sm", "md"]}
                fontWeight="500"
                py={3}
              >
                Create
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
        
        {/* Logo - Added animation */}
        <Image
          src="/images/poa_logo.png"
          alt="Poa Perpetual Organization Architect Logo"
          width={["110px", "130px", "180px"]}
          mt={["4", "6", "8"]}
          zIndex={1}
          animation="fadeIn 0.8s ease-in-out"
          sx={{
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(-10px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            }
          }}
        />
        <Text
          zIndex={1}
          mb={["2", "4", "6"]}
          fontSize={["10px", "12px", "14px"]}
          color="gray.600"
          letterSpacing="wider"
          fontWeight="500"
          animation="fadeIn 1s ease-in-out 0.3s forwards"
          opacity="0"
          sx={{
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
            }
          }}
        >
          Perpetual Organization Architect
        </Text>

        {/* Main Heading - Enhanced with animation and better mobile styling */}
        <Text
          zIndex={3}
          fontWeight="1000"
          fontSize={["22px", "25px", "31px", "39px"]}
          textAlign="center"
          mt={["8", "6", "6"]}
          px={[4, 6, 8]}
          w={["95%", "95%", "auto"]}
          css={{
            lineHeight: "1.3",
            background: "linear-gradient(135deg, #ff416c, #f28500)",
            "-webkit-background-clip": "text",
            "-webkit-text-fill-color": "transparent",
            textShadow: "0px 2px 10px rgba(255, 255, 255, 0.6)",
          }}
          fontFamily="Roboto, sans-serif"
          letterSpacing="tight"
          animation="slideUp 0.8s ease-out 0.5s forwards"
          opacity="0"
          transform="translateY(20px)"
          sx={{
            '@keyframes slideUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            }
          }}
        >
          Quickly Build Organizations Owned Fully by Your Community
        </Text>

        {/* Subheading - Improved readability */}
        <Text
          mt={["8", "10"]}
          zIndex={1}
          fontSize={["17px", "21px", "23px"]}
          fontWeight="700"
          textAlign="center"
          color="gray.700"
          w={["90%", "75%", "65%"]}
          fontFamily="Inter, sans-serif"
          letterSpacing="tight"
          animation="fadeIn 1s ease-out 0.8s forwards"
          opacity="0"
          sx={{
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
            }
          }}
        >
          Manage Projects, Track Participation, and Govern Collectively with Poa
        </Text>
        <Text
          mt="6"
          zIndex={1}
          fontSize={["14px", "16px", "19px"]}
          fontWeight="500"
          textAlign="center"
          color="gray.600"
          w={["90%", "75%", "65%"]}
          display={["none", "none", "block"]}
          fontFamily="Inter, sans-serif"
          letterSpacing="tight"
        >
          Voting power is based on Membership and Contribution, not capital
        </Text>

        {/* Main Content - Improved spacing and mobile layout */}
        <Flex
          justifyContent={["center", "center", "center"]}
          direction={["column", "column", "row"]}
          gap={[8, 10, 12]}
          mt={["12", "14", "16"]}
          mb={["8"]}
          zIndex={1}
          width="100%"
          px={[3, 4, 6]}
          animation="fadeIn 1s ease-out 1s forwards"
          opacity="0"
          sx={{
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
            }
          }}
        >
          {/* Left Box - Enhanced with better hover effects and mobile styling */}
          <Box
            transition="all 0.3s"
            _hover={{ transform: "scale(1.03)", boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.1)" }}
            onClick={() => router.push("/create")}
            cursor="pointer"
            maxW={["100%", "100%", "650px"]}
            flex="1"
            order={[2, 2, 1]}
            width="100%"
            borderRadius="3xl"
            overflow="hidden"
            position="relative"
            role="group"
            bg="linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)"
            boxShadow="0 5px 20px -5px rgba(0, 0, 0, 0.2)"
          >
            <HStack
              display="flex"
              spacing={0}
              borderRadius="3xl"
              p={[2, 3, 4]}
              justifyContent="space-between"
              width="100%"
              height="100%"
              pointerEvents="none"
            >
              <Box
                width="40%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                pl={[0, 1, 2]}
              >
                <Image
                  src="/images/high_res_poa.png"
                  alt="Poa Logo"
                  width={["110px", "120px", "140px", "190px"]}
                  height={["110px", "120px", "140px", "190px"]}
                  objectFit="contain"
                  transition="transform 0.3s ease"
                  _groupHover={{ transform: "scale(1.05)" }}
                />
              </Box>
              <Box 
                borderRadius="2xl" 
                bg="white" 
                p={[2, 2, 3]} 
                boxShadow="md" 
                width="57%"
                mr={[1, 1, 2]}
              >
                <Text
                  fontWeight="500"
                  fontSize={["12px", "12px", "15px", "17px"]}
                  color="black.900"
                  fontFamily="Inter, sans-serif"
                  lineHeight="1.3"
                >
                  Hi, I'm Poa! I'll help you Customize your own
                  Community-powered Organization!
                </Text>
                <Text
                  mt={[1, 2, 3]}
                  fontSize={["13px", "14px", "17px", "21px"]}
                  color="black.900"
                  fontWeight="800"
                  fontFamily="Roboto, sans-serif"
                  bgGradient="linear(to-r, #ff416c, #f28500)"
                  bgClip="text"
                  lineHeight="1.2"
                >
                  Build your Organization for Free in Minutes
                </Text>
              </Box>
            </HStack>
          </Box>

          {/* Right Box - Enhanced with better mobile styling */}
          <Box 
            mb="6" 
            maxW={["100%", "100%", "650px"]} 
            flex="1" 
            order={[1, 1, 2]} 
            width="100%"
            borderRadius="3xl"
            overflow="hidden"
          >
            {/* Mobile View - Improved styling */}
            <VStack
              display={["flex", "flex", "none"]}
              spacing={5}
              bg="linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)"
              borderRadius="3xl"
              p={[4, 5, 6]}
              width="100%"
              boxShadow="0 5px 20px -5px rgba(0, 0, 0, 0.2)"
            >
              <Box 
                borderRadius="2xl" 
                bg="white" 
                p={[4]} 
                width="100%" 
                boxShadow="md"
              >
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
                  lineHeight="1.5"
                >
                  POs are community-owned, unstoppable organizations based on
                  contribution and democracy, not investment.
                </Text>
                <Button
                  size="sm"
                  mt={4}
                  colorScheme="blue"
                  variant="outline"
                  borderRadius="full"
                  fontWeight="600"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "md",
                    bg: "blue.50"
                  }}
                  width="100%"
                  onClick={() => router.push("/docs/perpetualOrganization/")}
                >
                  Learn More
                </Button>
              </Box>
              <Box
                height="100%"
                width="100%"
                bg="linear-gradient(135deg, #2a2a72 0%, #009ffd 100%)"
                borderRadius="xl"
                p={[5]}
                textAlign="center"
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
                transition="all 0.3s ease"
                onClick={handleClick}
                cursor="pointer"
              >
                <Text
                  fontSize={["24px", "26px", "30px"]}
                  fontWeight="bold"
                  color="white"
                  fontFamily="Roboto, sans-serif"
                  letterSpacing="wide"
                  mb={2}
                >
                  Explore
                </Text>
                <Text
                  fontSize={["13px", "14px", "16px"]}
                  fontWeight="medium"
                  color="whiteAlpha.900"
                  fontFamily="Inter, sans-serif"
                  lineHeight="1.5"
                >
                  Discover and join existing Perpetual Organizations
                </Text>
              </Box>
            </VStack>

            {/* Desktop View - Same changes to match mobile */}
            <HStack
              display={["none", "none", "flex"]}
              spacing={[4, 6, 8]}
              bg="linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)"
              borderRadius="3xl"
              p={[4, 5, 6]}
              justifyContent="center"
              width="100%"
              boxShadow="0 5px 20px -5px rgba(0, 0, 0, 0.2)"
            >
              <Box
                bg="linear-gradient(135deg, #2a2a72 0%, #009ffd 100%)"
                borderRadius="xl"
                p={5}
                textAlign="center"
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
                transition="all 0.3s ease"
                onClick={handleClick}
                cursor="pointer"
                maxW={["100%", "100%", "600px"]}
                flex="1"
              >
                <Text
                  fontSize={["16px", "22px", "30px"]}
                  fontWeight="bold"
                  color="white"
                  fontFamily="Roboto, sans-serif"
                  letterSpacing="wide"
                >
                  Explore
                </Text>
                <Text
                  mt="2"
                  fontSize={["12px", "12px", "14px"]}
                  color="whiteAlpha.900"
                  fontFamily="Inter, sans-serif"
                  fontWeight="medium"
                >
                  Discover and join existing Perpetual Organizations
                </Text>
              </Box>
              <Box borderRadius="2xl" bg="white" p={[3, 4]} boxShadow="md">
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
                  lineHeight="1.5"
                >
                  POs are community-owned, unstoppable organizations based on
                  contribution and democracy, not investment.
                </Text>
                <Button
                  size="md"
                  mt={4}
                  colorScheme="blue"
                  variant="outline"
                  borderRadius="full"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "md",
                    bg: "blue.50"
                  }}
                  onClick={() => router.push("/docs/perpetualOrganization/")}
                >
                  Learn More
                </Button>
              </Box>
            </HStack>
          </Box>
        </Flex>

        {/* AutoPlay Video - Completely revised centering solution */}
        <Box
          width="100%"
          mt={[4, 6, 8]}
          animation="fadeIn 1s ease-out 1.2s forwards"
          opacity="0"
          position="relative"
          sx={{
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
            },
            '& > div': {
              margin: '0 auto !important',
              display: 'flex !important',
              justifyContent: 'center !important'
            },
            '& video': {
              maxWidth: '100% !important',
              height: 'auto !important',
              margin: '0 auto !important'
            }
          }}
        >
          <Box
            maxW="1200px"
            mx="auto"
            px={[3, 4, 6]}
            textAlign="center"
          >
            <AutoPlayVideo1 />
          </Box>
        </Box>

        {/* Community Links - Enhanced styling */}
        <VStack 
          mt={["10", "12", "14"]} 
          zIndex={4}
          mb={[8, 10, 12]}
          animation="fadeIn 1s ease-out 1.4s forwards"
          opacity="0"
          sx={{
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 1 },
            }
          }}
        >
          <Text
            fontSize={["md", "lg", "xl"]}
            fontWeight="bold"
            textColor={"gray.900"}
            fontFamily="Roboto, sans-serif"
            mb={2}
          >
            Join our Community
          </Text>
          <HStack spacing={6} align="center">
            <Link href="https://discord.gg/kKDKgetdNx" passHref>
              <Box 
                width={["12", "16", "20"]} 
                transition="all 0.2s"
                _hover={{ transform: "scale(1.1)" }}
                p={2}
                borderRadius="full"
                bg="white"
                boxShadow="md"
              >
                <Image src="/images/discord.png" alt="Poa Discord" />
              </Box>
            </Link>
            <Link href="https://twitter.com/PoaPerpetual" passHref>
              <Box 
                width={["12", "16", "20"]} 
                transition="all 0.2s"
                _hover={{ transform: "scale(1.1)" }}
                p={2}
                borderRadius="full"
                bg="white"
                boxShadow="md"
              >
                <Image src="/images/x.png" alt="Poa Twitter" />
              </Box>
            </Link>
          </HStack>
        </VStack>
        
        {/* Added floating scroll indicator for mobile */}
        <Box
          display={["block", "block", "none"]}
          position="fixed"
          bottom="20px"
          right="20px"
          zIndex={10}
          bg="white"
          borderRadius="full"
          p={3}
          boxShadow="0 4px 20px rgba(0,0,0,0.15)"
          opacity="0.8"
          _hover={{ opacity: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          animation="float 2s infinite ease-in-out"
          sx={{
            '@keyframes float': {
              '0%': { transform: 'translateY(0px)' },
              '50%': { transform: 'translateY(-5px)' },
              '100%': { transform: 'translateY(0px)' },
            }
          }}
        >
          <Text fontSize="lg">⬆️</Text>
        </Box>
      </Flex>
    </>
  );
}
