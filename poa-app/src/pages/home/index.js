import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled, { keyframes, css } from 'styled-components';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  Container,
  Image,
  Link,
  useBreakpointValue,
  HStack,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useColorModeValue,
  Divider,
  Badge,
  chakra,
} from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons';
import Link2 from "next/link";
import Typist from "react-typist";
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";
import { usePOContext } from "@/context/POContext";
import { useIPFScontext } from "@/context/ipfsContext";

// CSS for the wave animation (slowed down and more subtle)
const waveAnimation = keyframes`
  0% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(-50px) translateY(15px);
  }
  100% {
    transform: translateX(0) translateY(0);
  }
`;

// CSS for the floating effect
const floatingAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`;

// Subtle pulse animation for buttons and interactive elements
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
  }
`;

// Fade-in animation for content
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Improved wave background with original color scheme
const WaveBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: linear-gradient(135deg, #f8d49f 0%, #eebba9 50%, #e6a4bc 100%);
  overflow: hidden;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 150%;
    height: 150%;
    top: -25%;
    left: -25%;
    background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
    animation: ${waveAnimation} 15s ease-in-out infinite;
  }
  
  &::after {
    top: 30%;
    left: 20%;
    background: radial-gradient(ellipse at center, rgba(232, 161, 232, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
    animation-delay: -5s;
    animation-duration: 20s;
  }
  
  @media (max-width: 768px) {
    height: 100%;
    &::before, &::after {
      opacity: 0.6;
    }
  }
`;

// Styled components with animations
const AnimatedBox = styled(Box)`
  animation: ${fadeIn} 0.8s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  opacity: 0;
`;

const PulseButton = styled(Button)`
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    animation: ${pulseAnimation} 2s infinite;
    box-shadow: 0 0 15px rgba(91, 212, 199, 0.5);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

// Card design with glass morphism effect - update colors to match new scheme
const GlassCard = styled(Box)`
  background: rgba(35, 30, 25, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 92%;
    margin: 0 auto;
    background: rgba(25, 20, 15, 0.9);
  }
`;

// Second card with darker background
const DarkGlassCard = styled(Box)`
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 92%;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.92);
  }
`;

// Custom mobile-friendly navigation with improved styling
const MobileNav = ({ userDAO }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <>
      <Flex 
        as="nav" 
        align="center" 
        justify="space-between" 
        wrap="wrap" 
        w="100%" 
        p={3} 
        bg="rgba(25, 20, 15, 0.95)"
        backdropFilter="blur(8px)"
        position="fixed"
        top={0}
        left={0}
        zIndex={10}
        borderBottom="1px solid rgba(255, 255, 255, 0.2)"
      >
        <Flex align="center">
          <Image
            src="/poa-logo.png"
            alt="PoA Logo"
            borderRadius="full"
            boxSize="28px"
            mr={2}
            fallbackSrc="https://via.placeholder.com/28"
            border="1px solid #ffffff"
            p="2px"
          />
          <Text 
            fontWeight="bold" 
            fontSize="md" 
            color="white"
            letterSpacing="wide"
          >
            {userDAO}
          </Text>
        </Flex>
        
        <IconButton
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          size="sm"
          color="white"
          variant="ghost"
          _hover={{ bg: "rgba(255, 255, 255, 0.2)" }}
          onClick={onOpen}
        />
      </Flex>
      
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay backdropFilter="blur(8px)" bg="rgba(0,0,0,0.5)" />
        <DrawerContent bg="rgba(59, 52, 42, 0.95)" backdropFilter="blur(10px)">
          <DrawerCloseButton color="white" />
          <DrawerHeader borderBottomWidth="1px" borderColor="rgba(255, 255, 255, 0.2)" color="white">
            {userDAO} Menu
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={6}>
              <Link2 href={`/dashboard/?userDAO=${userDAO}`}>
                <Button 
                  w="100%" 
                  variant="outline" 
                  color="white"
                  borderColor="rgba(255, 255, 255, 0.3)"
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  leftIcon={<span>📊</span>}
                >
                  Dashboard
                </Button>
              </Link2>
              <Link2 href={`/tasks/?userDAO=${userDAO}`}>
                <Button 
                  w="100%" 
                  variant="outline" 
                  color="white"
                  borderColor="rgba(255, 255, 255, 0.3)"
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  leftIcon={<span>✅</span>}
                >
                  Tasks
                </Button>
              </Link2>
              <Link2 href={`/voting/?userDAO=${userDAO}`}>
                <Button 
                  w="100%" 
                  variant="outline" 
                  color="white"
                  borderColor="rgba(255, 255, 255, 0.3)"
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  leftIcon={<span>🗳️</span>}
                >
                  Voting
                </Button>
              </Link2>
              <Link2 href={`/learn/?userDAO=${userDAO}`}>
                <Button 
                  w="100%" 
                  variant="outline" 
                  color="white"
                  borderColor="rgba(255, 255, 255, 0.3)"
                  _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                  leftIcon={<span>📚</span>}
                >
                  Learn & Earn
                </Button>
              </Link2>
              
              <Divider borderColor="rgba(255, 255, 255, 0.2)" />
              
              <Link2 href={`/user/?userDAO=${userDAO}`}>
                <PulseButton
                  w="100%"
                  bg="#65B891"
                  color="white"
                  fontWeight="bold"
                  _hover={{ bg: "#4C9A7A" }}
                  mt={2}
                >
                  Join or Connect
                </PulseButton>
              </Link2>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const Home = () => {
  const{logoHash, poDescription, poLinks} = usePOContext();

  const router = useRouter();
  const { userDAO } = router.query;

  const { fetchImageFromIpfs } = useIPFScontext();

  const [image, setImage] = useState(null);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isLoaded, setIsLoaded] = useState(false);

  // Check and log poLinks to debug
  useEffect(() => {
    console.log('poLinks type:', typeof poLinks, poLinks);
  }, [poLinks]);

  useEffect(() => {
    const fetchImage = async () => {
      console.log('logoHash', logoHash);
      if (logoHash) {
        const imageUrl = await fetchImageFromIpfs(logoHash);
        setImage(imageUrl);
      }
    };

    fetchImage();
    
    // Set loaded state after a short delay for animations
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [logoHash]);

  return (
    <>
      {isMobile ? <MobileNav userDAO={userDAO} /> : <Navbar />}
      
      <WaveBackground />
      
      <Box 
        pt={{ base: "65px", md: "20px" }} 
        position="relative" 
        minH="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <VStack 
          spacing={{ base: 6, md: 10 }} 
          w="100%" 
          px={4} 
          py={{ base: 6, md: 10 }}
          maxW="1200px"
          mx="auto"
        >
          <AnimatedBox 
            delay="0.1s" 
            width={{ base: "92%", md: "65%" }}
            display={isLoaded ? "block" : "none"}
          >
            <GlassCard p={{ base: 6, md: 8 }}>
              <VStack spacing={5} align="center">
                <Heading 
                  as="h1" 
                  fontSize={{ base: "2xl", md: "4xl" }} 
                  color="white" 
                  textAlign="center"
                  letterSpacing="tight"
                  fontWeight="extrabold"
                  textShadow="0 2px 4px rgba(0,0,0,0.3)"
                >
                  Welcome to {userDAO}
                </Heading>
                
                <Text 
                  fontSize={{ base: "md", md: "lg" }} 
                  color="white" 
                  textAlign="center"
                  px={{ base: 1, md: 6 }}
                  lineHeight="tall"
                  fontWeight="medium"
                  letterSpacing="0.3px"
                  textShadow="0 1px 2px rgba(0,0,0,0.2)"
                >
                  A Perpetual Organization built with Poa. Fully owned and controlled 
                  by the {userDAO} community itself. Learn more about how to build your 
                  own censorship-resistant, fully community-owned organization at
                </Text>
                
                <Link2 href="https://poa.community">
                  <Text 
                    color="#ffffff" 
                    textAlign="center" 
                    fontSize={{ base: "md", md: "md" }}
                    fontWeight="bold"
                    textDecoration="underline"
                    _hover={{ color: "#f0f0f0" }}
                    transition="all 0.3s ease"
                    textShadow="0 1px 2px rgba(0,0,0,0.3)"
                  >
                    poa.community
                  </Text>
                </Link2>
                
                <Link2 href={`/user/?userDAO=${userDAO}`}>
                  <PulseButton
                    size={{ base: "md", md: "lg" }}
                    bg="#65B891"
                    color="white"
                    _hover={{ bg: "#4C9A7A" }}
                    px={{ base: 6, md: 8 }}
                    py={6}
                    borderRadius="full"
                    fontWeight="bold"
                    letterSpacing="wide"
                    mt={2}
                    boxShadow="0 4px 8px rgba(0, 0, 0, 0.3)"
                  >
                    Join or Login
                  </PulseButton>
                </Link2>
                
                <HStack mt={2} spacing={2} wrap="wrap" justify="center">
                  <Badge bg="rgba(0, 0, 0, 0.4)" color="white" px={3} py={1} borderRadius="full" fontWeight="medium">Decentralized</Badge>
                  <Badge bg="rgba(0, 0, 0, 0.4)" color="white" px={3} py={1} borderRadius="full" fontWeight="medium">Community-Owned</Badge>
                  <Badge bg="rgba(0, 0, 0, 0.4)" color="white" px={3} py={1} borderRadius="full" fontWeight="medium">Transparent</Badge>
                </HStack>
              </VStack>
            </GlassCard>
          </AnimatedBox>

          <AnimatedBox 
            delay="0.3s" 
            width={{ base: "92%", md: "65%" }}
            display={isLoaded ? "block" : "none"}
          >
            <DarkGlassCard p={{ base: 6, md: 8 }}>
              <VStack spacing={5} align="center">
                <Heading 
                  as="h2" 
                  fontSize={{ base: "xl", md: "2xl" }} 
                  color="white"
                  textAlign="center"
                  fontWeight="bold"
                  letterSpacing="wide"
                  textShadow="0 2px 4px rgba(0,0,0,0.3)"
                >
                  About {userDAO}
                </Heading>
                
                <Text
                  fontSize={{ base: "md", md: "md" }}
                  color="white"
                  textAlign="left"
                  lineHeight="tall"
                  fontWeight="medium"
                  letterSpacing="0.3px"
                  textShadow="0 1px 2px rgba(0,0,0,0.2)"
                >
                  {poDescription}
                </Text>
                
                {image && (
                  <Box 
                    bg="rgba(255, 255, 255, 0.1)" 
                    p={4} 
                    borderRadius="xl" 
                    width={{ base: "70%", md: "50%" }}
                    mx="auto"
                    mt={4}
                    border="1px solid rgba(255, 255, 255, 0.2)"
                    transition="all 0.3s ease"
                    boxShadow="0 4px 12px rgba(0, 0, 0, 0.3)"
                    _hover={{
                      transform: "scale(1.02)",
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    <Image
                      src={image}
                      alt="Organization Logo"
                      width="100%"
                      height="auto"
                      borderRadius="md"
                    />
                  </Box>
                )}
                
                {/* Social links or quick access buttons */}
                <HStack spacing={4} mt={2} wrap="wrap" justify="center">
                  {poLinks && Array.isArray(poLinks) && poLinks.length > 0 ? (
                    poLinks.map((link, index) => (
                      <Link2 href={link.url} key={index}>
                        <Button
                          size="sm"
                          variant="outline"
                          color="white"
                          borderColor="rgba(255, 255, 255, 0.3)"
                          _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
                          leftIcon={<span>{link.icon || '🔗'}</span>}
                          fontWeight="medium"
                        >
                          {link.name || 'Link'}
                        </Button>
                      </Link2>
                    ))
                  ) : (
                    // Render nothing if poLinks is not an array or empty
                    null
                  )}
                </HStack>
              </VStack>
            </DarkGlassCard>
          </AnimatedBox>
          
          <Text 
            fontSize="xs" 
            color="rgba(0, 0, 0, 0.8)" 
            fontWeight="bold"
            textAlign="center"
            mt={8}
            display={isLoaded ? "block" : "none"}
            textShadow="0 1px 0 rgba(255,255,255,0.2)"
          >
            Powered by Poa • Built on Blockchain • Designed for Community
          </Text>
        </VStack>
      </Box>
    </>
  );
};

export default Home;
