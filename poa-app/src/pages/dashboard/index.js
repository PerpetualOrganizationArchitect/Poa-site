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
// import AccountSettingsModal from '@/components/userPage/AccountSettingsModal';

import { useWeb3Context } from '@/context/web3Context';
import { useGraphContext } from '@/context/graphContext';


// import DeployMenu from "@/components/userPage/DeployMenu";
// import MintMenu from "@/components/userPage/MintMenu";
// import DataMenu from "@/components/userPage/DataMenu";


import { useSpring, animated } from 'react-spring';


import Link2 from 'next/link';
import { set } from 'lodash';
import OngoingPolls from '@/components/userPage/OngoingPolls';
import { useRouter } from 'next/router';
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";





const UserDashboard= () => {
    const { userData, setLoaded} = useGraphContext();
    const router = useRouter();
    const { userDAO } = router.query;
    useEffect(() => {
        setLoaded(userDAO);
      }, [userDAO]);
  

    // const {setLeaderboardLoaded,userPercentage} = useLeaderboard();

    const {democracyVotingOngoing} = useGraphContext();
    

    
    
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

  const [claimedTasks, setClaimedTasks] = useState([]);
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
    backgroundColor: 'rgba(0, 0, 0, .7)',
  };

  const glowAnimation = keyframes`
    from { text-shadow: 0 0 0px white; }
    to { text-shadow: 0 0 20px gold;  }
  `;


  const determineTier = (kubixBalance) => {
    if (kubixBalance >= 2500) return "Diamond";
    else if (kubixBalance >= 1000) return "Ruby";
    else if (kubixBalance >= 500) return "Gold";
    else if (kubixBalance >= 250) return "Silver";
    else if (kubixBalance >= 100) return "Bronze";
    else return "New"; 
  };

  const tierInfo = {
    Diamond: {
        nextTier: "Double Diamond",
        nextTierKUBIX: "5000",
        nextTierReward: "Flex",
        image: "/images/diamondMember.png"
    },
    Ruby: {
        nextTier: "Diamond",
        nextTierKUBIX: 2500,
        nextTierReward: "Choice of Any Item",
        image: "/images/rubyMember.png"
    },
    Gold: {
        nextTier: "Ruby",
        nextTierKUBIX: 1000,
        nextTierReward: "Choice of Shirt, Hat, or Pullover",
        image: "/images/goldMember.png"
    },
    Silver: {
        nextTier: "Gold",
        nextTierKUBIX: 500,
        nextTierReward: "Choice of Shirt or Hat",
        image: "/images/silverMember.png"
    },
    Bronze: {
        nextTier: "Silver",
        nextTierKUBIX: 250,
        nextTierReward: "Choice of Shirt",
        image: "/images/bronzeMember.png"
    },
    New: {
        nextTier: "Bronze",
        nextTierKUBIX: 100,
        nextTierReward: "T-shirt and Trip Eligibility",
        image:"/images/newMember.png",
    },
    };


    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        console.log("checking user data", userData)
        if(userData){
            console.log(userData);
            let userInfo = {
                username: userData.id,
                ptBalance: Number(userData.ptTokenBalance),
                memberStatus: userData.memberType?.memberTypeName,
                accountAddress: userData.id,
            };
            setUserInfo(userInfo);
        }
    }, [userData]);


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
                <Text fontSize="3xl" fontWeight="bold">{userInfo.memberStatus} Member</Text>
                <Spacer />
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
        
        {/* <AccountSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
      /> */}
        <HStack pb={4} pt={2}  spacing="27%">
            <VStack align={'flex-start'} ml="6%" spacing={1}>
                <Text  fontWeight="bold"  fontSize="md">Tasks Completed: {userInfo.tasksCompleted}</Text>
            </VStack>
            <VStack align={'center'} spacing={2}>
                {hasExecNFT && (
                <Button colorScheme="green" onClick={toggleDevMenu} size="sm">Developer Menu</Button>
                )}
                {!hasExecNFT &&(<Button colorScheme="red" size="sm">Become Developer</Button>)}
                {showDevMenu && (
                <>
                    <DeployMenu />
                    <MintMenu />
                    <DataMenu />
                </>
            )}
               
            </VStack>
            </HStack>
        </Box>
        <Box w="100%" pt={4} borderRadius="2xl" bg="transparent" boxShadow="lg" position="relative" zIndex={2} >
            <div style={glassLayerStyle} />

            <VStack pb={2} align="flex-start" position="relative" borderTopRadius="2xl">
                <div style={glassLayerStyle} />
                <Text pl={6} fontWeight="bold" fontSize="2xl">
                    {claimedTasks && claimedTasks.length > 0 ? 'Claimed Tasks' : 'Recommended Tasks'}
                </Text>
            </VStack>



        </Box>

            <Box w="100%"
            pt={8}
            borderRadius="2xl"
            bg="transparent"
            boxShadow="lg"
            position="relative"
            zIndex={2}>
        <div style={glassLayerStyle} />

        <VStack pb={2}  align="flex-start" position="relative" borderTopRadius="2xl">
        <div style={glassLayerStyle} />
            <Text pl={6} fontWeight="bold" fontSize="2xl" >Ongoing Polls {' '}</Text>
            

        </VStack>

        <OngoingPolls  OngoingPolls={democracyVotingOngoing}/>

            
        </Box>

        </GridItem>
        
      </Grid>
    </Box>
    </>
  );
};

export default UserDashboard;