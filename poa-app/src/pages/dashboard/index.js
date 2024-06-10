import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  Grid,
  GridItem,
  Text,
  IconButton,
  HStack,
  keyframes,
  usePrefersReducedMotion,
  chakra,
  Image,
  Badge,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWeb3Context } from '@/context/web3Context';
import { useGraphContext } from '@/context/graphContext';
import { useSpring, animated } from 'react-spring';
import Link2 from 'next/link';
import OngoingPolls from '@/components/userPage/OngoingPolls';
import { useRouter } from 'next/router';
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";

const PerpetualOrgDashboard = () => {
  const { userData, setLoaded } = useGraphContext();
  const router = useRouter();
  const { userDAO } = router.query;

  useEffect(() => {
    setLoaded(userDAO);
  }, [userDAO]);

  const { claimedTasks, democracyVotingOngoing, graphUsername } = useGraphContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [countFinished, setCountFinished] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const openSettingsModal = () => setSettingsModalOpen(true);
  const closeSettingsModal = () => setSettingsModalOpen(false);
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

  const animatedPT = useSpring({ 
    pt: userInfo.ptBalance, 
    from: { pt: 0 },
    config: { duration: 1700 },
    onRest: () => setCountFinished(true),
  });

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
            `'orgInfo orgInfo' 'tasks polls'`,
            `'orgInfo orgInfo' 'tasks polls'`
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
              <VStack position="relative" borderTopRadius="2xl" align="flex-start" p={4}>
                <Text letterSpacing="-1%" mt={2} fontSize="4xl" fontWeight="bold">
                  Perpetual Organization
                </Text>
                <Text fontSize="lg" mt={2}>
                  Information about the Perpetual Organization, its goals, and mission statement.
                </Text>
                <Text fontSize="lg" mt={2}>
                  Additional details about the organization.
                </Text>
              </VStack>
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
              <VStack pb={2} align="flex-start" position="relative" borderTopRadius="2xl">
                <div style={glassLayerStyle} />
                <Text pl={6} fontWeight="bold" fontSize="2xl">
                  {claimedTasks && claimedTasks.length > 0 ? 'Claimed Tasks' : 'Recommended Tasks'}
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
              pt={8}
            >
              <div style={glassLayerStyle} />
              <VStack pb={2} align="flex-start" position="relative" borderTopRadius="2xl">
                <div style={glassLayerStyle} />
                <Text pl={6} fontWeight="bold" fontSize="2xl">
                  Ongoing Polls
                </Text>
              </VStack>
              <OngoingPolls OngoingPolls={democracyVotingOngoing} />
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default PerpetualOrgDashboard;

