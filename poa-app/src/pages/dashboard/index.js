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

} from '@chakra-ui/react';
import { useWeb3Context } from '@/context/web3Context';
import { useGraphContext } from '@/context/graphContext';
import Link2 from 'next/link';
import OngoingPolls from '@/components/userPage/OngoingPolls';
import { useRouter } from 'next/router';
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";
import { FaLink, FaInfoCircle } from 'react-icons/fa';
import { useIPFScontext } from "@/context/ipfsContext";

const PerpetualOrgDashboard = () => {
  const { userData, setLoaded, logoHash } = useGraphContext();
  const router = useRouter();
  const { userDAO } = router.query;
  const [imageURL, setImageURL] = useState({});
  const [imageFetched, setImageFetched] = useState(false);
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

  const { claimedTasks, democracyVotingOngoing, graphUsername, poDescription, poLinks } = useGraphContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [reccomendedTasks, setReccomendedTasks] = useState([]);
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

  const glassLayerStyle = {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: -1,
    borderRadius: 'inherit',
    backdropFilter: 'blur(20px)',
    backgroundColor: 'rgba(0, 0, 0, .7)',
  };

  const glowAnimation = keyframes`
    from { text-shadow: 0 0 0px white; }
    to { text-shadow: 0 0 20px gold;  }
  `;

  const animationProps = prefersReducedMotion
    ? {}
    : {
        animation: `${glowAnimation} alternate 2.1s ease-in-out`,
      };

  return (
    <>
      <Navbar />
      <Box p={4}>
        <Grid
          color="white"
          templateAreas={[
            `'orgInfo orgInfo' 'tasks polls' 'leaderboard constitution'`,
            `'orgInfo orgInfo' 'tasks polls' 'leaderboard constitution'`
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
                <Box>
                <VStack  align="flex-start" ml="4">
                <Image src={imageURL} alt="Organization Logo" width="150px" />
                
                <VStack spacing={2} align="flex-start">
                  <HStack ml="4" spacing={2} align="center">
                    <Icon as={FaInfoCircle} boxSize={5} />
                    <Text fontWeight={"bold"} fontSize="2xl" mt={2}>
                      Description: 
                    </Text>
                  </HStack>
                  <Text mt="-1"fontSize="lg" ml="10">
                    {poDescription}
                  </Text>
                </VStack>
                
                </VStack>
                </Box>
                <Box>
                <HStack spacing={2} align="center">
                    <Icon as={FaLink} boxSize={5} />
                    <Text fontSize="2xl" fontWeight="bold">
                      About Links
                    </Text>
                </HStack>
                
                <VStack mb="4" ml="6">
                {poLinks && poLinks.length > 0 ? (
                  poLinks.map((link, index) => (
                    <Text key={index} fontSize="lg">
                      <Link fontWeight={"bold"} href={link.url} passHref isExternal color="blue.400">
                        {link.name}
                      </Link>
                    </Text>
                  ))
                ) : (
                  <Text fontSize="lg" mt={2}>No links available</Text>
                )}
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
                  {claimedTasks && claimedTasks.length > 0 ? 'Your Claimed Tasks' : 'Recommended Tasks'}
                </Text>
              </VStack>
              <HStack spacing="3.5%" pb={2} ml={4} mr={4} pt={4}>
                {((claimedTasks && claimedTasks.length > 0) ? claimedTasks : reccomendedTasks)?.slice(0, 3).map((task) => (
                  <Box key={task.id} w="31%" _hover={{ boxShadow: "md", transform: "scale(1.07)"}} p={4} borderRadius="2xl" overflow="hidden" bg="black">
                    <Link2 href={`/tasks/?task=${task.id}&projectId=${task.projectId}&userDAO=${userDAO}`}>
                      <VStack textColor="white" align="stretch" spacing={3}>
                        <Text fontSize="md" lineHeight="99%" fontWeight="extrabold">
                          {task.id}
                        </Text>
                        <HStack justify="space-between">
                          <Badge colorScheme="yellow">{task.difficulty}</Badge>
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
              <OngoingPolls OngoingPolls={democracyVotingOngoing} />
            </Box>
          </GridItem>

          <GridItem area={'leaderboard'}>
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
                  Leaderboard
                </Text>
              </VStack>
              <Text pl={6} fontSize="lg" mt={2}> Test </Text>
            </Box>
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
              <Text pl={6} fontSize="lg" mt={2}> Test </Text>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default PerpetualOrgDashboard;
