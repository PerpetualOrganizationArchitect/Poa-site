import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Progress,
  Spacer,
  Badge,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import AccountSettingsModal from '@/components/userPage/AccountSettingsModal';
import { useWeb3Context } from '@/context/web3Context';

import { useSpring, animated } from 'react-spring';
import Link2 from 'next/link';
import OngoingPolls from '@/components/userPage/OngoingPolls';
import UserProposals from '@/components/userPage/UserProposals';
import { useRouter } from 'next/router';
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";
import { useQuery } from '@apollo/client';
import { useAccount } from 'wagmi';
import { FETCH_USER_DETAILS } from '../../util/queries';
import { FETCH_PROJECT_DATA } from '../../util/queries';

const UserprofileHub = () => {
  const router = useRouter();
  const { userDAO } = router.query;
  const { address } = useAccount();

  const [userData, setUserData] = useState({});
  const [graphUsername, setGraphUsername] = useState('');
  const [hasExecNFT, setHasExecNFT] = useState(false);
  const [hasMemberNFT, setHasMemberNFT] = useState(false);
  const [claimedTasks, setClaimedTasks] = useState([]);
  const [userProposals, setUserProposals] = useState([]);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [reccomendedTasks, setReccomendedTasks] = useState([]);
  const combinedID = `${userDAO}-${address?.toLowerCase()}`;



  const { data, error } = useQuery(FETCH_USER_DETAILS, {
    variables: { id: address?.toLowerCase(), poName: userDAO, combinedID: combinedID },
    skip: !address || !userDAO || !combinedID,
  });

  const { data: projectData, loading: projectLoading, error: projectError } = useQuery(FETCH_PROJECT_DATA, {
    variables: { id: userDAO },
    skip: !userDAO,
  });

  useEffect(() => {
    if(projectData) {
      // sort for open tasks 
     
      let openTasks = projectData.perpetualOrganization.TaskManager.projects.flatMap(project => project.tasks).filter(task => task.taskInfo.location === 'Open');

      // select 3 random tasks
      let randomTasks = openTasks.sort(() => Math.random() - 0.5).slice(0, 3);
      setReccomendedTasks(randomTasks);
    }
  }, [projectData]);

  useEffect(() => {
    if (data) {
      const { user, account, perpetualOrganization } = data;

      const execRoles = perpetualOrganization.NFTMembership.executiveRoles;
      const hasExecNFT = execRoles.includes(user.memberType.memberTypeName);
      const hasMemberNFT = user != null;
      const username = account?.userName || '';
      const userTasks = user?.tasks || [];
      const tasksCompleted = userTasks.filter(task => task.completed).length;

      setGraphUsername(username);
      setHasExecNFT(hasExecNFT);
      setHasMemberNFT(hasMemberNFT);
      setClaimedTasks(userTasks.filter(task => !task.completed));

      if (hasMemberNFT) {
        setUserData({
          id: user.id,
          ptTokenBalance: user.ptTokenBalance,
          ddTokenBalance: user.ddTokenBalance,
          memberType: user.memberType.memberTypeName,
          imageURL: user.memberType.imageURL,
          tasksCompleted,
          totalVotes: user.totalVotes,
          dateJoined: user.dateJoined,
        });
      }

      const proposals = [
        ...data.user.ptProposals.map(proposal => ({ ...proposal, type: 'Participation' })),
        ...data.user.ddProposals.map(proposal => ({ ...proposal, type: 'Direct Democracy' })),
        ...data.user.hybridProposals.map(proposal => ({ ...proposal, type: 'Hybrid' })),
      ];

      const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds

      // Order proposals by expiration timestamp, but move completed proposals to the end
      proposals.sort((a, b) => {
        const aIsCompleted = a.experationTimestamp < currentTime;
        const bIsCompleted = b.experationTimestamp < currentTime;

        if (aIsCompleted && !bIsCompleted) {
          return 1; // a is completed, b is not - put a after b
        } else if (!aIsCompleted && bIsCompleted) {
          return -1; // b is completed, a is not - put b after a
        } else if (!aIsCompleted && !bIsCompleted) {
          return a.experationTimestamp - b.experationTimestamp; // Both are active - sort by expiration ascending
        } else {
          return a.experationTimestamp - b.experationTimestamp; // Both are completed - sort by expiration ascending
        }
      });

      setUserProposals(proposals);
      setUserDataLoading(false);
    }
  }, [data]);

  const prefersReducedMotion = usePrefersReducedMotion();
  const [countFinished, setCountFinished] = useState(false);
  const [upgradeAvailable, setUpgradeAvailable] = useState(false);
  const [showDevMenu, setShowDevMenu] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [notLoaded, setNotLoaded] = useState(true);

  const { web3, account, KUBIXbalance } = useWeb3Context();

  const glassLayerStyle = {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: -1,
    borderRadius: 'inherit',
    backdropFilter: 'blur(20px)',
    backgroundColor: 'rgba(0, 0, 0, .73)',
  };

  const glowAnimation = keyframes`
    from { text-shadow: 0 0 0px white; }
    to { text-shadow: 0 0 20px gold;  }
  `;

  const difficultyColorScheme = {
    easy: 'green',
    medium: 'yellow',
    hard: 'orange',
    veryhard: 'red'
  };

  const determineTier = (balance) => {
    if (balance >= 1000) {
      return 'Gold';
    } else if (balance >= 500) {
      return 'Silver';
    } else if (balance >= 150) {
      return 'Bronze';
    } else {
      return 'Basic';
    }
  };

  const calculateProgress = (balance) => {
    if (balance < 150) {
      return { progress: (balance / 150) * 100, nextTier: 'Bronze', nextTierThreshold: 150 };
    } else if (balance < 500) {
      return { progress: ((balance - 150) / 150) * 100, nextTier: 'Silver', nextTierThreshold: 500 };
    } else if (balance < 1000) {
      return { progress: ((balance - 500) / 500) * 100, nextTier: 'Gold', nextTierThreshold: 1000 };
    } else {
      return { progress: 100, nextTier: 'Gold', nextTierThreshold: 1000 };
    }
  };

  const formatDateToAmerican = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    if (userData) {
      console.log(userData);
      let progressData = calculateProgress(userData.ptTokenBalance);
      let userInfo = {
        username: graphUsername,
        ptBalance: Number(userData.ptTokenBalance),
        memberStatus: userData.memberType,
        accountAddress: userData.id,
        tasksCompleted: userData.tasksCompleted,
        totalVotes: userData.totalVotes,
        dateJoined: formatDateToAmerican(userData.dateJoined),
        tier: determineTier(userData.ptTokenBalance),
        progress: progressData.progress,
        nextTier: progressData.nextTier,
        nextTierThreshold: progressData.nextTierThreshold
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

  const animationProps = prefersReducedMotion
    ? {}
    : {
        animation: `${glowAnimation} alternate 2.1s ease-in-out`,
      };

  const openSettingsModal = () => setSettingsModalOpen(true);
  const closeSettingsModal = () => setSettingsModalOpen(false);

  return (
    <>
      <Navbar />
      <Box mt={-2} p={4}>
        {userDataLoading ? (
          <Center height="100vh">
            <Spinner size="xl" />
          </Center>
        ) : error ? (
          <Center height="100vh">
            <Text>Error: {error.message}</Text>
          </Center>
        ) : (
          <Grid
            color="white"
            templateAreas={[
              `'welcome welcome' 'userinfo tierinfo' 'userinfo tierinfo' 'completedtasks completedtasks'`,
              `'welcome welcome' 'userinfo tierinfo' 'userinfo tierinfo' 'completedtasks completedtasks'`
            ]}
            templateColumns="repeat(2, 1fr)"
            gap={3}
          >
            <GridItem area={'userinfo'}>
              <Box
                w="100%"
                borderRadius="2xl"
                bg="transparent"
                boxShadow="lg"
                position="relative"
                zIndex={2}
              >
                <div style={glassLayerStyle} />
                <VStack position="relative" borderTopRadius="2xl" align="flex-start">
                  <div style={glassLayerStyle} />
                  <Text pl={8} letterSpacing="-1%" mt={0} fontSize="4xl" id="kubix-earned" fontWeight="bold">
                    Tokens Earned{' '}
                    {countFinished ? (
                      <chakra.span {...animationProps}>{userInfo.ptBalance}</chakra.span>
                    ) : (
                      <animated.span>
                        {animatedPT.pt.to(pt => pt.toFixed(0))}
                      </animated.span>
                    )}
                  </Text>
                </VStack>
                <VStack p={0} pt={2} align="center">
                  <Text fontSize="3xl" fontWeight="bold">{userInfo.tier} Tier Contributor</Text>
                  <Spacer />
                  <Image
                    width="50%"
                    src={
                      userInfo.tier
                        ? (userInfo.tier === 'Basic'
                          ? "/images/high_res_poa.png"
                          : `/images/${userInfo.tier.toLowerCase()}Medal.png`)
                        : "/images/high_res_poa.png"
                    }
                    alt={`${userInfo.tier || 'Basic'} Tier Medal`}
                  />
                  <Progress mt="2" width="70%" value={userInfo.progress} colorScheme="teal" borderRadius="md" />
                  <Text textAlign={"center"} fontSize="md" p={2} mb="2">
                    {userInfo.progress < 100 ? `Progress to ${userInfo.nextTier} Tier: ${userInfo.ptBalance}/${userInfo.nextTierThreshold}` : `You have reached the highest tier!`}
                  </Text>
                </VStack>
              </Box>
            </GridItem>
            <GridItem area={'tierinfo'}>
              <Box
                w="100%"
                borderRadius="2xl"
                bg="transparent"
                boxShadow="lg"
                position="relative"
                zIndex={2}
              >
                <div style={glassLayerStyle} />
                <HStack pt={1} pb={1} position="relative" borderTopRadius="2xl">
                  <div style={glassLayerStyle} />
                  <Text pl={6} fontSize="3xl" fontWeight="extrabold">{userInfo.username}</Text>
                  <Text pt={0} pl={2} fontSize="lg">{userInfo.memberStatus}</Text>
                </HStack>
                <IconButton
                  icon={<SettingsIcon />}
                  isRound={true}
                  size="sm"
                  aria-label="Settings"
                  onClick={openSettingsModal}
                  alignSelf="start"
                  justifySelf="end"
                  position="absolute"
                  top="8%"
                  right="4%"
                  color="black"
                />
                <AccountSettingsModal
                  isOpen={isSettingsModalOpen}
                  onClose={closeSettingsModal}
                />
                <HStack pb={4} pt={2} spacing="4%">
                  <VStack mt="1" align={'flex-start'} ml="5%" spacing={1}>
                    <Text fontWeight="bold" fontSize="md">Tasks Completed: {userInfo.tasksCompleted}</Text>
                    <Text fontWeight="bold" fontSize="md">Total Votes: {userInfo.totalVotes}</Text>
                    <HStack spacing={1}>
                      <Text fontWeight="bold" fontSize="md">Joined:</Text>
                      <Text fontSize="sm">{userInfo.dateJoined}</Text>
                    </HStack>
                  </VStack>
                  <Spacer />
                  <Box mt="2" alignSelf="flex-start" mr="3">
                    <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
                  </Box>
                </HStack>
              </Box>
              <Box w="100%" pt={4} borderRadius="2xl" bg="transparent" position="relative" zIndex={2}>
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
                            {task.taskInfo.name}
                          </Text>
                          <HStack justify="space-between">
                            <Badge colorScheme={difficultyColorScheme[task.taskInfo.difficulty.toLowerCase().replace(" ", "")]}>{task.taskInfo.difficulty}</Badge>
                            <Text fontWeight="bold">Payout {task.payout}</Text>
                          </HStack>
                        </VStack>
                      </Link2>
                    </Box>
                  ))}
                </HStack>
              </Box>
              <Box
                w="100%"
                pt={8}
                borderRadius="2xl"
                bg="transparent"
                position="relative"
                zIndex={2}
              >
                <div style={glassLayerStyle} />
                <VStack pb={2} align="flex-start" position="relative" borderTopRadius="2xl">
                  <div style={glassLayerStyle} />
                  <Text pl={6} fontWeight="bold" fontSize="2xl">
                    {userProposals && userProposals.length > 0 ? 'My Proposals' : 'Ongoing Proposals'}{' '}
                  </Text>
                </VStack>
                <Box mt="4">
                  {userProposals && userProposals.length > 0 ? (
                    <UserProposals userProposals={userProposals} />
                  ) : (
                    <OngoingPolls OngoingPolls={ongoingPolls} />
                  )}
                </Box>
              </Box>
            </GridItem>
            <GridItem area={'completedtasks'} colSpan={2}>
              <Box
                w="100%"
                pt={2}
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
                    My Completed Tasks
                  </Text>
                </VStack>
                <HStack spacing="3.5%" pb={2} ml={4} mr={4} pt={4}>
                  {userData && userData.completedTasks && userData.completedTasks.length > 0 ? (
                    userData.completedTasks.map((task) => (
                      <Box key={task.id} w="31%" _hover={{ boxShadow: "md", transform: "scale(1.07)"}} p={4} borderRadius="2xl" overflow="hidden" bg="black">
                        <Link2 href={`/tasks/?task=${task.id}&projectId=${task.projectId}&userDAO=${userDAO}`}>
                          <VStack textColor="white" align="stretch" spacing={3}>
                            <Text fontSize="md" lineHeight="99%" fontWeight="extrabold">
                              {task.taskInfo.name}
                            </Text>
                            <HStack justify="space-between">
                              <Badge colorScheme={difficultyColorScheme[task.taskInfo.difficulty.toLowerCase().replace(" ", "")]}>{task.taskInfo.difficulty}</Badge>
                              <Text fontWeight="bold">Payout {task.payout}</Text>
                            </HStack>
                          </VStack>
                        </Link2>
                      </Box>
                    ))
                  ) : (
                    <Text pl={6} fontWeight="bold" fontSize="xl">
                      No completed tasks found.
                    </Text>
                  )}
                </HStack>
              </Box>
            </GridItem>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default UserprofileHub;
