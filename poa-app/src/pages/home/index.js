import React from "react";
import { useRouter } from "next/router";

import styled, { keyframes } from 'styled-components';
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
} from "@chakra-ui/react";
import Link2 from "next/link";
import Typist from "react-typist";
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";


// CSS for the wave animation
const waveAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-150px);
  }
  100% {
    transform: translateX(0);
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

const waveBackgroundStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 0,
};

const glassLayerStyle = {
  position: 'absolute',
  height: '100%',
  width: '100%',
  zIndex: -1,
  borderRadius: 'inherit',
  backdropFilter: 'blur(20px)',
  backgroundColor: 'rgba(0, 0, 0, .6)',
};

const WaveBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% + 150px);
  height: 100%;
  z-index: 0;
  animation: ${waveAnimation} 5s ease-in-out infinite;
`;

const FloatingBox = styled.div`
  width: 60%;  
  border-radius: 20px;
  display: flex;
  flexDirection: column;
  background: rgba(0, 0, 0, 0.6); 
  backdrop-filter: blur(20px);  
  boxShadow: lg;
  position: relative;
  zIndex: 1;
  margin-top: 7%;
  animation: ${floatingAnimation} 3s ease-in-out infinite;
`;

const Home = () => {
  const router = useRouter();
  const { userDAO } = router.query;


  return (
    <>
      <Navbar />
      <VStack spacing={10} style={{ position: "relative" }}>
        <WaveBackground>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <defs>
              <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="0%" stopColor="#D6BCFA" />
                <stop offset="100%" stopColor="#6495ED00" />
              </linearGradient>
            </defs>
            <path
              fill="url(#waveGradient)"
              d="M0,96L48,117.3C96,139,192,181,288,192C384,203,480,181,576,176C672,171,768,181,864,170.7C960,160,1056,128,1152,133.3C1248,139,1344,181,1392,202.7L1440,224V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z"
            />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <defs>
              <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="0%" stopColor="#D6BCFA0" />
                <stop offset="100%" stopColor="#6495ED00" />
              </linearGradient>
            </defs>
            <path
              fill="url(#waveGradient)"
              d="M0,96L48,117.3C96,139,192,181,288,192C384,203,480,181,576,176C672,171,768,181,864,170.7C960,160,1056,128,1152,133.3C1248,139,1344,181,1392,202.7L1440,224V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z"
            />
          </svg>
        </WaveBackground>
        <Box
          w="60%"
          borderRadius="2xl"
          display="flex"
          flexDirection="column"
          bg="transparent"
          boxShadow="lg"
          position="relative"
          mt="7%"
          zIndex={1}>
          <div className="glass" style={glassLayerStyle} />
          <Container centerContent>
            
            <Heading as="h1" size="2xl" color="white" mt="8">
              Welcome to {userDAO}
            </Heading>
            <Text fontSize="2xl" color="white" mt={8}>
              Brief Description will go here
            </Text>

            <Link2 href={`/user/?userDAO=${userDAO}`}>
              <Button
                size="lg"
                bg="green.300"
                mt={10}
                mb="10"
                _hover={{
                  bg: "green.500",
                  boxShadow: "md",
                  transform: "scale(1.05)",
                }}
              >
                Get Started
              </Button>
            </Link2>
          </Container>
          </Box>

        <Box
          w="40%"
          mt="4%"
          borderRadius="2xl"
          display="flex"
          flexDirection="column"
          bg="transparent"
          boxShadow="lg"
          position="relative"
          zIndex={1}
        >
          <div className="glass" style={glassLayerStyle} />
          <Container centerContent>
            <Heading mt="2%" color="ghostwhite" as="h2" size="xl">
              About {userDAO}
            </Heading>
            <Text
              ml="8%"
              mr="8%"
              mt="4%"
              mb="4%"
              color="ghostwhite"
              fontSize="lg"
              textAlign="left"
            >
             Longer Description text will go here. long long long long long long long 
            </Text>
          </Container>
        </Box>
        {/* <div style={ballStyle} className="div2">
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#fff",
              fontSize: "8em",
              fontWeight: "bolder",
              textAlign: "center",
            }}
          >
            <Typist
              cursor={{ show: false }}
              stdTypingDelay={300}
              avgTypingDelay={200}
            >
              {userDAO}
            </Typist>
          </div>
        </div> */}
      </VStack>
    </>
  );
};

export default Home;
