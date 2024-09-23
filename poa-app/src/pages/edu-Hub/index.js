import React, { useEffect, useRef } from 'react';
import { Box, Spinner, Center, Grid, GridItem, Heading, Text, Link, Flex, Button } from '@chakra-ui/react';
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";
import { usePOContext } from '@/context/POContext';
import QuizModal from '@/components/eduHub/QuizModal';

// Glass layer style
const glassLayerStyle = {
  backdropFilter: 'blur(20px)',
  backgroundColor: 'rgba(0, 0, 0, 0.71)', // Adjust opacity for glass effect
  border: '1px solid rgba(255, 255, 255, 0.25)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const EducationHub = () => {
  const { poContextLoading } = usePOContext();
  const containerRef = useRef();


  // Sample education models
  const educationModels = [
    {
      id: 1,
      title: 'Intro to DAOs',
      link: 'https://example.com/dao-intro',
      payout: '10 Tokens',
      description: 'Learn about the basics of DAOs Testing length of description im gonna see how long looks ok and what i should maybe limi a description too lets seeee loinge longer longer longer longer logner ',
      quizLink: '/quiz/dao-intro',
    },
    {
      id: 2,
      title: 'Understanding Smart Contracts',
      link: 'https://example.com/smart-contracts',
      payout: '15 Tokens',
      description: 'Learn about smart contracts and how they work',
      quizLink: '/quiz/smart-contracts',
    },
    {
      id: 3,
      title: 'Voting Mechanisms in DAOs',
      link: 'https://example.com/voting-daos',
      payout: '20 Tokens',
      description: 'Learn about different voting mechanisms in DAOs',
      quizLink: '/quiz/voting-daos',
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
          <Box p={6} bg="transparent" borderRadius="lg" mx="auto" mt={6} maxWidth="1200px">
            <Heading as="h2" size="lg" mb={8} textAlign="center" color="white">Education Hub</Heading>
            <Grid templateColumns="repeat(3, 1fr)" gap={8}>
              {educationModels.map(model => (
                <GridItem
                  key={model.id}
                  borderRadius="md"
                  p={6}
                  sx={glassLayerStyle}  // Applying glass layer style here
                  transition="all 0.3s ease"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between" // Ensure space is distributed to push buttons down
                >
                  <Box mb={6}>
                    <Heading as="h3" size="lg" mb={6} color="white">{model.title}</Heading>
                    <Text fontSize="md" color="gray.300">{model.description}</Text>
                  </Box>
                  <Box mt="auto">  {/* This ensures the reward stays at the bottom */}
                    <Text mb={2} fontSize="lg" fontWeight={"bold"} color="white" >Reward: {model.payout}</Text>
                    <Flex justifyContent="space-between" alignItems="center" mt={4}>
                      <Link href={model.link} isExternal>
                        <Button _hover={{ transform: 'scale(1.07)', boxShadow: 'xl' }} size={"lg"} colorScheme="green">Learn</Button>
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