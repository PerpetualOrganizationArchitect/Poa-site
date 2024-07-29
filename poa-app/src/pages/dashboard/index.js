import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Grid,
  GridItem,
  Text,
  HStack,
  Icon,
  Badge,
  Link,
  Image,
  Button,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { useWeb3Context } from '@/context/web3Context';
import { useVotingContext } from '@/context/VotingContext';
import { usePOContext } from '@/context/POContext';
import { useProjectContext } from '@/context/ProjectContext';
import { useUserContext } from '@/context/UserContext';
import Link2 from 'next/link';
import OngoingPolls from '@/components/userPage/OngoingPolls';
import { useRouter } from 'next/router';
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";
import { FaLink } from 'react-icons/fa';
import { useIPFScontext } from "@/context/ipfsContext";

function generateAbbreviatedConstitution(poData) {
  const {
    HybridVoting = null,
    DirectDemocracyVoting = null,
    ParticipationVoting = null,
    NFTMembership = null,
    Treasury = null
  } = poData;

  let descriptions = [];

  const addVotingSystemDescription = (name, system) => {
    if (system) {
      descriptions.push(<Text key={name} ml="2">{name}: {system.quorum}% approval</Text>);
    }
  };

  descriptions.push(<Text fontWeight="bold" fontSize="lg" key="voting-types" ml="2" mt="2">Voting Types</Text>);
  addVotingSystemDescription("Hybrid Voting", HybridVoting);
  addVotingSystemDescription("Direct Democracy Voting", DirectDemocracyVoting);
  addVotingSystemDescription("Participation Voting", ParticipationVoting);

  if (NFTMembership) {
    descriptions.push(<Text fontWeight={"bold"} fontSize={"lg"} key="member-types" ml="2" mt="2">Member Types</Text>);
    descriptions.push(<Text key="member-type-names" ml="2" mt="2">All Member Types: {NFTMembership.memberTypeNames.join(', ')}</Text>);
    descriptions.push(<Text key="executive-roles" ml="2" mt="0">Executive Roles: {NFTMembership.executiveRoles.join(', ')}</Text>);
  }

  if (Treasury) {
    let treasuryControl = "an unidentified voting system";
    if (HybridVoting && Treasury.votingContract === HybridVoting.id) {
      treasuryControl = "Hybrid Voting";
    } else if (DirectDemocracyVoting && Treasury.votingContract === DirectDemocracyVoting.id) {
      treasuryControl = "Direct Democracy Voting";
    } else if (ParticipationVoting && Treasury.votingContract === ParticipationVoting.id) {
      treasuryControl = "Participation Voting";
    }
    descriptions.push(<Text fontSize={"lg"} fontWeight={"bold"} key="treasury-control-Text" ml="2" mt="2">Treasury and Upgrade Control</Text>);
    descriptions.push(<Text key="treasury-control" ml="2" mt="2">Controlled by: {treasuryControl}</Text>);
  }

  return descriptions;
}

