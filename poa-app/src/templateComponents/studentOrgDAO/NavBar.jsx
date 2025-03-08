import React from "react";
import { Box, Flex, Image, Link, IconButton, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, VStack, Text, Button, useBreakpointValue } from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons';
import NextLink from "next/link";
import { useRouter } from "next/router";
import LoginButton from "@/components/LoginButton";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Navbar = () => {
  const router = useRouter();
  const { userDAO } = router.query;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Navigation items with icons
  const navItems = [
    { name: 'Dashboard', path: `/dashboard/?userDAO=${userDAO}` },
    { name: 'Tasks', path: `/tasks/?userDAO=${userDAO}` },
    { name: 'Voting', path: `/voting/?userDAO=${userDAO}` },
    { name: 'Learn & Earn', path: `/edu-Hub/?userDAO=${userDAO}` },
  ];

  // Function to check active route
  const isActive = (path) => {
    const basePath = '/' + (router.pathname.split('/')[1] || '');
    return basePath === '/' + (path.split('/')[1] || '');
  };

  return (
    <Box 
      bg="black" 
      p={2.5} 
      alignItems={"center"}
      position="relative"
      zIndex={100}
      width="100%"
    >
      <Flex
        alignItems="center"
        h="60px"
        maxW="100%"
        justifyContent="space-between"
      >
        <Box h="100%" w={{ base: "40%", md: "12%" }} mr={{ base: "2", md: "4" }}>
          <Link as={NextLink} href={`/home/?userDAO=${userDAO}`} passHref>
            <Image
              src="/images/high_res_poa.png"
              alt="Your Logo"
              height="113%"
              width="auto"
              objectFit="contain"
            />
          </Link>
        </Box>
        
        {/* Desktop Navigation */}
        <Flex
          justifyContent="space-between"
          flexGrow={1}
          ml={4}
          mr={4}
          alignItems="center"
          display={{ base: 'none', md: 'flex' }}
        >
          <Link as={NextLink} href={`/dashboard/?userDAO=${userDAO}`} color="white" fontWeight="extrabold" fontSize="xl" mx={"2%"}>
            Dashboard
          </Link>
          <Link
            as={NextLink}
            href={`/tasks/?userDAO=${userDAO}`}
            color="white"
            fontWeight="extrabold"
            fontSize="xl"
            mx={"2%"}
          >
            Tasks
          </Link>
          <Link
            as={NextLink}
            href={`/voting/?userDAO=${userDAO}`}
            color="white"
            fontWeight="extrabold"
            fontSize="xl"
            mx={"2%"}
          >
            Voting
          </Link>
          <Link
            as={NextLink}
            href={`/edu-Hub/?userDAO=${userDAO}`}
            color="white"
            fontWeight="extrabold"
            fontSize="xl"
            mx={"2%"}
          >
            Learn & Earn
          </Link>
          <LoginButton />
        </Flex>

        {/* Mobile Hamburger Button */}
        <IconButton
          aria-label="Open menu"
          icon={<HamburgerIcon boxSize={6} />}
          size="lg"
          color="white"
          variant="ghost"
          display={{ base: 'flex', md: 'none' }}
          onClick={onOpen}
          zIndex={20}
          position="relative"
          p={3}
          mx={1}
          _hover={{ bg: "whiteAlpha.300" }}
          _active={{ bg: "whiteAlpha.400" }}
          border="none"
          cursor="pointer"
        />
      </Flex>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay backdropFilter="blur(10px)" bg="rgba(0,0,0,0.7)" />
        <DrawerContent bg="rgba(20, 20, 25, 0.95)" backdropFilter="blur(10px)">
          <DrawerCloseButton color="white" />
          <DrawerHeader borderBottomWidth="1px" borderColor="rgba(255, 255, 255, 0.1)" color="white">
            <Flex align="center">
              <Image
                src="/images/high_res_poa.png"
                alt="PoA Logo"
                height="30px"
                width="auto"
                mr={2.5}
              />
              {userDAO}
            </Flex>
          </DrawerHeader>
          <DrawerBody p={0}>
            <VStack spacing={0} align="stretch" w="100%">
              {navItems.map((item) => (
                <Link as={NextLink} key={item.name} href={item.path} passHref>
                  <Flex 
                    p={4}
                    align="center"
                    bg={isActive(item.path) ? "rgba(101, 184, 145, 0.1)" : "transparent"}
                    borderLeft={isActive(item.path) ? "4px solid #65B891" : "4px solid transparent"}
                    transition="all 0.2s ease"
                    _hover={{ bg: "whiteAlpha.100" }}
                    onClick={onClose}
                  >
                    <Text color="white" fontWeight={isActive(item.path) ? "bold" : "normal"}>
                      {item.name}
                    </Text>
                  </Flex>
                </Link>
              ))}
            </VStack>
            
            <Box p={6} mt={4}>
              <LoginButton />
              <Text fontSize="xs" color="whiteAlpha.600" mt={6} textAlign="center">
                Powered by PoA • {new Date().getFullYear()}
              </Text>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
