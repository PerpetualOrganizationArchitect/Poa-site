import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Grid,
  GridItem,
  Text,
  HStack,
  keyframes,
  usePrefersReducedMotion,
  Icon,
  Badge,
  Link, 
  Image,
  Button
} from '@chakra-ui/react';
import { useWeb3Context } from '@/context/web3Context';
import { useGraphContext } from '@/context/graphContext';
import Link2 from 'next/link';
import OngoingPolls from '@/components/userPage/OngoingPolls';
import { useRouter } from 'next/router';
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";
import { FaLink, FaInfoCircle } from 'react-icons/fa';
import { useIPFScontext } from "@/context/ipfsContext";

function generateAbbreviatedConstitution(poData) {
    const {
        HybridVoting = null,
        DirectDemocracyVoting = null,
        ParticipationVoting = null,
        NFTMembership = null,
        Treasury = null
    } = poData.perpetualOrganization;

    let descriptions = [];

    const addVotingSystemDescription = (name, system) => {
        if (system) {
            descriptions.push(<Text key={name} ml="2">{name}: {system.quorum}% approval</Text>);
        }
    };

    descriptions.push(<Text  fontWeight="bold" fontSize="lg" key="voting-types" ml="2" mt="2">Voting Types</Text>);
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
        descriptions.push(<Text fontSize={"lg"} fontWeight={"bold"} key="treasury-control" ml="2" mt="2">Treasury and Upgrade Control</Text>);
        descriptions.push(<Text key="treasury-control" ml="2" mt="2">Controlled by: {treasuryControl}</Text>);
    }

    return descriptions;
}

