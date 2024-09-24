import React, { useEffect, useRef } from 'react';
import { Box, Spinner, Center, Grid, GridItem, Heading, Text, Link, Flex, Button } from '@chakra-ui/react';
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";
import { usePOContext } from '@/context/POContext';
import QuizModal from '@/components/eduHub/QuizModal';

// Glass layer style
const glassLayerStyle = {
  backdropFilter: 'blur(20px)',
  backgroundColor: 'rgba(0, 0, 0, 0.73)', // Adjust opacity for glass effect
  border: '1px solid rgba(255, 255, 255, 0.25)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const EducationHub = () => {
  const { poContextLoading } = usePOContext();
  const containerRef = useRef();

  const educationModels = [
    {
      id: 1,
      title: 'Learn More About Demo Org',
      link: 'https://example.com/demo-org',
      payout: '10 Tokens',
      description: 'Learn more about this organization even though it is just a demo org.',
      quizLink: '/quiz/demo-org',
    },
    {
      id: 2,
      title: 'How to Deploy a Perpetual Organization',
      link: 'https://example.com/deploy-perpetual-org',
      payout: '10 Tokens',
      description: 'Interested in launching your own? We guide you step-by-step through the process of deploying a Perpetual Organization.',
      quizLink: '/quiz/deploy-perpetual-org',
    },
    {
      id: 3,
      title: 'What is a Perpetual Organization?',
      link: 'https://example.com/what-is-perpetual-org',
      payout: '15 Tokens',
      description: 'A Perpetual Organization is a decentralized, self-sustaining group that empowers its members to own and manage their work collaboratively. Learn more about how Perpetual Organizations empower your community.',
      quizLink: '/quiz/what-is-perpetual-org',
    },
  ];

  return (
    <>
      <Navbar />
      {poContextLoading ? (
        <Center height="90vh">
          <Spinner size="xl" />
        </Center>
      ) : (
        <Box position="relative" ref={containerRef}>
          {/* Glass Layer for Heading and Description */}
          <Box
            p={5}
            sx={glassLayerStyle}
            borderRadius="lg"
            mx="auto"
            mt={6}
            maxWidth="800px"
            textAlign="center"
          >
            <Heading as="h2" size="lg" color="white" mb={3}>
              Education Hub
            </Heading>
            <Text fontSize="lg" color="gray.100">
              Learn and take short quizzes to earn tokens
            </Text>
          </Box>

          <Box p={6} bg="transparent" borderRadius="lg" mx="auto" mt={2} maxWidth="1200px">
            {/* Responsive Grid for Education Models */}
            <Grid 
              templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} // Adjust columns based on screen size
              gap={8}
            >
              {educationModels.map(model => (
                <GridItem
                  key={model.id}
                  borderRadius="md"
                  p={6}
                  sx={glassLayerStyle}
                  transition="all 0.3s ease"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Box mb={6}>
                    <Heading as="h3" fontSize="27" mb={6} color="white">
                      {model.title}
                    </Heading>
                    <Text fontSize="16" color="gray.200">
                      {model.description}
                    </Text>
                  </Box>
                  <Box mt="auto">
                    <Text mb={2} fontSize="lg" fontWeight="bold" color="white">
                      Reward: {model.payout}
                    </Text>
                    <Flex justifyContent="space-between" alignItems="center" mt={4}>
                      <Link href={model.link} isExternal>
                        <Button
                          _hover={{ transform: 'scale(1.07)', boxShadow: 'xl' }}
                          size="lg"
                          colorScheme="green"
                        >
                          Learn
                        </Button>
                      </Link>
                      <QuizModal quizId={model.id} />
                    </Flex>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </Box>
        </Box>
      )}
    </>
  );
};

export default EducationHub;
