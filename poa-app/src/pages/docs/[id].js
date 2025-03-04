import { useEffect, useState } from 'react';
import { getPostData, getAllPostIds } from '../../util/posts';
import { 
  Box, 
  Text, 
  Flex, 
  VStack,
  Heading,
  Container,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useBreakpointValue,
  useColorModeValue,
  Button,
  Divider,
  HStack,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  Tag
} from '@chakra-ui/react';
import Layout from '../../components/Layout';
import SideBar from '../../components/docs/SideBar';
import { FaHome, FaChevronRight, FaBars, FaArrowLeft, FaArrowRight, FaBook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Motion components
const MotionBox = motion(Box);
const MotionText = motion(Text);

export default function Post({ postData, navigationData }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showSidebar = useBreakpointValue({ base: false, md: true });
  
  // Design tokens
  const contentBg = useColorModeValue('white', 'gray.800');
  const contentBorder = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const breadcrumbColor = useColorModeValue('gray.500', 'gray.400');
  
  // Extract navigation links
  const { prev, next } = navigationData || { prev: null, next: null };

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Functions to determine category for current post
  const getCategory = (id) => {
    if (['create', 'perpetualOrganization', 'join'].includes(id)) return 'Get Started';
    if (['hybridVoting', 'contributionVoting', 'directDemocracy'].includes(id)) return 'Voting';
    if (['AlphaV1', 'TheGraph'].includes(id)) return 'Features';
    return 'Documentation';
  };

  const getCategoryColor = (category) => {
    const categoryColors = {
      'Get Started': 'green',
      'Voting': 'purple',
      'Features': 'blue'
    };
    return categoryColors[category] || 'blue';
  };

  const currentCategory = getCategory(postData.id);
  const categoryColor = getCategoryColor(currentCategory);

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Layout>
      <Box>
        {isClient && (
          <Flex direction={{ base: 'column', md: 'row' }} maxWidth="1400px" mx="auto">
            {/* Mobile Sidebar Drawer */}
            {!showSidebar && (
              <>
                <IconButton
                  aria-label="Open navigation"
                  icon={<FaBars />}
                  position="fixed"
                  top="80px"
                  left="20px"
                  zIndex={20}
                  onClick={onOpen}
                  colorScheme="blue"
                  variant="outline"
                />
                
                <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                  <DrawerOverlay />
                  <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">
                      Documentation
                    </DrawerHeader>
                    <DrawerBody>
                      <SideBar />
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              </>
            )}
            
            {/* Desktop Sidebar */}
            {showSidebar && (
              <Box display={{ base: 'none', md: 'block' }}>
                <SideBar />
              </Box>
            )}
            
            {/* Main Content */}
            <Box flex="1" px={{ base: 4, md: 8 }} pt={{ base: 24, md: 6 }} pb={10}>
              <Container maxW="container.md">
                {/* Breadcrumb Navigation */}
                <Breadcrumb 
                  separator={<Icon as={FaChevronRight} color={breadcrumbColor} fontSize="xs" />}
                  mb={6}
                  color={breadcrumbColor}
                  fontSize="sm"
                >
                  <BreadcrumbItem>
                    <BreadcrumbLink as={Link} href="/" passHref>
                      <Flex align="center">
                        <Icon as={FaHome} mr={1} />
                        Home
                      </Flex>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  
                  <BreadcrumbItem>
                    <BreadcrumbLink as={Link} href="/docs" passHref>
                      Documentation
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  
                  <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink>{postData.title || postData.id}</BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
                
                {/* Document Header */}
                <MotionBox
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  mb={8}
                >
                  <Tag 
                    size="md" 
                    colorScheme={categoryColor} 
                    borderRadius="full" 
                    mb={3}
                  >
                    {currentCategory}
                  </Tag>
                  <Heading 
                    as="h1" 
                    size="2xl" 
                    color={headingColor}
                    fontWeight="bold"
                    lineHeight="1.2"
                    mb={4}
                  >
                    {postData.title || postData.id}
                  </Heading>
                  
                  {postData.date && (
                    <Text 
                      color={breadcrumbColor} 
                      fontSize="md"
                    >
                      Last updated: {new Date(postData.date).toLocaleDateString()}
                    </Text>
                  )}
                </MotionBox>
                
                {/* Main Content */}
                <MotionBox
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  p={8}
                  borderRadius="xl"
                  bg={contentBg}
                  borderWidth="1px"
                  borderColor={contentBorder}
                  boxShadow="md"
                  mb={8}
                >
                  <MotionText
                    className="markdown-content"
                    color={textColor}
                    fontSize="lg"
                    lineHeight="1.8"
                    sx={{
                      '& h1': {
                        fontSize: '2xl',
                        fontWeight: 'bold',
                        mt: 8,
                        mb: 4,
                        color: headingColor,
                      },
                      '& h2': {
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        mt: 6,
                        mb: 3,
                        color: headingColor,
                      },
                      '& h3': {
                        fontSize: 'lg',
                        fontWeight: 'bold',
                        mt: 5,
                        mb: 2,
                        color: headingColor,
                      },
                      '& p': {
                        my: 4,
                      },
                      '& ul, & ol': {
                        ml: 6,
                        mb: 4,
                      },
                      '& li': {
                        mb: 2,
                      },
                      '& code': {
                        bg: useColorModeValue('gray.100', 'gray.700'),
                        px: 1,
                        borderRadius: 'md',
                        fontSize: 'sm',
                      },
                      '& pre': {
                        bg: useColorModeValue('gray.100', 'gray.700'),
                        p: 4,
                        borderRadius: 'md',
                        overflowX: 'auto',
                        my: 4,
                      },
                      '& blockquote': {
                        borderLeftWidth: '4px',
                        borderLeftColor: `${categoryColor}.500`,
                        pl: 4,
                        py: 1,
                        my: 4,
                        bg: useColorModeValue('gray.50', 'gray.700'),
                        borderRadius: 'md',
                      },
                      '& a': {
                        color: `${categoryColor}.500`,
                        textDecoration: 'underline',
                        _hover: {
                          textDecoration: 'none',
                        },
                      },
                      '& img': {
                        maxWidth: '100%',
                        borderRadius: 'md',
                        my: 4,
                      },
                      '& table': {
                        width: '100%',
                        my: 4,
                        borderWidth: '1px',
                        borderRadius: 'md',
                      },
                      '& th': {
                        bg: useColorModeValue('gray.100', 'gray.700'),
                        p: 2,
                        fontWeight: 'bold',
                      },
                      '& td': {
                        p: 2,
                        borderTopWidth: '1px',
                      },
                    }}
                    dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
                  />
                </MotionBox>
                
                {/* Next/Previous Navigation */}
                <Flex 
                  justifyContent="space-between" 
                  alignItems="center" 
                  mt={8}
                  flexWrap="wrap"
                  gap={4}
                >
                  {prev ? (
                    <Link href={`/docs/${prev.id}`} passHref>
                      <Button 
                        as="a"
                        leftIcon={<FaArrowLeft />}
                        variant="outline"
                        colorScheme={categoryColor}
                        size="md"
                      >
                        Previous: {prev.title || prev.id}
                      </Button>
                    </Link>
                  ) : (
                    <Box />
                  )}
                  
                  <Link href="/docs" passHref>
                    <Button 
                      as="a"
                      leftIcon={<FaBook />}
                      colorScheme="gray"
                      size="md"
                      variant="outline"
                    >
                      All Documentation
                    </Button>
                  </Link>
                  
                  {next ? (
                    <Link href={`/docs/${next.id}`} passHref>
                      <Button 
                        as="a"
                        rightIcon={<FaArrowRight />}
                        colorScheme={categoryColor}
                        size="md"
                      >
                        Next: {next.title || next.id}
                      </Button>
                    </Link>
                  ) : (
                    <Box />
                  )}
                </Flex>
              </Container>
            </Box>
          </Flex>
        )}
      </Box>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  
  // Get navigation data
  const allPostIds = getAllPostIds().map(path => path.params.id);
  const currentIndex = allPostIds.indexOf(params.id);
  
  const navigationData = {
    prev: currentIndex > 0 ? { id: allPostIds[currentIndex - 1] } : null,
    next: currentIndex < allPostIds.length - 1 ? { id: allPostIds[currentIndex + 1] } : null
  };
  
  return {
    props: {
      postData,
      navigationData
    },
  };
}
