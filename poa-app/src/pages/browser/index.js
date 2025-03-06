import React, { useEffect, useState, useRef } from "react";
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
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaSearch, FaUsers, FaArrowRight, FaGlobe, FaInfoCircle } from "react-icons/fa";

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
  const [selectedOrg, setSelectedOrg] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Open description modal
  const openDescriptionModal = (org, e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    setSelectedOrg(org);
    onOpen();
  };

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
      {/* Description Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "lg" }} isCentered>
        <ModalOverlay 
          bg="blackAlpha.300"
          backdropFilter="blur(10px)"
        />
        <ModalContent margin={{ base: 0, md: "auto" }} borderRadius={{ base: 0, md: "md" }}>
          <ModalHeader>
            <Flex 
              align="center" 
              gap={3} 
              direction={{ base: "column", sm: "row" }}
              textAlign={{ base: "center", sm: "left" }}
            >
              <Box 
                width={{ base: "80px", sm: "90px" }} 
                height={{ base: "80px", sm: "90px" }} 
                borderRadius="md"
                overflow="hidden"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mr={{ base: 0, sm: 2 }}
                mb={{ base: 2, sm: 0 }}
                alignSelf={{ base: "center", sm: "flex-start" }}
              >
                <Image 
                  src={selectedOrg && (images[selectedOrg.id] || '/images/poa_logo.png')} 
                  alt={selectedOrg?.id || "Organization logo"}
                  objectFit="contain"
                  width={{ base: "74px", sm: "84px" }}
                  height={{ base: "74px", sm: "84px" }}
                />
              </Box>
              <Heading as="h3" size="md" fontWeight="bold">
                {selectedOrg?.id}
                <Badge colorScheme="blue" ml={2} verticalAlign="middle">PO</Badge>
              </Heading>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedOrg?.aboutInfo?.description && (
              <Text fontSize="md" lineHeight="tall">
                {selectedOrg.aboutInfo.description}
              </Text>
            )}
            {selectedOrg?.totalMembers && (
              <Flex align="center" mt={4} bg={useColorModeValue("blue.50", "blue.900")} p={3} borderRadius="md">
                <Icon as={FaUsers} color={accentColor} mr={2} boxSize="18px" />
                <Text fontWeight="medium">{selectedOrg.totalMembers} Members</Text>
              </Flex>
            )}
          </ModalBody>
          <ModalFooter flexDirection={{ base: "column", sm: "row" }} gap={{ base: 2, sm: 0 }}>
            <Button variant="outline" mr={{ base: 0, sm: 3 }} mb={{ base: 2, sm: 0 }} w={{ base: "100%", sm: "auto" }} onClick={onClose}>
              Close
            </Button>
            <Link href={`/home?userDAO=${selectedOrg?.id}`} passHref style={{ width: "100%" }}>
              <Button colorScheme="blue" rightIcon={<FaArrowRight />} w={{ base: "100%", sm: "auto" }}>
                Visit Organization
              </Button>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box width="100%" position="relative">
        {/* Hero Section with Fading Edges */}
        <Box
          bgGradient={heroGradient}
          mt="3"
          py={{ base: "30px", md: "70px" }}
          px={{ base: 4, md: 8 }}
          borderBottomWidth="1px"
          borderColor={borderColor}
          mb={{ base: 4, md: 10 }}
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
                size={{ base: "lg", md: "2xl" }}
                fontWeight="extrabold"
                mb={{ base: 2, md: 4 }}
                px={{ base: 2, md: 0 }}
              >
                Browse and Join a <Box as="span" color={accentColor}>Perpetual Organization</Box>
              </MotionHeading>
              <MotionText
                fontSize={{ base: "sm", md: "xl" }}
                maxW="700px"
                mb={{ base: 4, md: 8 }}
                opacity={0.8}
                px={{ base: 2, md: 0 }}
                lineHeight={{ base: "1.4", md: "tall" }}
              >
                Discover communities that share your interests and passions. Connect, contribute, and grow with like-minded individuals.
              </MotionText>
              
              {/* Search Bar */}
              <InputGroup
                size={{ base: "md", md: "lg" }}
                maxW="600px"
                mb={{ base: 6, md: 8 }}
                boxShadow="md"
                borderRadius="full"
                width={{ base: "95%", md: "auto" }}
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
                  fontSize={{ base: "sm", md: "md" }}
                  h={{ base: "48px", md: "56px" }}
                  pl={{ base: 4, md: 6 }}
                />
                <InputRightElement h={{ base: "48px", md: "56px" }} w={{ base: "48px", md: "56px" }} pr={1}>
                  <Button
                    h={{ base: "34px", md: "40px" }}
                    w={{ base: "34px", md: "40px" }}
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
                spacing={{ base: 2, md: 8 }} 
                mt={2} 
                divider={<Box h="40px" w="1px" bg={borderColor} display={{ base: "none", sm: "block" }} />}
                mb="-6"
                overflow="auto"
                width="100%"
                justifyContent="center"
                px={{ base: 2, md: 0 }}
                pb={{ base: 2, md: 0 }}
                flexWrap={{ base: "wrap", sm: "nowrap" }}
              >
                <Box textAlign="center" minWidth={{ base: "80px", md: "auto" }} mb={{ base: 1, sm: 0 }}>
                  <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>{perpetualOrganizations.length}</Text>
                  <Text opacity={0.7} fontSize={{ base: "xs", sm: "sm" }}>Organizations</Text>
                </Box>
                <Box textAlign="center" minWidth={{ base: "80px", md: "auto" }} mb={{ base: 1, sm: 0 }}>
                  <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>
                    {perpetualOrganizations.reduce((acc, po) => acc + (parseInt(po.totalMembers) || 0), 0)}
                  </Text>
                  <Text opacity={0.7} fontSize={{ base: "xs", sm: "sm" }}>Members</Text>
                </Box>
                <Box textAlign="center" minWidth={{ base: "80px", md: "auto" }} mb={{ base: 1, sm: 0 }}>
                  <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>100%</Text>
                  <Text opacity={0.7} fontSize={{ base: "xs", sm: "sm" }}>Community-owned</Text>
                </Box>
              </HStack>
            </MotionFlex>
          </Container>
        </Box>

        {/* Organizations Grid */}
        <Container maxW="container.xl" px={{ base: 3, md: 6 }} mb={16}>
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
                gap={{ base: 4, md: 6 }}
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
              <Flex direction="column" align="center" justify="center" py={{ base: 10, md: 16 }}>
                <Icon as={FaGlobe} boxSize={{ base: 8, md: 12 }} color={accentColor} mb={4} />
                <Heading size={{ base: "md", md: "lg" }} mb={2} textAlign="center">No organizations found</Heading>
                <Text textAlign="center" maxW="500px" mb={6} px={{ base: 4, md: 0 }}>
                  {searchTerm ? 
                    `No organizations matching "${searchTerm}" were found. Try a different search.` : 
                    "There are no organizations available at the moment. Check back later."}
                </Text>
                {searchTerm && (
                  <Button 
                    variant="outline" 
                    colorScheme="blue" 
                    onClick={() => setSearchTerm("")}
                    size={{ base: "sm", md: "md" }}
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
                gap={{ base: 4, md: 6 }}
              >
                {filteredOrganizations.map((po) => (
                  <GridItem key={po.id}>
                    <MotionBox
                      variants={itemVariants}
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
                          transform: { base: "none", md: "translateY(-8px)" },
                          boxShadow: { base: "md", md: "xl" },
                          borderColor: accentColor,
                        }}
                      >
                        <Link href={`/home?userDAO=${po.id}`} passHref>
                          <Box
                            as="a"
                            bg={useColorModeValue("gray.100", "gray.900")}
                            p={{ base: 4, md: 6 }}
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Image
                              src={images[po.id] || '/images/poa_logo.png'}
                              alt={po.id}
                              borderRadius="lg"
                              boxSize={{ base: "100px", md: "120px" }}
                              objectFit="contain"
                            />
                          </Box>
                        </Link>
                        
                        <Box p={{ base: 4, md: 5 }}>
                          <Flex justify="space-between" align="center" mb={3}>
                            <Link href={`/home?userDAO=${po.id}`} passHref>
                              <Heading
                                as="a"
                                fontSize={{ base: "lg", md: "xl" }}
                                fontWeight="bold"
                                noOfLines={1}
                              >
                                {po.id}
                              </Heading>
                            </Link>
                            <Badge colorScheme="blue" borderRadius="full" px={2}>
                              PO
                            </Badge>
                          </Flex>
                          
                          {po.aboutInfo?.description && (
                            <Box 
                              mb={3} 
                              position="relative" 
                              minH={{ base: "60px", md: "80px" }} 
                              display="flex" 
                              flexDirection="column" 
                              justifyContent="center"
                            >
                              <Text
                                fontSize={{ base: "sm", md: po.aboutInfo.description.length < 50 ? "lg" : "md" }}
                                lineHeight={po.aboutInfo.description.length < 50 ? "1.5" : "normal"}
                                fontWeight={po.aboutInfo.description.length < 50 ? "medium" : "normal"}
                                color={useColorModeValue("gray.600", "gray.300")}
                                noOfLines={{ base: 2, md: 3 }}
                                position="relative"
                                pr="5px"
                              >
                                {po.aboutInfo.description}
                              </Text>
                              <Button
                                aria-label="Read full description"
                                position="absolute"
                                right="0"
                                bottom="0"
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                width="24px"
                                height="24px"
                                minWidth="0"
                                p="0"
                                onClick={(e) => openDescriptionModal(po, e)}
                              >
                                <Icon as={FaInfoCircle} fontSize="16px" />
                              </Button>
                            </Box>
                          )}
                          
                          <Divider my={3} />
                          
                          <Flex 
                            justify="space-between" 
                            align="center"
                            flexDirection={{ base: "column", sm: "row" }}
                            gap={{ base: 2, sm: 0 }}
                          >
                            <HStack>
                              <Icon as={FaUsers} color={accentColor} />
                              <Text fontSize="sm" fontWeight="medium">
                                {po.totalMembers || "0"} Members
                              </Text>
                            </HStack>
                            <Link href={`/home?userDAO=${po.id}`} passHref>
                              <Button 
                                as="a" 
                                size="sm" 
                                colorScheme="blue" 
                                variant={{ base: "solid", sm: "ghost" }}
                                rightIcon={<FaArrowRight />}
                                width={{ base: "100%", sm: "auto" }}
                              >
                                Visit
                              </Button>
                            </Link>
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
