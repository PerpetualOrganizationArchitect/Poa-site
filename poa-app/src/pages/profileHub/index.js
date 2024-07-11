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
  Progress,
  Spacer,
    Badge,
  
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import AccountSettingsModal from '@/components/userPage/AccountSettingsModal';

import { useWeb3Context } from '@/context/web3Context';
import { useGraphContext } from '@/context/graphContext';

import { useSpring, animated } from 'react-spring';

import Link2 from 'next/link';
import { set } from 'lodash';
import OngoingPolls from '@/components/userPage/OngoingPolls';
import UserProposals from '@/components/userPage/UserProposals';
import { useRouter } from 'next/router';
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";


const UserprofileHub= () => {
    const { userData, setLoaded} = useGraphContext();
    const router = useRouter();
    
    const { userDAO } = router.query;
    useEffect(() => {
        setLoaded(userDAO);
      }, [userDAO]);


    const {userProposals, claimedTasks,democracyVotingOngoing, graphUsername, reccommendedTasks} = useGraphContext();
    
    
    
  const prefersReducedMotion = usePrefersReducedMotion();
  const [countFinished, setCountFinished] = useState(false);

  const[upgradeAvailable, setUpgradeAvailable] = useState(false);

  const [showDevMenu, setShowDevMenu] = useState(false);

  const toggleDevMenu = () => {
    setShowDevMenu(prevShowDevMenu => !prevShowDevMenu);
};

  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);

  const openSettingsModal = () => setSettingsModalOpen(true);
  const closeSettingsModal = () => setSettingsModalOpen(false);


    const [notLoaded, setNotLoaded] = useState(true);
  const [reccomendedTasks, setReccomendedTasks] = useState([]);



    const { web3, account,KUBIXbalance, hasExecNFT} = useWeb3Context();



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




    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        
        if(userData){
            console.log(userData);
            let userInfo = {
                username: graphUsername,
                ptBalance: Number(userData.ptTokenBalance),
                memberStatus: userData.memberType,
                accountAddress: userData.id,
                tasksCompleted: userData.tasksCompleted,
                totalVotes: userData.totalVotes,
                dateJoined: userData.dateJoined
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


  return (
    <>
    <Navbar />
    
    <Box p={4}>
      <Grid
        color="white"
        templateAreas={[
          `'welcome welcome' 'userinfo tierinfo' 'userinfo tierinfo'`,
          `'welcome welcome' 'userinfo tierinfo' 'userinfo tierinfo'`
        ]}
        templateColumns="repeat(2, 1fr)"
        gap={4}
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
            <Text pl={6} letterSpacing="-1%" mt={2} fontSize="4xl" id="kubix-earned" fontWeight="bold">
                Tokens Earned {' '}
                {countFinished ? (
                <chakra.span {...animationProps}>{userInfo.ptBalance}</chakra.span>

            ) : (
                <animated.span>
                    {animatedPT.pt.to(pt => pt.toFixed(0))}
                </animated.span>)}
                </Text>

            {/* <Text pl={6} pb={4} fontSize="lg">This makes you top {userInfo.percentage}% of Contributors</Text> */}
          </VStack>
            <VStack p={0} pt={4} align="center" >
                <Text fontSize="3xl" fontWeight="bold">Gold Tier Contributor</Text>
                <Spacer />
                <Image width="50%" src={"/images/poa_character.png"} />
                <Text textAlign={"center"} fontSize="lg" p={4} >Participation Tier System Coming Soon</Text>
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
        <HStack  pt={4} pb= {4} position="relative" borderTopRadius="2xl" >
        <div style={glassLayerStyle} />
          <Text  pl={4}  fontSize="3xl" fontWeight="extrabold">{userInfo.username} </Text>
          
          <Text pt={2} pl={2} fontSize="lg" > {userInfo.memberStatus}</Text>
        </HStack>
          <IconButton
          icon={<SettingsIcon />}
          isRound={true}
          size="md"
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
      
        <HStack pb={4} pt={2} spacing="10%">
          <VStack align={'flex-start'} ml="4%" spacing={1}>
            <Text fontWeight="bold" fontSize="md">Tasks Completed: {userInfo.tasksCompleted}</Text>
            <Text fontWeight="bold" fontSize="md">Total Votes: {userInfo.totalVotes}</Text>
            <Text fontWeight="bold" fontSize="md">Date Joined: {userInfo.dateJoined}</Text>
          </VStack>
          <Spacer />
          <Box alignSelf="flex-start" mr="4">
            <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
          </Box>
        </HStack>

        </Box>
        <Box w="100%" pt={4} borderRadius="2xl" bg="transparent"  position="relative" zIndex={2} >
            <div style={glassLayerStyle} />

            <VStack pb={2} align="flex-start" position="relative" borderTopRadius="2xl">
                <div style={glassLayerStyle} />
                <Text pl={6} fontWeight="bold" fontSize="2xl">
                    {claimedTasks && claimedTasks.length > 0 ? 'Claimed Tasks' : 'Recommended Tasks'}
                </Text>

            </VStack>
            <HStack spacing="3.5%" pb={2} ml={4} mr={4} pt={4}>
                {((claimedTasks && claimedTasks.length > 0) ? claimedTasks : reccommendedTasks)?.slice(0, 3).map((task) => (
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
            <Box w="100%"
            pt={8}
            borderRadius="2xl"
            bg="transparent"
        
            position="relative"
            zIndex={2}>
        <div style={glassLayerStyle} />

        <VStack pb={2}  align="flex-start" position="relative" borderTopRadius="2xl">
        <div style={glassLayerStyle} />
            <Text pl={6} fontWeight="bold" fontSize="2xl" >Ongoing Polls {' '}</Text>
        </VStack>
        <Box  mt="4">
        <OngoingPolls  OngoingPolls={democracyVotingOngoing}/>
        </Box>

        </Box>

        </GridItem>
        
      </Grid>
    </Box>
    </>
  );
};

export default UserprofileHub;