const PerpetualOrgDashboard = () => {
  const { userData, setLoaded, logoHash, fetchRules } = useGraphContext();
  const router = useRouter();
  const { userDAO } = router.query;
  const [imageURL, setImageURL] = useState({});
  const [imageFetched, setImageFetched] = useState(false);
  const [constitutionElements, setConstitutionElements] = useState([]);
  const { fetchImageFromIpfs } = useIPFScontext();

  useEffect(() => {
    setLoaded(userDAO);
  }, [userDAO]);

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
    const fetchData = async () => {
        let poData = await fetchRules(userDAO);
        setConstitutionElements(generateAbbreviatedConstitution(poData));
    };
    if (userDAO) {
        fetchData();
    }
  }, [userDAO]);

  const { leaderboardData, reccommendedTasks, democracyVotingOngoing, graphUsername, poDescription, poLinks } = useGraphContext();
  const prefersReducedMotion = usePrefersReducedMotion();

  const { web3, account, hasExecNFT } = useWeb3Context();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if (userData) {
      let userInfo = {
        username: graphUsername,
        ptBalance: Number(userData.ptTokenBalance),
        memberStatus: userData.memberType?.memberTypeName,
        accountAddress: userData.id,
      };
      setUserInfo(userInfo);
    }
  }, [userData, graphUsername]);

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
    backdropFilter: 'blur(20px)',
    backgroundColor: 'rgba(0, 0, 0, .7)',
  };

  return (
    <>
      <Navbar />
      <Box p={4}>
        <Grid
          color="white"
          templateAreas={[
            `'orgInfo orgInfo' 'tasks polls' 'leaderboard constitution'`,
            `'orgInfo orgInfo' 'tasks polls' 'leaderboard constitution'`,
          ]}
          templateColumns="repeat(2, 1fr)"
          gap={4}
        >
          <GridItem area={'orgInfo'}>
            <Box
              w="100%"
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
              <Grid templateColumns="repeat(2, 1fr)" w="100%" gap={6}>
                <Box ml="10%">
                  <HStack mt="4"  align="justifyContent">
                    <Image mb="2" src={imageURL} alt="Organization Logo" width="180px" />
                    <VStack ml="6" mb="4" mt="0">
                      <HStack spacing={2} >
                        <Text fontWeight={"bold"} fontSize="xl" mt={0}>
                          Description:
                        </Text>
                      </HStack>
                      <Text mb="0" mt="-2" fontSize="lg" ml="2">
                        {poDescription}
                      </Text>
                      <HStack spacing={2} align="center">
                        <Icon as={FaLink} boxSize={4} />
                        <Text fontSize="lg" fontWeight="bold">
                          About Links
                        </Text>
                      </HStack>
                      {poLinks && poLinks.length > 0 ? (
                        poLinks.map((link, index) => (
                          <Text mt="-2" key={index} fontSize="md">
                            <Link fontSize="xl" fontWeight={"bold"} href={link.url} passHref isExternal color="blue.400">
                              {link.name}
                            </Link>
                          </Text>
                        ))
                      ) : (
                        <Text fontSize="lg" mt={2}>No links available</Text>
                      )}
                    </VStack>
                  </HStack>
                </Box>
                <Box ml="8" mt="2">
                  <VStack spacing={2} align="flex-start">
                    <HStack spacing={2} align="center">
                      <Text fontWeight="bold" fontSize="2xl" mt={0}>
                        Organization Stats:
                      </Text>
                    </HStack>
                    <Text mt="-1" fontSize="lg" ml="8">
                      Members: 123
                    </Text>
                    <Text mt="-1" fontSize="lg" ml="8">
                      Total Participation Tokens: 45678
                    </Text>
                    <Text mt="-1" fontSize="lg" ml="8">
                      Active Tasks: 7
                    </Text>
                    <Text mt="-1" fontSize="lg" ml="8">
                      Completed Tasks: 12
                    </Text>
                    <Text mt="-1" fontSize="lg" ml="8">
                      Treasury Balance: 12345
                    </Text>
                  </VStack>
                </Box>
              </Grid>
            </Box>
          </GridItem>
  
          <GridItem area={'tasks'}>
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
                  Recommended Tasks
                </Text>
              </VStack>
              <HStack spacing="3.5%" pb={2} ml={4} mr={4} pt={2}>
                {reccommendedTasks?.slice(0, 3).map((task) => (
                  <Box key={task.id} w="31%" _hover={{ boxShadow: "md", transform: "scale(1.07)"}} p={4} borderRadius="2xl" overflow="hidden" bg="black">
                    <Link2 href={`/tasks/?task=${task.id}&projectId=${task.projectId}&userDAO=${userDAO}`}>
                      <VStack textColor="white" align="stretch" spacing={3}>
                        <Text mt="-2"fontSize="md" lineHeight="99%" fontWeight="extrabold">
                          {task.taskInfo.name}
                        </Text>
                        <HStack justify="space-between">
                          <Badge colorScheme="yellow">{task.taskInfo.difficulty}</Badge>
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
              
              <Box w="100%" p={4}>
                <OngoingPolls OngoingPolls={democracyVotingOngoing} />
              </Box>
            </Box>
            
          </GridItem>
  
          <GridItem area={'leaderboard'}>
            <Link2 href="/leaderboard">
            <Box
              w="100%"
              borderRadius="2xl"
              bg="transparent"
              boxShadow="lg"
              position="relative"
              zIndex={2}
              _hover={{ boxShadow: "md", transform: "scale(1.03)"}}
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
                    return(
                    <HStack  ml="6" key={entry.id} spacing={4} alignItems="center">
                      <Text fontSize="xl" fontWeight={medalColor ? 'extrabold' : null} color={medalColor}>
                        {index + 1}
                      </Text>
                      <Text   fontWeight={medalColor ? 'extrabold' : null} fontSize="2xl">{entry.name}</Text>
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
              <HStack spacing={4} align="center">
  
                <Link2 href={`/constitution?userDAO=${userDAO}`} passHref>
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
                {constitutionElements}
  
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
  
};

export default PerpetualOrgDashboard;