const PerpetualOrgDashboard = () => {
  const { ongoingPolls } = useVotingContext();
  console.log("ongoingPolls", ongoingPolls);
  const { poContextLoading, poDescription, poLinks, logoHash, activeTaskAmount, completedTaskAmount, ptTokenBalance, poMembers, rules } = usePOContext();

  const router = useRouter();
  const { userDAO } = router.query;
  const [imageURL, setImageURL] = useState({});
  const [imageFetched, setImageFetched] = useState(false);
  const [constitutionElements, setConstitutionElements] = useState([]);
  const { fetchImageFromIpfs } = useIPFScontext();

  useEffect(() => {
    const fetchImage = async () => {
      if (logoHash && !imageFetched) {
        const imageUrlFetch = await fetchImageFromIpfs(logoHash);
        setImageURL(imageUrlFetch);
        setImageFetched(true);
      }
    };
    fetchImage();
  }, [logoHash]);

  useEffect(() => {
    if (rules) {
      setConstitutionElements(generateAbbreviatedConstitution(rules));
    }
  }, [rules]);

  const { leaderboardData } = usePOContext();
  const { recommendedTasks } = useProjectContext();

  const getMedalColor = (rank) => {
    switch (rank) {
      case 0:
        return 'gold';
      case 1:
        return 'silver';
      case 2:
        return '#cd7f32';
      default:
        return null;
    }
  };

  const glassLayerStyle = {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: -1,
    borderRadius: 'inherit',
    backdropFilter: 'blur(70px)',
    backgroundColor: 'rgba(0, 0, 0, .79)',
  };

  const difficultyColorScheme = {
    easy: 'green',
    medium: 'yellow',
    hard: 'orange',
    veryhard: 'red'
  };

  return (
    <>
      <Navbar />
      {poContextLoading ? (
        <Center height="100vh">
          <Spinner size="xl" />
        </Center>
      ) : (
        <Box p={4}>
          <Grid
            color="whitesmoke"
            templateAreas={[
              `'orgInfo orgStats' 'tasks polls' 'leaderboard constitution'`,
              `'orgInfo orgStats' 'tasks polls' 'leaderboard constitution'`,
            ]}
            templateColumns="repeat(2, 1fr)"
            gap={4}
          >
            <GridItem area={'orgInfo'}>
              <Box
                w="125%"
                borderRadius="2xl"
                bg="transparent"
                boxShadow="lg"
                position="relative"
                zIndex={2}
              >
                <div style={glassLayerStyle} />
                <VStack pb={1} position="relative" borderTopRadius="2xl" align="flex-start">
                  <div style={glassLayerStyle} />
                  <HStack spacing={4}>
                    <Text pl={6} letterSpacing="-1%" fontSize="4xl" fontWeight="bold">
                      {userDAO}'s Dashboard
                    </Text>
                  </HStack>
                </VStack>
                <HStack spacing={4} justify="space-between" w="100%" p="2">
                  <Box pl="12px">
                    <Image mb="0" src={imageURL} alt="Organization Logo" width="220px" />
                  </Box>
                  <VStack ml="2" align="flex-start" pr="10px" spacing={2} w="100%">
                    <Box>
                      <Text fontWeight={"bold"} fontSize="xl" mt={0}>
                        Description:
                      </Text>
                      <Text mt="-1" fontSize="md" ml="2">
                        {poDescription}
                      </Text>
                    </Box>
                    <Box>
                      <HStack spacing={2} align="center">
                        <Icon as={FaLink} boxSize={4} />
                        <Text fontSize="lg" fontWeight="bold">
                          Links
                        </Text>
                      </HStack>
                      <HStack ml="4" mt="1" spacing={2} align="center">
                        {poLinks && poLinks.length > 0 ? (
                          poLinks.map((link, index) => (
                            <Text mt="-2" key={index} fontSize="md">
                              <Link fontSize="xl" fontWeight={"bold"} href={link.url} isExternal color="blue.400">
                                {link.name}
                              </Link>
                            </Text>
                          ))
                        ) : (
                          <Text fontSize="lg" mt={2}>No links available</Text>
                        )}
                      </HStack>
                    </Box>
                  </VStack>
                </HStack>
              </Box>
            </GridItem>

            <GridItem area={'orgStats'}>
              <Box
                h="100%"
                ml="25%"
                w="75%"
                borderRadius="2xl"
                bg="transparent"
                boxShadow="lg"
                position="relative"
                zIndex={2}
              >
                <div style={glassLayerStyle} />
                <VStack pb={1} align="flex-start" position="relative" borderTopRadius="2xl">
                  <div style={glassLayerStyle} />
                  <Text pl={6} fontWeight="bold" fontSize="2xl">
                    Organization Stats
                  </Text>
                </VStack>
                <VStack mt="2" spacing={1.5} align="flex-start" ml="8">
                  <HStack spacing={2}>
                    <Text mt="-1" fontSize="lg" fontWeight="bold">
                      Members:
                    </Text>
                    <Text mt="-1" fontSize="lg">
                      {poMembers}
                    </Text>
                  </HStack>

                  <HStack spacing={2}>
                    <Text mt="-1" fontSize="lg" fontWeight="bold">
                      Total Participation Tokens:
                    </Text>
                    <Text mt="-1" fontSize="lg">
                      {ptTokenBalance}
                    </Text>
                  </HStack>

                  <HStack spacing={2}>
                    <Text mt="-1" fontSize="lg" fontWeight="bold">
                      Active Tasks:
                    </Text>
                    <Text mt="-1" fontSize="lg">
                      {activeTaskAmount}
                    </Text>
                  </HStack>

                  <HStack spacing={2}>
                    <Text mt="-1" fontSize="lg" fontWeight="bold">
                      Completed Tasks:
                    </Text>
                    <Text mt="-1" fontSize="lg">
                     {completedTaskAmount}
                    </Text>
                  </HStack>

                  <HStack spacing={2}>
                    <Text mt="-1" fontSize="lg" fontWeight="bold">
                      Treasury Balance:
                    </Text>
                    <Text mt="-1" fontSize="lg">
                      $12345
                    </Text>
                  </HStack>
                </VStack>

              </Box>
            </GridItem>

            <GridItem area={'tasks'}>
              <Box
                h="100%"
                w="100%"
                borderRadius="2xl"
                bg="transparent"
                boxShadow="lg"
                position="relative"
                zIndex={2}
              >
                <div style={glassLayerStyle} />
                <VStack pb={1} align="flex-start" position="relative" borderTopRadius="2xl">
                  <div style={glassLayerStyle} />
                  <Text pl={6} fontWeight="bold" fontSize="2xl">
                    Recommended Tasks
                  </Text>
                </VStack>
                <HStack spacing="3.5%" pb={2} ml={4} mr={4} pt={2}>
                  {recommendedTasks?.slice(0, 3).map((task) => (
                    <Box key={task.id} w="31%" _hover={{ boxShadow: "md", transform: "scale(1.07)"}} p={4} borderRadius="2xl" overflow="hidden" bg="black">
                      <Link2 href={`/tasks/?task=${task.id}&projectId=${task.projectId}&userDAO={userDAO}`}>
                        <VStack textColor="white" align="stretch" spacing={3}>
                          <Text mt="-2" fontSize="md" lineHeight="99%" fontWeight="extrabold">
                            {task.taskInfo.name}
                          </Text>
                          <HStack justify="space-between">
                            <Badge colorScheme={difficultyColorScheme[task.taskInfo.difficulty.toLowerCase().replace(" ", "")]}>{task.taskInfo.difficulty}</Badge>
                            <Text fontWeight="bold">Tokens {task.payout}</Text>
                          </HStack>
                        </VStack>
                      </Link2>
                    </Box>
                  ))}
                </HStack>
              </Box>
            </GridItem>

            <GridItem area={'polls'}>
              <Box
               h="100%"
                w="100%"
                borderRadius="2xl"
                bg="transparent"
                boxShadow="lg"
                position="relative"
                zIndex={2}
              >
                <div style={glassLayerStyle} />
                <VStack pb={1} align="flex-start" position="relative" borderTopRadius="2xl">
                  <div style={glassLayerStyle} />
                  <Text pl={6} fontWeight="bold" fontSize="2xl">
                    Ongoing Polls
                  </Text>
                </VStack>
                
                <Box  w="100%" p={4}>
                  <OngoingPolls OngoingPolls={ongoingPolls} />
                </Box>
              </Box>
            </GridItem>

            <GridItem area={'leaderboard'}>
              <Link2 href="/leaderboard">
                <Box
                  h="100%"
                  w="100%"
                  borderRadius="2xl"
                  bg="transparent"
                  boxShadow="lg"
                  position="relative"
                  zIndex={2}
                  _hover={{ boxShadow: "md", transform: "scale(1.03)" }}
                >
                  <div style={glassLayerStyle} />
                  <VStack pb={1} align="flex-start" position="relative" borderTopRadius="2xl">
                    <div style={glassLayerStyle} />
                    <Text pl={6} fontWeight="bold" fontSize="2xl">
                      Leaderboard
                    </Text>
                  </VStack>
                  <Box p={4}>
                    {Array.isArray(leaderboardData) && leaderboardData.length > 0 ? (
                      leaderboardData.slice(0, 5).map((entry, index) => {
                        const medalColor = getMedalColor(index);
                        return (
                          <HStack ml="6" key={entry.id} spacing={4} alignItems="center">
                            <Text fontSize="xl" fontWeight={medalColor ? 'extrabold' : null} color={medalColor}>
                              {index + 1}
                            </Text>
                            <Text fontWeight={medalColor ? 'extrabold' : null} fontSize="2xl">{entry.name}</Text>
                            <Badge ml="2" fontSize={"md"} colorScheme="blue">{entry.token} Tokens</Badge>
                          </HStack>
                        );
                      })
                    ) : (
                      <Text pl={6} fontSize="lg" mt={2}>No leaderboard data available</Text>
                    )}
                  </Box>
                </Box>
              </Link2>
            </GridItem>

            <GridItem area={'constitution'}>
              <Box
                w="100%"
                borderRadius="2xl"
                bg="transparent"
                boxShadow="lg"
                position="relative"
                zIndex={2}
              >
                <div style={glassLayerStyle} />
                <VStack pb={1} align="flex-start" position="relative" borderTopRadius="2xl">
                  <div style={glassLayerStyle} />
                  <Text pl={6} fontWeight="bold" fontSize="2xl">
                    Constitution
                  </Text>
                </VStack>
                <Box pl={6} pr={6} pb={4}>
                  {constitutionElements}
                  <HStack mt="2" spacing={4} align="center">
                    <Link2 href={`/constitution?userDAO=${userDAO}`}>
                      <Button
                        mt={2}
                        colorScheme="teal"
                        size="sm"
                        ml="2"
                      >
                        View Full Constitution
                      </Button>
                    </Link2>
                    <Text fontSize="sm" mb={0} mt="2" ml="6" color="gray.500">
                      See the full constitution for explanations and full rules.
                    </Text>
                  </HStack>
                </Box>
              </Box>
            </GridItem>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default PerpetualOrgDashboard;
