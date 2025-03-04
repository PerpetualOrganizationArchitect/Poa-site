import { useEffect, useState } from 'react';
import { getSortedPostsData } from '../../util/posts';
import { 
  Flex, 
  Box, 
  Heading, 
  Text, 
  SimpleGrid, 
  useColorModeValue, 
  Icon,
  VStack,
  Container,
  Tag,
  Divider,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import Layout from '../../components/Layout';
import SideBar from '../../components/docs/SideBar';
import { FaBook, FaVoteYea, FaInfoCircle, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

export default function Home({ allPostsData }) {
  const [isClient, setIsClient] = useState(false);
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  // Category colors
  const categoryColors = {
    'Get Started': 'green',
    'Voting': 'purple',
    'Blog': 'blue'
  };

  // Card design values
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  // Hero section background
  const heroBg = useColorModeValue('blue.50', 'blue.900');
  const heroGradient = useColorModeValue(
    'linear(to-r, blue.50, purple.50)',
    'linear(to-r, blue.900, purple.900)'
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Custom title mapping
  const customTitles = {
    'create': 'Creating a PO',
    'join': 'Joining a PO',
    'perpetualOrganization': 'What is a Perpetual Organization?',
    'hybridVoting': 'Hybrid Voting',
    'contributionVoting': 'Contribution Based Voting',
    'directDemocracy': 'Direct Democracy',
    'AlphaV1': 'Alpha V1',
    'TheGraph': 'The Graph'
  };

  // Group posts by category with custom order
  const getStartedPosts = allPostsData
    .filter(post => 
      post.id === 'perpetualOrganization' || post.id === 'create' || post.id === 'join'
    )
    .sort((a, b) => {
      // Custom sort order: perpetualOrganization, create, join
      const order = {
        'perpetualOrganization': 1,
        'create': 2,
        'join': 3
      };
      return order[a.id] - order[b.id];
    });
  
  const votingPosts = allPostsData.filter(post => 
    post.id === 'hybridVoting' || post.id === 'contributionVoting' || post.id === 'directDemocracy'
  );
  
  const blogPosts = allPostsData.filter(post => 
    post.id === 'AlphaV1' || post.id === 'TheGraph' || post.category === 'Features'
  );

  // Other posts - for anything that doesn't fit in the categories above
  const otherPosts = allPostsData.filter(post => 
    !getStartedPosts.includes(post) && 
    !votingPosts.includes(post) && 
    !blogPosts.includes(post) &&
    post.id !== 'test' && 
    post.id !== 'test2' &&
    post.id !== 'letsSee'
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Render a category section
  const renderCategorySection = (title, posts, icon) => {
    if (posts.length === 0) return null;
    
    return (
      <VStack align="stretch" spacing={6} width="100%" mb={10}>
        <Flex 
          align="center" 
          mb={4} 
          pb={2}
          borderBottomWidth="2px" 
          borderBottomColor={`${categoryColors[title]}.400`}
        >
          <Icon as={icon} mr={3} color={`${categoryColors[title]}.400`} boxSize={7} />
          <Heading 
            size="xl" 
            color="white" 
            fontWeight="bold" 
            letterSpacing="tight"
          >
            {title}
          </Heading>
        </Flex>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {posts.map(({ id, date, title, description }) => (
            <Link href={`/docs/${id}`} key={id} passHref>
              <MotionBox
                variants={itemVariants}
                whileHover={{ 
                  y: -5, 
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                as="a"
                display="flex"
                flexDir="column"
                height="100%"
                p={6}
                borderWidth="1px"
                borderRadius="xl"
                bg="white"
                borderColor="#e2d6ca"
                boxShadow="sm"
                transition="all 0.3s ease"
                position="relative"
                overflow="hidden"
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  bg: categoryColors[title] ? `${categoryColors[title]}.500` : 'blue.500'
                }}
              >
                <Heading size="md" mb={2} fontWeight="bold">
                  {customTitles[id] || title}
                </Heading>
                
                {description && (
                  <Text color="gray.600" mb={4} flex="1">
                    {description}
                  </Text>
                )}
                
                <Flex 
                  mt="auto"
                  align="center" 
                  color={`${categoryColors[title] || 'blue'}.500`}
                  fontWeight="medium"
                >
                  Read more <Icon as={FaArrowRight} ml={1} fontSize="xs" />
                </Flex>
              </MotionBox>
            </Link>
          ))}
        </SimpleGrid>
      </VStack>
    );
  };

  const getStartedLabel = () => (
    <Flex align="center" mb={6} mt={6}>
      <Box 
        bg="rgba(0, 0, 0, 0.7)" 
        p={2} 
        borderRadius="md" 
        mr={3}
      >
        <Icon as={FaBook} color="green.300" boxSize={5} />
      </Box>
      <Heading 
        size="lg" 
        color="black" 
        fontWeight="bold"
      >
        Get Started
      </Heading>
    </Flex>
  );

  const votingLabel = () => (
    <Flex align="center" mb={6} mt={10}>
      <Box 
        bg="rgba(0, 0, 0, 0.7)" 
        p={2} 
        borderRadius="md" 
        mr={3}
      >
        <Icon as={FaVoteYea} color="purple.300" boxSize={5} />
      </Box>
      <Heading 
        size="lg" 
        color="black" 
        fontWeight="bold"
      >
        Voting
      </Heading>
    </Flex>
  );

  const blogLabel = () => (
    <Flex align="center" mb={6} mt={10}>
      <Box 
        bg="rgba(0, 0, 0, 0.7)" 
        p={2} 
        borderRadius="md" 
        mr={3}
      >
        <Icon as={FaInfoCircle} color="blue.300" boxSize={5} />
      </Box>
      <Heading 
        size="lg" 
        color="black" 
        fontWeight="bold"
      >
        Blog
      </Heading>
    </Flex>
  );

  return (
    <Layout>
      <Box>
        {isClient && (
          <Flex direction={{ base: 'column', md: 'row' }} maxWidth="1400px" mx="auto">
            <Box display={{ base: 'none', md: 'block' }}>
              <SideBar />
            </Box>
            
            <Box flex="1" px={{ base: 4, md: 8 }} pt={{ base: 4, md: 4 }} pb={10}>
              {/* Hero Section */}
              <MotionFlex
                direction="column"
                align="center"
                justify="center"
                textAlign="center"
                bg="rgba(0, 0, 0, 0.8)"
                backdropFilter="blur(10px)"
                borderRadius="xl"
                p={{ base: 8, md: 12 }}
                mb={12}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                boxShadow="md"
                borderWidth="1px"
                borderColor="rgba(255, 255, 255, 0.1)"
              >
                <Heading 
                  as="h1" 
                  size="2xl" 
                  mb={4} 
                  color="white"
                  fontWeight="extrabold"
                  letterSpacing="tight"
                >
                  Perpetual Organizations Documentation
                </Heading>
                <Text 
                  fontSize="xl" 
                  maxW="3xl" 
                  color="gray.300"
                  mb={6}
                >
                  Everything you need to know about creating, joining, and participating in Perpetual Organizations
                </Text>
                <Flex gap={4} wrap="wrap" justify="center">
                  <Link href="/docs/create" passHref>
                    <Button 
                      colorScheme="blue" 
                      size="lg" 
                      leftIcon={<Icon as={FaBook} />}
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/docs/hybrid-voting" passHref>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      leftIcon={<Icon as={FaVoteYea} />}
                      bg="transparent"
                      color="white"
                      borderColor="white"
                      _hover={{ bg: "whiteAlpha.200" }}
                    >
                      Learn about Voting
                    </Button>
                  </Link>
                </Flex>
              </MotionFlex>
              
              <Container maxW="container.xl" p={0}>
                <MotionBox
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Get Started Section */}
                  {getStartedLabel()}
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {getStartedPosts.map(post => (
                      <Link href={`/docs/${post.id}`} key={post.id} passHref>
                        <MotionBox
                          variants={itemVariants}
                          whileHover={{ 
                            y: -5, 
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                          }}
                          as="a"
                          display="flex"
                          flexDir="column"
                          height="100%"
                          p={6}
                          borderWidth="1px"
                          borderRadius="xl"
                          bg="white"
                          borderColor="#e2d6ca"
                          boxShadow="sm"
                          transition="all 0.3s ease"
                          position="relative"
                          overflow="hidden"
                          _before={{
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '4px',
                            bg: 'green.500'
                          }}
                        >
                          <Heading size="md" mb={2} fontWeight="bold">
                            {customTitles[post.id] || post.title}
                          </Heading>
                          
                          {post.description && (
                            <Text color="gray.600" mb={4} flex="1">
                              {post.description}
                            </Text>
                          )}
                          
                          <Flex 
                            mt="auto"
                            align="center" 
                            color="green.500"
                            fontWeight="medium"
                          >
                            Read more <Icon as={FaArrowRight} ml={1} fontSize="xs" />
                          </Flex>
                        </MotionBox>
                      </Link>
                    ))}
                  </SimpleGrid>

                  {/* Voting Section */}
                  {votingLabel()}
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {votingPosts.map(post => (
                      <Link href={`/docs/${post.id}`} key={post.id} passHref>
                        <MotionBox
                          variants={itemVariants}
                          whileHover={{ 
                            y: -5, 
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                          }}
                          as="a"
                          display="flex"
                          flexDir="column"
                          height="100%"
                          p={6}
                          borderWidth="1px"
                          borderRadius="xl"
                          bg="white"
                          borderColor="#e2d6ca"
                          boxShadow="sm"
                          transition="all 0.3s ease"
                          position="relative"
                          overflow="hidden"
                          _before={{
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '4px',
                            bg: 'purple.500'
                          }}
                        >
                          <Heading size="md" mb={2} fontWeight="bold">
                            {customTitles[post.id] || post.title}
                          </Heading>
                          
                          {post.description && (
                            <Text color="gray.600" mb={4} flex="1">
                              {post.description}
                            </Text>
                          )}
                          
                          <Flex 
                            mt="auto"
                            align="center" 
                            color="purple.500"
                            fontWeight="medium"
                          >
                            Read more <Icon as={FaArrowRight} ml={1} fontSize="xs" />
                          </Flex>
                        </MotionBox>
                      </Link>
                    ))}
                  </SimpleGrid>

                  {/* Blog Section */}
                  {blogPosts.length > 0 && (
                    <>
                      {blogLabel()}
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                        {blogPosts.map(post => (
                          <Link href={`/docs/${post.id}`} key={post.id} passHref>
                            <MotionBox
                              variants={itemVariants}
                              whileHover={{ 
                                y: -5, 
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                              }}
                              as="a"
                              display="flex"
                              flexDir="column"
                              height="100%"
                              p={6}
                              borderWidth="1px"
                              borderRadius="xl"
                              bg="white"
                              borderColor="#e2d6ca"
                              boxShadow="sm"
                              transition="all 0.3s ease"
                              position="relative"
                              overflow="hidden"
                              _before={{
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '4px',
                                bg: 'blue.500'
                              }}
                            >
                              <Heading size="md" mb={2} fontWeight="bold">
                                {customTitles[post.id] || post.title}
                              </Heading>
                              
                              {post.description && (
                                <Text color="gray.600" mb={4} flex="1">
                                  {post.description}
                                </Text>
                              )}
                              
                              <Flex 
                                mt="auto"
                                align="center" 
                                color="blue.500"
                                fontWeight="medium"
                              >
                                Read more <Icon as={FaArrowRight} ml={1} fontSize="xs" />
                              </Flex>
                            </MotionBox>
                          </Link>
                        ))}
                      </SimpleGrid>
                    </>
                  )}
                </MotionBox>
              </Container>
            </Box>
          </Flex>
        )}
      </Box>
    </Layout>
  );
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData
    }
  };
}
