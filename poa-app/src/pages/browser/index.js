import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useprofileHubContext } from "../../context/profileHubContext";
import { useIPFScontext } from "@/context/ipfsContext";
import Link from "next/link";
import { 
  Flex, 
  VStack, 
  Box, 
  Text, 
  Image, 
  Heading, 
  Grid, 
  GridItem, 
  Container, 
  Button, 
  useColorModeValue, 
  Icon,
  Badge,
  InputGroup,
  Input,
  InputRightElement,
  Divider,
  HStack,
  Skeleton
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaSearch, FaUsers, FaArrowRight, FaGlobe } from "react-icons/fa";

// Motion components for animations
const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionFlex = motion(Flex);

const BrowserPage = () => {
  const { perpetualOrganizations, setprofileHubLoaded } = useprofileHubContext();
  const { fetchImageFromIpfs } = useIPFScontext();
  const [images, setImages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Color mode values
  const cardBg = useColorModeValue("white", "gray.800");
  const cardHoverBg = useColorModeValue("gray.50", "gray.700");
  const heroGradient = useColorModeValue(
    "linear(to-r, blue.50, purple.50)",
    "linear(to-r, blue.900, purple.900)"
  );
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const loadImages = async () => {
      if (perpetualOrganizations.length === 0) {
        setprofileHubLoaded(true);
      } else {
        const imagePromises = perpetualOrganizations.map(async (po) => {
          if (po.logoHash) {
            const imageUrl = await fetchImageFromIpfs(po.logoHash);
            return { id: po.id, url: imageUrl };
          }
          return { id: po.id, url: null };
        });

        const results = await Promise.all(imagePromises);
        const newImages = results.reduce((acc, { id, url }) => {
          if (url) acc[id] = url;
          return acc;
        }, {});

        setImages(newImages);
      }
      setIsLoading(false);
    };

    loadImages();
  }, [perpetualOrganizations, fetchImageFromIpfs]);

  // Filter organizations based on search term
  const filteredOrganizations = perpetualOrganizations.filter(po => 
    po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (po.aboutInfo?.description && po.aboutInfo.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <Box width="100%">
        {/* Hero Section */}
        <Box
          bgGradient={heroGradient}
          mt="3"
          py={{ base: "40px", md: "70px" }}
          px={{ base: 4, md: 8 }}
          borderBottomWidth="1px"
          borderColor={borderColor}
          mb={{ base: 6, md: 10 }}
        >
          <Container maxW="container.xl">
            <MotionFlex
              direction="column"
              align="center"
              textAlign="center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MotionHeading
                as="h1"
                size={{ base: "xl", md: "2xl" }}
                fontWeight="extrabold"
                mb={4}
              >
                Browse and Join a <Box as="span" color={accentColor}>Perpetual Organization</Box>
              </MotionHeading>
              <MotionText
                fontSize={{ base: "lg", md: "xl" }}
                maxW="700px"
                mb={8}
                opacity={0.8}
              >
                Discover communities that share your interests and passions. Connect, contribute, and grow with like-minded individuals.
              </MotionText>
              
              {/* Search Bar */}
              <InputGroup
                size="lg"
                maxW="600px"
                mb={8}
                boxShadow="md"
                borderRadius="full"
              >
                <Input
                  placeholder="Search organizations..."
                  borderRadius="full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg={cardBg}
                  borderWidth="2px"
                  borderColor={borderColor}
                  _focus={{ borderColor: accentColor, boxShadow: `0 0 0 1px ${accentColor}` }}
                  fontSize="md"
                  h="56px"
                  pl={6}
                />
                <InputRightElement h="56px" w="56px" pr={1}>
                  <Button
                    h="40px"
                    w="40px"
                    borderRadius="full"
                    bg={accentColor}
                    color="white"
                    _hover={{ bg: `${accentColor}.600` }}
                  >
                    <Icon as={FaSearch} />
                  </Button>
                </InputRightElement>
              </InputGroup>
              
              {/* Stats/Info */}
              <HStack 
                spacing={8} 
                mt={2} 
                divider={<Box h="40px" w="1px" bg={borderColor} />}
                mb="-6"
              >
                <Box textAlign="center">
                  <Text fontWeight="bold" fontSize="xl">{perpetualOrganizations.length}</Text>
                  <Text opacity={0.7} fontSize="sm">Organizations</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontWeight="bold" fontSize="xl">
                    {perpetualOrganizations.reduce((acc, po) => acc + (parseInt(po.totalMembers) || 0), 0)}
                  </Text>
                  <Text opacity={0.7} fontSize="sm">Members</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontWeight="bold" fontSize="xl">100%</Text>
                  <Text opacity={0.7} fontSize="sm">Community-owned</Text>
                </Box>
              </HStack>
            </MotionFlex>
          </Container>
        </Box>

        {/* Organizations Grid */}
        <Container maxW="container.xl" px={{ base: 4, md: 6 }} mb={16}>
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {isLoading ? (
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)"
                }}
                gap={6}
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <GridItem key={i}>
                    <Box
                      borderRadius="xl"
                      overflow="hidden"
                      boxShadow="md"
                      bg={cardBg}
                      borderWidth="1px"
                      borderColor={borderColor}
                      height="100%"
                    >
                      <Skeleton height="180px" />
                      <Box p={5}>
                        <Skeleton height="24px" mb={3} />
                        <Skeleton height="60px" mb={3} />
                        <Skeleton height="20px" width="120px" />
                      </Box>
                    </Box>
                  </GridItem>
                ))}
              </Grid>
            ) : filteredOrganizations.length === 0 ? (
              <Flex direction="column" align="center" justify="center" py={16}>
                <Icon as={FaGlobe} boxSize={12} color={accentColor} mb={4} />
                <Heading size="lg" mb={2}>No organizations found</Heading>
                <Text textAlign="center" maxW="500px" mb={6}>
                  {searchTerm ? 
                    `No organizations matching "${searchTerm}" were found. Try a different search.` : 
                    "There are no organizations available at the moment. Check back later."}
                </Text>
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    colorScheme="blue" 
                    onClick={() => setSearchTerm("")}
                  >
                    Clear Search
                  </Button>
                )}
              </Flex>
            ) : (
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)"
                }}
                gap={6}
              >
                {filteredOrganizations.map((po) => (
                  <GridItem key={po.id}>
                    <MotionBox
                      variants={itemVariants}
                      as={Link}
                      href={`/home?userDAO=${po.id}`}
                      display="block"
                      height="100%"
                    >
                      <Box
                        borderRadius="xl"
                        overflow="hidden"
                        boxShadow="md"
                        bg={cardBg}
                        borderWidth="1px"
                        borderColor={borderColor}
                        transition="all 0.3s"
                        height="100%"
                        _hover={{
                          transform: "translateY(-8px)",
                          boxShadow: "xl",
                          borderColor: accentColor,
                        }}
                      >
                        <Box
                          bg={useColorModeValue("gray.100", "gray.900")}
                          p={5}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Image
                            src={images[po.id] || '/images/poa_logo.png'}
                            alt={po.id}
                            borderRadius="lg"
                            boxSize="120px"
                            objectFit="contain"
                          />
                        </Box>
                        
                        <Box p={5}>
                          <Flex justify="space-between" align="center" mb={2}>
                            <Heading
                              as="h3"
                              fontSize="xl"
                              fontWeight="bold"
                              noOfLines={1}
                            >
                              {po.id}
                            </Heading>
                            <Badge colorScheme="blue" borderRadius="full" px={2}>
                              PO
                            </Badge>
                          </Flex>
                          
                          {po.aboutInfo?.description && (
                            <Text
                              fontSize="md"
                              color={useColorModeValue("gray.600", "gray.300")}
                              mb={3}
                              noOfLines={2}
                            >
                              {po.aboutInfo.description}
                            </Text>
                          )}
                          
                          <Divider my={3} />
                          
                          <Flex justify="space-between" align="center">
                            <HStack>
                              <Icon as={FaUsers} color={accentColor} />
                              <Text fontSize="sm" fontWeight="medium">
                                {po.totalMembers || "0"} Members
                              </Text>
                            </HStack>
                            <Icon as={FaArrowRight} color={accentColor} />
                          </Flex>
                        </Box>
                      </Box>
                    </MotionBox>
                  </GridItem>
                ))}
              </Grid>
            )}
          </MotionBox>
        </Container>
      </Box>
    </Layout>
  );
};

export default BrowserPage;
