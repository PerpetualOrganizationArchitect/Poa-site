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
  import { RiTwitterXLine } from "react-icons/ri";
  import Navigation from "@/components/Navigation";
  
  const HudsonPage = () => {
    return (
    <>
     <Navigation />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="top"
        minH="100vh"
      >
        <Box
          bg="rgba(255, 255, 255, 0.65)" 
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
          <VStack spacing={4} p="6" align="start">
          <Text color="gray.700" fontSize="md" textAlign="justify">
            Hudson is a Protocol Engineer passionate about decentralization, worker ownership, and governance design. 
            He has been involved with developing many DAOs with various models and is currently developing Poa, a no-code DAO builder geared towards organizations that are fully owned by the community and not by capital. 
            Hudson hopes to build a space for founders interested in community ownership to experiment and innovate quickly with new governance models.
            <br /><br />
            Hudson is also a non-resident fellow at the IDI, where he contributes to governance research, design, and implementation.
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
                icon={<RiTwitterXLine />}
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
    </>
    );
  };
  
  export default HudsonPage;
  