import React, { useState, useEffect, use } from 'react';
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


// import DeployMenu from "@/components/userPage/DeployMenu";
// import MintMenu from "@/components/userPage/MintMenu";
// import DataMenu from "@/components/userPage/DataMenu";


import { useSpring, animated } from 'react-spring';


import Link2 from 'next/link';
import { set } from 'lodash';
import OngoingPolls from '@/components/userPage/OngoingPolls';






const UserDashboard= () => {

    // const {setLeaderboardLoaded,userPercentage} = useLeaderboard();

    // const {loadOngoingKubidInitial, kubidOngoingProposals} = useGraphVotingContext();
    

    
    
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
    // const {userDetails, fetchUserDetails, findUserInProgressTasks, projects, findRandomTasks} = useDataBaseContext();


    // useEffect(() => {
        
    //     async function fetch(){
    //         await fetchUserDetails(web3,account);
    //         await setLeaderboardLoaded(true);
    //         await loadOngoingKubidInitial();
            
            
    //     }
    //     if(web3 && account&& notLoaded){
    //         setNotLoaded(false)

    //         fetch();
    //     }
        
    //   }, [web3, account]);

    //   useEffect(() => {
    //         async function fetch(){
    //             if (userDetails && projects){
    //                 console.log(userDetails.username)
    //                 console.log(projects)
    //                 const wait =await findUserInProgressTasks(projects , userDetails.username)
                   
    //                 if(wait.length === 0){
    //                     console.log("ready");
    //                     const random = await findRandomTasks(projects, 3);
    //                     setReccomendedTasks(random);
    //                     console.log(random);
    //                 }

    //                 setClaimedTasks(wait);
    //                 console.log(wait);

    //             }
    //             else{
    //                 console.log("not ready");
        
    //             }
                

    //         }
    //         fetch();
    //     }, [userDetails, projects]);

        


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



  const userInfo = {
    username: userDetails && userDetails.username ? userDetails.username : 'User',
    kubixEarned: KUBIXbalance,
    memberStatus: hasExecNFT ? 'Executive' : 'Member',
    semesterKubix: userDetails && userDetails.kubixBalance2024Spring ? userDetails.kubixBalance2024Spring : 0,
    yearKubix: userDetails && userDetails.kubixBalance2024Spring && userDetails.kubixBalance2023Fall ? userDetails.kubixBalance2023Fall+ userDetails.kubixBalance2024Spring : 0,
    accountAddress: account ? account : '0x000',
    tier: determineTier(KUBIXbalance),
    nextReward: 'Shirt',
    tasksCompleted: userDetails && userDetails.tasksCompleted ? userDetails.tasksCompleted : 0,
    percentage: userPercentage? (userPercentage * 100) : 0,

  };

  const nextTierInfo = tierInfo[userInfo.tier];

  const tierImage = tierInfo[userInfo.tier].image;

  const animatedKubix = useSpring({ 
    kubix: userInfo.kubixEarned, 
    from: { kubix: 0 },
    config: { duration: 1700 },
    onRest: () => setCountFinished(true),
  });
  

  const animationProps = prefersReducedMotion
    ? {}
    : {
        animation: `${glowAnimation} alternate 2.1s ease-in-out`,
      };


      const nextTierKUBIX = 1500;

    let progressPercentage = (userInfo.kubixEarned / nextTierInfo.nextTierKUBIX) * 100;
    console.log(userDetails);

    useEffect(() => {
        if ((userInfo.kubixEarned / nextTierInfo.nextTierKUBIX) * 100 > 100) {
          setUpgradeAvailable(true);
          progressPercentage = 100;
        }
      }, [userInfo.kubixEarned, nextTierInfo.nextTierKUBIX]);


    const getProgressBarAnimation = (percentage) => keyframes`
        0% { width: 0%; }
        100% { width: ${percentage}%; }
    `;

    const progressAnimation = prefersReducedMotion
    ? {}
    : {
        animation: `${getProgressBarAnimation(progressPercentage)} 2s ease-out forwards`,
      };
  return (
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
                KUBIX Earned {' '}
                {countFinished ? (
                <chakra.span {...animationProps}>{userInfo.kubixEarned}</chakra.span>

            ) : (
                <animated.span>
                    {animatedKubix.kubix.to(kubix => kubix.toFixed(0))}
                </animated.span>)}
                </Text>

            <Text pl={6} pb={4} fontSize="lg">This makes you top {userInfo.percentage}% of Contributors</Text>
          </VStack>
            <VStack p={0} pt={4} align="center" >
                <Text fontSize="3xl" fontWeight="bold">{userInfo.tier} Member</Text>
                <Image src={tierImage} alt="KUBC Logo"  maxW="45%" />
                <Progress
                    value={progressPercentage}
                    max={100} 
                    width="70%"
                    colorScheme="green"
                    height="20px"
                    borderRadius="md"
                    sx={{
                        '& > div': {
                        ...progressAnimation,
                        },
                    }}
                    
                    />

                
                <HStack>
                    <Text fontSize="xl" fontWeight="bold">Next Tier: {nextTierInfo.nextTier}</Text>
                    <Text>({userInfo.kubixEarned}/{nextTierInfo.nextTierKUBIX})</Text>
                </HStack>
                <Spacer />
                {upgradeAvailable && (
                <Button mt={6}colorScheme="blue">Upgrade Tier</Button>)}
            </VStack>
            <VStack  pl={6} pb={4} align="flex-start" spacing={2}>
                <Text fontSize= "2xl" fontWeight="bold">Next Reward: {nextTierInfo.nextTierReward}</Text>
                <Button colorScheme="green">Browse all</Button>
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
          {/* <IconButton
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
        /> */}
        
        {/* <AccountSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
      /> */}
        <HStack pb={4} pt={2}  spacing="27%">
            <VStack align={'flex-start'} ml="6%" spacing={1}>
                <Text   fontWeight="bold" fontSize="md">Semester KUBIX: {userInfo.semesterKubix}</Text>
                <Text  fontWeight="bold" fontSize="md">Year KUBIX: {userInfo.yearKubix}</Text>
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

            {/* <HStack spacing="3.5%" pb={2} ml={4} mr={4} pt={4}>
                {((claimedTasks && claimedTasks.length > 0) ? claimedTasks : reccomendedTasks)?.slice(0, 3).map((task) => (
                    <Box key={task.id} w="31%" _hover={{ boxShadow: "md", transform: "scale(1.07)"}} p={4} borderRadius="2xl" overflow="hidden" bg="black">
                        <Link2 href={`/tasks/?task=${task.id}&projectId=${task.projectId}`}>
                            <VStack textColor="white" align="stretch" spacing={3}>
                                <Text fontSize="md" lineHeight="99%" fontWeight="extrabold">
                                    {task.name.length > 57 ? `${task.name.substring(0, 57)}...` : task.name}
                                </Text>
                                <HStack justify="space-between">
                                    <Badge colorScheme="yellow">{task.difficulty}</Badge>
                                    <Text fontWeight="bold">KUBIX {task.kubixPayout}</Text>
                                </HStack>
                            </VStack>
                        </Link2>
                    </Box>
                ))}
            </HStack> */}

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

        {/* <OngoingPolls  OngoingPolls={kubidOngoingProposals}/> */}

        
        
   
            


            
        </Box>
        

        </GridItem>
        
      </Grid>
    </Box>
  );
};

export default UserDashboard;