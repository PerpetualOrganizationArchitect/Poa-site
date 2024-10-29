// pages/hudson.js
import {
    Box,
    Avatar,
    Heading,
    Text,
    VStack,
    HStack,
    Link,
    IconButton,
  } from "@chakra-ui/react";
  import { FaGithub, FaTwitter, FaTelegram, FaEnvelope } from "react-icons/fa";
  
  const HudsonPage = () => {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="top"
        minH="100vh"
      >
        <Box
          bg="rgba(255, 255, 255, 0.65)" // Glass effect
          borderRadius="2xl"
          boxShadow="lg"
          backdropFilter="blur(10px)"
          p={8}
          maxW="600px"
          w="full"
          textAlign="center"
          h="fit-content"
          mt={20}
        >
          {/* Profile Picture */}
          <Avatar
            w="40%"
            h="auto"
            name="Hudson Headley"
            src="/images/hudson.png" 
            mb={6}
          />
  
          {/* Name and Title */}
          <Heading fontSize="3xl" color="blue.700">
            Hudson Headley
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Founder and Chief Architect at Poa
          </Text>
  
          {/* Bio */}
          <VStack spacing={4} mt={6} mb={6} align="start">
            <Text color="gray.700" fontSize="md" textAlign="justify">
              I'm Hudson Headley, passionate about creating decentralized,
              community-owned structures that empower individuals. My work with Poa
              focuses on building innovative governance systems and promoting worker
              ownership within DAOs. Through Poa, I aim to democratize the economy
              and design systems that align societal incentives for the greater
              good.
            </Text>
          </VStack>
  
          {/* Social & Contact Links */}
          <HStack spacing={4} justify="center">
            <Link href="https://github.com/hudsonhrh" isExternal>
              <IconButton
                aria-label="GitHub"
                icon={<FaGithub />}
                colorScheme="blue"
                size="lg"
                variant="ghost"
              />
            </Link>
            <Link href="https://twitter.com/hudsonhrh" isExternal>
              <IconButton
                aria-label="Twitter"
                icon={<FaTwitter />}
                colorScheme="blue"
                size="lg"
                variant="ghost"
              />
            </Link>
            <Link href="https://t.me/hudsonhrh" isExternal>
              <IconButton
                aria-label="Telegram"
                icon={<FaTelegram />}
                colorScheme="blue"
                size="lg"
                variant="ghost"
              />
            </Link>
            <Link href="mailto:hudson@poa.community">
              <IconButton
                aria-label="Email"
                icon={<FaEnvelope />}
                colorScheme="blue"
                size="lg"
                variant="ghost"
              />
            </Link>
          </HStack>
        </Box>
      </Box>
    );
  };
  
  export default HudsonPage;
  