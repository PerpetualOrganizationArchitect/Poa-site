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
    'Features': 'blue'
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

  // Group posts by category
  const getStartedPosts = allPostsData.filter(post => 
    post.id === 'create' || post.id === 'perpetualOrganization' || post.id === 'join'
  );
  
  const votingPosts = allPostsData.filter(post => 
    post.id === 'hybridVoting' || post.id === 'contributionVoting' || post.id === 'directDemocracy'
  );
  
  const featurePosts = allPostsData.filter(post => 
    post.id === 'AlphaV1' || post.id === 'TheGraph'
  );

  // Other posts - for anything that doesn't fit in the categories above
  const otherPosts = allPostsData.filter(post => 
    !getStartedPosts.includes(post) && 
    !votingPosts.includes(post) && 
    !featurePosts.includes(post) &&
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
        <Flex align="center" mb={2}>
          <Icon as={icon} mr={2} color={`${categoryColors[title]}.500`} />
          <Heading size="lg" color={headingColor} fontWeight="bold" letterSpacing="tight">
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
                <Tag 
                  size="sm" 
                  colorScheme={categoryColors[title] || 'blue'} 
                  alignSelf="flex-start" 
                  mb={3}
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {title}
                </Tag>
                
                <Heading size="md" mb={2} fontWeight="bold">
                  {title}
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
                bg={heroBg}
                bgGradient="linear(to-r, #f5e6d8, #fad2d2)"
                borderRadius="xl"
                p={{ base: 8, md: 12 }}
                mb={12}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                boxShadow="sm"
              >
                <Heading 
                  as="h1" 
                  size="2xl" 
                  mb={4} 
                  color="blue.600"
                  fontWeight="extrabold"
                  letterSpacing="tight"
                >
                  Perpetual Organizations Documentation
                </Heading>
                <Text 
                  fontSize="xl" 
                  maxW="3xl" 
                  color="gray.700"
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
                      colorScheme="purple" 
                      variant="outline" 
                      size="lg" 
                      leftIcon={<Icon as={FaVoteYea} />}
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
                  {renderCategorySection('Get Started', getStartedPosts, FaBook)}
                  {renderCategorySection('Voting', votingPosts, FaVoteYea)}
                  {renderCategorySection('Features', featurePosts, FaInfoCircle)}
                  {otherPosts.length > 0 && renderCategorySection('Other Resources', otherPosts, FaBook)}
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
