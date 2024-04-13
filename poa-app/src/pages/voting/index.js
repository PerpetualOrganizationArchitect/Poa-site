// Code to display the voting page for a specific DAO
import React, { useState, useEffect, use } from "react";
import {
  HStack,
  Text,
  Box,
  useDisclosure,
  Flex,
  Grid,
  Container,
  Spacer,
  VStack,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  Collapse,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  RadioGroup,
  Stack,
  Radio,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

import HeadingVote from "@/templateComponents/studentOrgDAO/voting/header";



import { BarChart, Bar, XAxis, YAxis } from "recharts";
import CountDown from "@/templateComponents/studentOrgDAO/voting/countDown";
import { IconButton } from "@chakra-ui/react";
import PollModal from "@/templateComponents/studentOrgDAO/voting/pollModal";
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";



import { useRouter } from "next/router";

import Navbar from "@/templateComponents/studentOrgDAO/NavBar";

import { useGraphContext } from "@/context/graphContext";
import { useWeb3Context } from "@/context/web3Context";


const glassLayerStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(20px)",
  backgroundColor: "rgba(0, 0, 0, .73)",
};

const glassLayerStyle2 = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(20px)",
  backgroundColor: "rgba(0, 0, 0, .73)",
};

const Voting = () => {
  const router = useRouter();
  const { userDAO } = router.query;

  const {createProposalDDVoting, getWinnerDDVoting, ddVote } = useWeb3Context();
  const {directDemocracyVotingContractAddress, hybridVotingContractAddress, partcipationTokenContractAddress, setLoaded, democracyVotingOngoing, democracyVotingCompleted, account, participationVotingCompleted, participationVotingOngoing, votingContractAddress } = useGraphContext();

  useEffect(() => {
    setLoaded(userDAO);
  }, [userDAO]);

  // Function to calculate the remaining time until the proposal expires
  function calculateRemainingTime(expirationTimestamp, proposalId, bool) {
    // Current timestamp in seconds
    const currentTimestamp = Math.floor(Date.now() / 1000);
    
    // Calculate the duration
    const duration = expirationTimestamp - currentTimestamp;
  

    // if duration is negative call get winner function
    
    async function getWinner(Address, proposalId) {
      let newID = proposalId.split("-")[0];
      const tx= await getWinnerDDVoting(Address, newID);
      tx.wait();

  
    }

    if (duration < 0 && account !="0x00"&& bool) {
      getWinner(directDemocracyVotingContractAddress, proposalId);
       
    }
    if (duration < 0 && account !="0x00"&& !bool) {
      getWinner(votingContractAddress, proposalId);
    }
  
    return Math.max(0, duration);

    
  }




  const [selectedTab, setSelectedTab] = useState(0);

  // State hooks to manage displayed proposals
  const [ongoingStartIndexDemocracy, setongoingStartIndexDemocracy] = useState(0); // Index to start displaying ongoing proposals from
  const proposalDisplayLimit = 3; 

  const [ongoingStartIndexParticipation, setongoingStartIndexParticipation] = useState(0); // Index to start displaying ongoing proposals from



  const[completedStartIndexDemocracy, setcompletedStartIndexDemocracy] = useState(0);
  const[completedStartIndexParticipation, setcompletedStartIndexParticipation] = useState(0);

  const safeDemocracyVotingCompleted = Array.isArray(democracyVotingCompleted) ? democracyVotingCompleted : [];

  const safeParticipationVotingCompleted = Array.isArray(participationVotingCompleted) ? participationVotingCompleted : [];

  const displayedCompletedProposals = safeDemocracyVotingCompleted.slice(
    completedStartIndexDemocracy,
    completedStartIndexDemocracy + proposalDisplayLimit
  );

  const displayedCompletedParticipationProposals = safeParticipationVotingCompleted.slice(
    completedStartIndexParticipation,
    completedStartIndexParticipation + proposalDisplayLimit
  );

  // Calculated slices of proposals to display based on the current index and limit
  const safeDemocracyVotingOngoing = Array.isArray(democracyVotingOngoing) ? democracyVotingOngoing : [];

  const safeParticipationVotingOngoing = Array.isArray(participationVotingOngoing) ? participationVotingOngoing : [];


  const displayedOngoingProposals = safeDemocracyVotingOngoing.slice(
    ongoingStartIndexDemocracy,
    ongoingStartIndexDemocracy + proposalDisplayLimit
  );

  const displayedOngoingParticipationProposals = safeParticipationVotingOngoing.slice(
    ongoingStartIndexParticipation,
    ongoingStartIndexParticipation + proposalDisplayLimit
  );

  // Handlers for navigation buttons
  const handlePreviousProposalsClickOngoingDemocracy = () => {
    setongoingStartIndexDemocracy(Math.max(0, ongoingStartIndexDemocracy - proposalDisplayLimit));
  };

  const handlePreviousProposalsClickCompletedParticipation = () => {
    setcompletedStartIndexParticipation(Math.max(0, completedStartIndexParticipation - proposalDisplayLimit));
  };


  const handleNextProposalsClickOngoingDemocracy = () => {
    if (ongoingStartIndexDemocracy + proposalDisplayLimit < democracyVotingOngoing.length) {
      setongoingStartIndexDemocracy(ongoingStartIndexDemocracy + proposalDisplayLimit);
    }
  };

  const handleNextProposalsClickOngoingParticipation = () => {
    if (ongoingStartIndexParticipation + proposalDisplayLimit < participationVotingOngoing.length) {
      setongoingStartIndexParticipation(ongoingStartIndexParticipation + proposalDisplayLimit);
    }
  };

  const handlePreviousProposalsClickCompletedDemocracy = () => {
    setcompletedStartIndexDemocracy(Math.max(0, completedStartIndexDemocracy - proposalDisplayLimit));
  };

  const handlePreviousProposalsClickOngoingParticipation = () => {
    setongoingStartIndexParticipation(Math.max(0, ongoingStartIndexParticipation - proposalDisplayLimit));
  };

  const handleNextProposalsClickCompletedDemocracy = () => {
    if (completedStartIndexDemocracy + proposalDisplayLimit < democracyVotingCompleted.length) {
      setcompletedStartIndexDemocracy(completedStartIndexDemocracy + proposalDisplayLimit);
    }
  };

  const handleNextProposalsClickCompletedParticipation = () => {
    if (completedStartIndexParticipation + proposalDisplayLimit < participationVotingCompleted.length) {
      setcompletedStartIndexParticipation(completedStartIndexParticipation + proposalDisplayLimit);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedPoll, setSelectedPoll] = useState(null);

  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showCreateVote, setShowCreateVote]= useState(false);


  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [selectedOption, setSelectedOption] = useState("");

  const handlePollCreated = () => {
    function run() {
      if (voteType === "Democracy") {
        return createProposalDDVoting(directDemocracyVotingContractAddress, proposal.name, proposal.description, proposal.time, proposal.options, 0, account, 0, false);
      }
      if(voteType === "Participation"){
        console.log("Participation Voting");
        console.log("address", votingContractAddress);
        return createProposalDDVoting(votingContractAddress, proposal.name, proposal.description, proposal.time, proposal.options, 0, account, 0, false);
      }
    }
    setLoadingSubmit(true);
    console.log("Poll Created");
    console.log("address", directDemocracyVotingContractAddress);
    console.log("proposal", proposal);
    
    run().then(() => {
        setLoadingSubmit(false);
        setShowCreatePoll(false);
        setProposal(defaultProposal);
        
    }).catch((error) => {
        // Handle any errors that occur during the run
        console.error("Error creating poll:", error);
        setLoadingSubmit(false);
        setShowCreatePoll(false);
        setProposal(defaultProposal);
    });
};




  const handlePollClick = (poll) => {
    console.log(poll);
    setSelectedPoll(poll);
    router.push(`/voting?poll=${poll.id}&userDAO=${userDAO}`);
    onOpen();
  };


  const defaultProposal = { name: '', description: '', execution: '', time: 0, options: [] ,id:0 }
  const [proposal, setProposal] = useState(defaultProposal)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProposal({ ...proposal, [name]: value });
    console.log("input change");
  };

  const [voteType, setVoteType] = useState("Democracy");

  const handleTabsChange = (index) => {
    setSelectedTab(index);
    if (index == 0) {
      setVoteType("Democracy");
    } else {
      setVoteType("Participation");
    }
  };

  const handleOptionsChange = (e) => {
     const options = e.target.value.split(", ");
    setProposal({ ...proposal, options });
    console.log("handing option");
  };

  const handleCreatePollClick = () => {
    setShowCreatePoll(!showCreatePoll);
   
  };

    // useEffect(() => {
    //   console.log("router.query.poll: ", router.query.poll);

    //   if (router.query.poll !== undefined && loaded) {
    //     console.log("router.query.poll: ", router.query.poll);
    //     // find poll with index poll
    //     const poll = kubidOngoingProposals.find(
    //       (poll) => poll.id === router.query.poll
    //     );
    //     console.log("poll: ", poll);
    //     setSelectedPoll(poll);
    //     onOpen();
    //   }
    // }, [router.query.poll, kubidOngoingProposals, loaded]);

  return (
    <>
      <Navbar />
      <Container maxW="container.2xl" py={6} px={10}>
        <HeadingVote selectedTab={selectedTab} />

        <Tabs
          isFitted
          variant="soft-rounded"
          onChange={handleTabsChange}
          mb={6}
        >
          <TabList
            alignItems="center"
            justifyContent="center"
            borderRadius="3xl"
            boxShadow="lg"
            p={6}
            w="100%"
            bg="transparent"
            position="relative"
            display="flex"
            zIndex={0}
            color="rgba(333, 333, 333, 1)"
          >
            <div className="glass" style={glassLayerStyle} />
            <Tab
              fontSize="2xl"
              fontWeight="extrabold"
              color="rgba(333, 333, 333, 1)"
              _selected={{ backgroundColor: "ghostwhite", color: "black" }}
            >
              Votes
            </Tab>
            <Tab
              fontSize="2xl"
              fontWeight="extrabold"
              color="rgba(333, 333, 333, 1)"
              _selected={{ backgroundColor: "ghostwhite", color: "black" }}
            >
              Polls
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Flex
                align="center"
                mb={8}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                borderRadius="3xl"
                boxShadow="lg"
                p="2%"
                w="100%"
                bg="transparent"
                position="relative"
                display="flex"
                zIndex={0}
              >
                <div className="glass" style={glassLayerStyle} />

                <Flex w="100%" flexDirection="column">
                  <VStack alignItems={"flex-start"} spacing={8}>
                    {/* Ongoing Votes */}

                    <HStack w="100%" justifyContent="space-between">
                      <Heading pl={2} color="rgba(333, 333, 333, 1)">
                        Ongoing Votes{" "}
                      </Heading>
                      <Button
                        fontWeight="black"
                        p="2%"
                        w="20%"
                        bg="green.300"
                        mt="2%"
                        onClick={handleCreatePollClick}
                        _hover={{ bg: "green.400", transform: "scale(1.05)" }}
                      >
                        {selectedTab === 0
                          ? showCreateVote
                            ? "Hide Create Vote Form"
                            : "Create Vote"
                          : showCreatePoll
                          ? "Hide Create Poll Form"
                          : "Create Poll"} 
                      </Button>
                    </HStack>
                    <HStack justifyContent={"flex-start"} w="100%" spacing={4}>
              {displayedOngoingProposals.length > 0 ? (
                displayedOngoingProposals.map((proposal, index) => (
                  <Box key={index} flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="3xl"
                  boxShadow="lg"
                  display="flex"
                  w="30%"
                  minW="30%"
                  maxWidth="30%"
                  bg="transparent"
                  position="relative"
                  color="rgba(333, 333, 333, 1)"
                  p={2}
                  zIndex={1} 
                    _hover={{ bg: "black", boxShadow: "md", transform: "scale(1.05)"}}
                    onClick={() => handlePollClick(proposal)}>
                    <div className="glass" style={glassLayerStyle} />
                    <Text mb ="4" fontSize="xl" fontWeight="extrabold">{proposal.name}</Text>
                    <CountDown duration={calculateRemainingTime(proposal?.experationTimestamp, proposal?.id, true)} />
                    <Text mt="2"> Voting Options:</Text>
                    <HStack mb={2} spacing={6}>
                      {proposal.options.map((option, index) => (
                        <Text fontSize= "sm" fontWeight="extrabold" key={index}>{option.name}</Text>
                      ))}
                    </HStack>            
                  </Box>
                ))
              ) : (
                  <Box flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="3xl"
                    boxShadow="lg"
                    display="flex"
                    w="100%"
                    maxWidth="100%"
                    bg="transparent"
                    position="relative"
                    p={4}
                    zIndex={1}
                    color="rgba(333, 333, 333, 1)">
                    <div className="glass" style={glassLayerStyle} />
                    <Flex
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center">
                      <Text
                        mb="2"
                        fontSize="2xl"
                        fontWeight="extrabold"
                        pl={12}
                        pr={12}
                        pt={14}
                        pb={14}
                      >
                        No Ongoing Votes
                      </Text>
                    </Flex>
                  </Box>

              )}
              {displayedOngoingProposals.length > 0 ? (
              <>
              <Spacer />
              <HStack justifyContent="bottom" spacing={4}>
              <IconButton
                  aria-label="Previous polls"
                  background="transparent"
                  border="none" 
                  _hover={{ bg: 'transparent' }} 
                  _active={{ bg: 'transparent' }} 
                  icon={
                    <ArrowBackIcon 
                    boxSize="6" // smaller size
                    color="black"
                    />
                  }
                  onClick={handlePreviousProposalsClickOngoingDemocracy}
                />
                <IconButton
                  aria-label="Next polls"
                  background="transparent"
                  border="none" 
                  _hover={{ bg: 'transparent' }} 
                  _active={{ bg: 'transparent' }} 
                  icon={
                    <ArrowForwardIcon 
                    boxSize="6" // smaller size
                    color="black"
                    />
                  }
                  onClick={handleNextProposalsClickOngoingDemocracy}
                />
                
              </HStack>
            </>
              ) : null}
            </HStack>

                    {/*HStack needs to go here*/}

                    {/* List ongoing votes here */}

                    {/* History */}
                    <Heading pl={2} color="rgba(333, 333, 333, 1)">
                      History{" "}
                    </Heading>
                     <HStack spacing={4} w="100%" justifyContent="flex-start">
                      {displayedCompletedProposals.length > 0 ? (
                        displayedCompletedProposals.map((proposal, index) => {
                          const totalVotes = proposal.totalVotes;

                          const WinnerName = proposal.options[proposal.winningOptionIndex].name;
                  
                          const predefinedColors = [
                            "red",
                            "darkblue",
                            "yellow",
                            "purple",
                          ];
                          const data = [
                            {
                              name: "Options",
                              values: proposal.options.map((option, index) => {
                                const color =
                                  index < predefinedColors.length
                                    ? predefinedColors[index]
                                    : `rgba(${Math.random() * 255}, ${
                                        Math.random() * 255
                                      }, ${Math.random() * 255}, 1)`;
                                return {
                                  value:
                                    (
                                      option.votes
                                     /
                                      totalVotes) *
                                    100,
                                  color: color,
                                };
                              }),
                            },
                          ];

                          return (
                            <Box
                              key={index}
                              flexDirection="column"
                              alignItems="center"
                              justifyContent="center"
                              borderRadius="3xl"
                              boxShadow="lg"
                              display="flex"
                              w="30%"
                              minW="30%"
                              maxWidth="30%"
                              bg="transparent"
                              position="relative"
                              color="rgba(333, 333, 333, 1)"
                              zIndex={1}
                            >
                              <div className="glass" style={glassLayerStyle} />
                              <Text
                                mr="2"
                                mt="4"
                                ml="2 "
                                mb="2"
                                fontSize={"xl"}
                                fontWeight="extrabold"
                              >
                                {proposal.name}
                              </Text>
                              <Flex justifyContent="center">
                                <BarChart
                                  width={200}
                                  height={30}
                                  layout="vertical"
                                  data={data}
                                >
                                  <XAxis type="number" hide="true" />
                                  <YAxis
                                    type="category"
                                    dataKey="name"
                                    hide="true"
                                  />
                                  {data[0].values.map((option, index) => (
                                    <Bar
                                      key={index}
                                      dataKey={`values[${index}].value`}
                                      stackId="a"
                                      fill={option.color}
                                    />
                                  ))}
                                </BarChart>
                              </Flex>

                              <Text mb="2" fontSize="xl" fontWeight="extrabold">
                                Winner: {WinnerName}
                              </Text>
                            </Box>
                          );
                        })
                      ) : (
                        <Box
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="3xl"
                          boxShadow="lg"
                          display="flex"
                          w="100%"
                          maxWidth="100%"
                          bg="transparent"
                          position="relative"
                          p={4}
                          zIndex={1}
                          color="rgba(333, 333, 333, 1)"
                        >
                          <div className="glass" style={glassLayerStyle} />
                          <Flex
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Text
                              mb="2"
                              fontSize="2xl"
                              fontWeight="extrabold"
                              pl={12}
                              pr={12}
                              pt={14}
                              pb={14}
                            >
                              No History
                            </Text>
                          </Flex>
                        </Box>
                      )}
                      {displayedCompletedProposals.length > 0 ? (
                        <>
                          <Spacer />
                          <HStack justifyContent="bottom" spacing={-2}>
                            <IconButton
                              background="transparent"
                              border="none"
                              _hover={{ bg: "transparent" }}
                              _active={{ bg: "transparent" }}
                              aria-label="Previous history polls"
                              icon={
                                <ArrowBackIcon
                                  boxSize="6" // smaller size
                                  color="black"
                                />
                              }
                              onClick={handlePreviousProposalsClickCompletedDemocracy}
                            />
                            <IconButton
                              background="transparent"
                              border="none"
                              _hover={{ bg: "transparent" }}
                              _active={{ bg: "transparent" }}
                              aria-label="Next history polls"
                              icon={
                                <ArrowForwardIcon
                                  boxSize="6" // smaller size
                                  color="black"
                                />
                              }
                              onClick={handleNextProposalsClickCompletedDemocracy}
                            />
                          </HStack>
                        </>
                      ) : null}
                    </HStack> 
                  </VStack>
                </Flex>
              </Flex>

              {/* Create Vote Form */}
            </TabPanel>

            <TabPanel>
              <Flex
                align="center"
                mb={8}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                borderRadius="3xl"
                boxShadow="lg"
                p="2%"
                w="100%"
                bg="transparent"
                position="relative"
                display="flex"
                zIndex={0}
              >
                <div className="glass" style={glassLayerStyle} />
                <Flex w="100%" flexDirection="column">
                  <VStack alignItems={"flex-start"} spacing={8}>
                  <HStack w="100%" justifyContent="space-between">
                      <Heading pl={2} color="rgba(333, 333, 333, 1)">
                        Ongoing Votes{" "}
                      </Heading>
                      <Button
                        fontWeight="black"
                        p="2%"
                        w="20%"
                        bg="green.300"
                        mt="2%"
                        onClick={handleCreatePollClick}
                        _hover={{ bg: "green.400", transform: "scale(1.05)" }}
                      >
                        {selectedTab === 0
                          ? showCreateVote
                            ? "Hide Create Vote Form"
                            : "Create Vote"
                          : showCreatePoll
                          ? "Hide Create Poll Form"
                          : "Create Poll"} 
                      </Button>
                    </HStack>
                    <HStack justifyContent={"flex-start"} w="100%" spacing={4}>
              {displayedOngoingParticipationProposals.length > 0 ? (
                displayedOngoingParticipationProposals.map((proposal, index) => (
                  <Box key={index} flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="3xl"
                  boxShadow="lg"
                  display="flex"
                  w="30%"
                  minW="30%"
                  maxWidth="30%"
                  bg="transparent"
                  position="relative"
                  color="rgba(333, 333, 333, 1)"
                  p={2}
                  zIndex={1} 
                    _hover={{ bg: "black", boxShadow: "md", transform: "scale(1.05)"}}
                    onClick={() => handlePollClick(proposal)}>
                    <div className="glass" style={glassLayerStyle} />
                    <Text mb ="4" fontSize="xl" fontWeight="extrabold">{proposal.name}</Text>
                    <CountDown duration={calculateRemainingTime(proposal?.experationTimestamp, proposal?.id, false)} />
                    <Text mt="2"> Voting Options:</Text>
                    <HStack mb={2} spacing={6}>
                      {proposal.options.map((option, index) => (
                        <Text fontSize= "sm" fontWeight="extrabold" key={index}>{option.name}</Text>
                      ))}
                    </HStack>            
                  </Box>
                ))
              ) : (
                  <Box flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="3xl"
                    boxShadow="lg"
                    display="flex"
                    w="100%"
                    maxWidth="100%"
                    bg="transparent"
                    position="relative"
                    p={4}
                    zIndex={1}
                    color="rgba(333, 333, 333, 1)">
                    <div className="glass" style={glassLayerStyle} />
                    <Flex
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center">
                      <Text
                        mb="2"
                        fontSize="2xl"
                        fontWeight="extrabold"
                        pl={12}
                        pr={12}
                        pt={14}
                        pb={14}
                      >
                        No Ongoing Votes
                      </Text>
                    </Flex>
                  </Box>

              )}
              {displayedOngoingParticipationProposals.length > 0 ? (
              <>
              <Spacer />
              <HStack justifyContent="bottom" spacing={4}>
              <IconButton
                  aria-label="Previous polls"
                  background="transparent"
                  border="none" 
                  _hover={{ bg: 'transparent' }} 
                  _active={{ bg: 'transparent' }} 
                  icon={
                    <ArrowBackIcon 
                    boxSize="6" // smaller size
                    color="black"
                    />
                  }
                  onClick={handlePreviousProposalsClickOngoingDemocracy}
                />
                <IconButton
                  aria-label="Next polls"
                  background="transparent"
                  border="none" 
                  _hover={{ bg: 'transparent' }} 
                  _active={{ bg: 'transparent' }} 
                  icon={
                    <ArrowForwardIcon 
                    boxSize="6" // smaller size
                    color="black"
                    />
                  }
                  onClick={handleNextProposalsClickOngoingDemocracy}
                />
                
              </HStack>
            </>
              ) : null}
            </HStack>

                    {/*HStack needs to go here*/}

                    {/* List ongoing votes here */}

                    {/* History */}
                    <Heading pl={2} color="rgba(333, 333, 333, 1)">
                      History{" "}
                    </Heading>
                     <HStack spacing={4} w="100%" justifyContent="flex-start">
                      {displayedCompletedParticipationProposals.length > 0 ? (
                        displayedCompletedParticipationProposals.map((proposal, index) => {
                          const totalVotes = proposal.totalVotes;

                          const WinnerName = proposal.options[proposal.winningOptionIndex].name;
                  
                          const predefinedColors = [
                            "red",
                            "darkblue",
                            "yellow",
                            "purple",
                          ];
                          const data = [
                            {
                              name: "Options",
                              values: proposal.options.map((option, index) => {
                                const color =
                                  index < predefinedColors.length
                                    ? predefinedColors[index]
                                    : `rgba(${Math.random() * 255}, ${
                                        Math.random() * 255
                                      }, ${Math.random() * 255}, 1)`;
                                return {
                                  value:
                                    (
                                      option.votes
                                     /
                                      totalVotes) *
                                    100,
                                  color: color,
                                };
                              }),
                            },
                          ];

                          return (
                            <Box
                              key={index}
                              flexDirection="column"
                              alignItems="center"
                              justifyContent="center"
                              borderRadius="3xl"
                              boxShadow="lg"
                              display="flex"
                              w="30%"
                              minW="30%"
                              maxWidth="30%"
                              bg="transparent"
                              position="relative"
                              color="rgba(333, 333, 333, 1)"
                              zIndex={1}
                            >
                              <div className="glass" style={glassLayerStyle} />
                              <Text
                                mr="2"
                                mt="4"
                                ml="2 "
                                mb="2"
                                fontSize={"xl"}
                                fontWeight="extrabold"
                              >
                                {proposal.name}
                              </Text>
                              <Flex justifyContent="center">
                                <BarChart
                                  width={200}
                                  height={30}
                                  layout="vertical"
                                  data={data}
                                >
                                  <XAxis type="number" hide="true" />
                                  <YAxis
                                    type="category"
                                    dataKey="name"
                                    hide="true"
                                  />
                                  {data[0].values.map((option, index) => (
                                    <Bar
                                      key={index}
                                      dataKey={`values[${index}].value`}
                                      stackId="a"
                                      fill={option.color}
                                    />
                                  ))}
                                </BarChart>
                              </Flex>

                              <Text mb="2" fontSize="xl" fontWeight="extrabold">
                                Winner: {WinnerName}
                              </Text>
                            </Box>
                          );
                        })
                      ) : (
                        <Box
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                          borderRadius="3xl"
                          boxShadow="lg"
                          display="flex"
                          w="100%"
                          maxWidth="100%"
                          bg="transparent"
                          position="relative"
                          p={4}
                          zIndex={1}
                          color="rgba(333, 333, 333, 1)"
                        >
                          <div className="glass" style={glassLayerStyle} />
                          <Flex
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Text
                              mb="2"
                              fontSize="2xl"
                              fontWeight="extrabold"
                              pl={12}
                              pr={12}
                              pt={14}
                              pb={14}
                            >
                              No History
                            </Text>
                          </Flex>
                        </Box>
                      )}
                      {displayedCompletedProposals.length > 0 ? (
                        <>
                          <Spacer />
                          <HStack justifyContent="bottom" spacing={-2}>
                            <IconButton
                              background="transparent"
                              border="none"
                              _hover={{ bg: "transparent" }}
                              _active={{ bg: "transparent" }}
                              aria-label="Previous history polls"
                              icon={
                                <ArrowBackIcon
                                  boxSize="6" // smaller size
                                  color="black"
                                />
                              }
                              onClick={handlePreviousProposalsClickCompletedDemocracy}
                            />
                            <IconButton
                              background="transparent"
                              border="none"
                              _hover={{ bg: "transparent" }}
                              _active={{ bg: "transparent" }}
                              aria-label="Next history polls"
                              icon={
                                <ArrowForwardIcon
                                  boxSize="6" // smaller size
                                  color="black"
                                />
                              }
                              onClick={handleNextProposalsClickCompletedDemocracy}
                            />
                          </HStack>
                        </>
                      ) : null}
                    </HStack> 
                  </VStack>
                </Flex>
              </Flex>
            </TabPanel>
            {/* Create Poll Form edited this*/}
            <Modal isOpen={showCreatePoll} onClose={handleCreatePollClick}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Create a Vote</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack
                    as="form"
                    onSubmit={handlePollCreated}
                    spacing={4}
                    mt={8}
                    w="100%"
                  >
                    <FormControl>
                      <FormLabel>Proposal title</FormLabel>
                      <Input
                        type="text"
                        name="name"
                        value={proposal.name}
                        onChange={handleInputChange}
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Proposal Description</FormLabel>
                      <Textarea
                        name="description"
                        value={proposal.description}
                        onChange={handleInputChange}
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Time (in Minutes)</FormLabel>
                      <Input
                        type="number"
                        name="time"
                        value={proposal.time}
                        onChange={handleInputChange}
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormControl>
                        <FormLabel>Options (comma and space seperated)</FormLabel>
                        <Textarea
                          name="options"
                          value={proposal.options.join(", ")}
                          onChange={handleOptionsChange}
                          placeholder="Option 1, Option 2, Option 3"
                          required
                        />
                      </FormControl>
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button
                    type="submit"
                    colorScheme="teal"
                    onClick={handlePollCreated}
                    isLoading={loadingSubmit}
                    loadingText="Handling Process"
                  >
                    Submit Poll
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </TabPanels>
        </Tabs>
        <PollModal
          isOpen={isOpen}
          onClose={onClose}
          handleVote={ddVote}
          contractAddress={selectedTab === 0 ? directDemocracyVotingContractAddress : votingContractAddress}
          // loadingVote={loadingVote}
          selectedPoll={selectedPoll}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          onOpen={onOpen}
        />
      </Container>
    </>
  );
};

export default Voting;
