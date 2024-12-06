import React, { useState, useEffect } from "react";
import {
  HStack,
  Text,
  Box,
  useDisclosure,
  Flex,
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
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { ArrowForwardIcon, ArrowBackIcon, AddIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useWeb3Context } from "@/context/web3Context";
import { usePOContext } from "@/context/POContext";
import { useVotingContext } from "@/context/VotingContext";
import CompletedPollModal from "@/templateComponents/studentOrgDAO/voting/CompletedPollModal";
import { useAccount } from "wagmi";

import Navbar from "@/templateComponents/studentOrgDAO/NavBar";
import HeadingVote from "@/templateComponents/studentOrgDAO/voting/header";
import CountDown from "@/templateComponents/studentOrgDAO/voting/countDown";
import PollModal from "@/templateComponents/studentOrgDAO/voting/pollModal";

const glassLayerStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(20px)",
  backgroundColor: "rgba(0, 0, 0, .8)",
};

const Voting = () => {
  const router = useRouter();
  const { userDAO } = router.query;

  const {
    createProposalDDVoting,
    getWinnerDDVoting,
    createProposalParticipationVoting,
    ddVote,
    account,
    createProposalElection
  } = useWeb3Context();
  
  const { isOpen: isCompletedOpen, onOpen: onCompletedOpen, onClose: onCompletedClose } = useDisclosure();

  const { address } = useAccount();
  const {
    directDemocracyVotingContractAddress,
    votingContractAddress,
    poContextLoading,
  } = usePOContext();

  const {
    hybridVotingOngoing,
    hybridVotingCompleted,
    democracyVotingOngoing,
    democracyVotingCompleted,
    participationVotingCompleted,
    participationVotingOngoing,
    votingType
  } = useVotingContext();

  const PTVoteType = votingType;

  const [votingTypeSelected, setVotingTypeSelected] = useState("Direct Democracy");

  const [showDetermineWinner, setShowDetermineWinner] = useState({});

  const calculateRemainingTime = (expirationTimestamp) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const duration = expirationTimestamp - currentTimestamp;
    return Math.max(0, duration);
  };
  
  const updateWinnerStatus = async (expirationTimestamp, proposalId, isHybrid) => {
    const duration = calculateRemainingTime(expirationTimestamp);
    if (duration <= 0 ) {
      setShowDetermineWinner(prevState => ({
        ...prevState,
        [proposalId]: true
      }));
    }
  };
  
  const getWinner = async (address, proposalId) => {
    const newID = proposalId.split("-")[0];
    const tx = await getWinnerDDVoting(address, newID);
  };
  
  const handleTabsChange = (index) => {
    setSelectedTab(index);
    const voteType = index === 0 ? "Direct Democracy" : PTVoteType;
    setVotingTypeSelected(voteType);
  };

  const [selectedTab, setSelectedTab] = useState(0);
  const [ongoingStartIndex, setOngoingStartIndex] = useState(0);
  const [completedStartIndex, setCompletedStartIndex] = useState(0);
  const proposalDisplayLimit = 3;
  const safeVotingOngoing = Array.isArray(selectedTab === 0 ? democracyVotingOngoing : (PTVoteType === "Hybrid" ? hybridVotingOngoing : participationVotingOngoing)) ? (selectedTab === 0 ? democracyVotingOngoing : ( PTVoteType=== "Hybrid" ? hybridVotingOngoing : participationVotingOngoing)) : [];
  const safeVotingCompleted = Array.isArray(selectedTab === 0 ? democracyVotingCompleted : (PTVoteType === "Hybrid" ? hybridVotingCompleted : participationVotingCompleted)) ? (selectedTab === 0 ? democracyVotingCompleted : (PTVoteType === "Hybrid" ? hybridVotingCompleted : participationVotingCompleted)) : [];
  
  useEffect(() => {
    safeVotingOngoing.forEach(proposal => {
      updateWinnerStatus(proposal?.experationTimestamp, proposal?.id, proposal?.isHybrid);
    });
  }, [safeVotingOngoing]);
  
  const displayedOngoingProposals = safeVotingOngoing.slice(
    ongoingStartIndex,
    ongoingStartIndex + proposalDisplayLimit
  );


  const displayedCompletedProposals = safeVotingCompleted.slice(
    completedStartIndex,
    completedStartIndex + proposalDisplayLimit
  );

  const handlePreviousProposalsClickOngoing = () => {
    setOngoingStartIndex(Math.max(0, ongoingStartIndex - proposalDisplayLimit));
  };

  const handleNextProposalsClickOngoing = () => {
    if (ongoingStartIndex + proposalDisplayLimit < safeVotingOngoing.length) {
      setOngoingStartIndex(ongoingStartIndex + proposalDisplayLimit);
    }
  };

  const handlePreviousProposalsClickCompleted = () => {
    setCompletedStartIndex(Math.max(0, completedStartIndex - proposalDisplayLimit));
  };

  const handleNextProposalsClickCompleted = () => {
    if (completedStartIndex + proposalDisplayLimit < safeVotingCompleted.length) {
      setCompletedStartIndex(completedStartIndex + proposalDisplayLimit);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isPollCompleted, setIsPollCompleted] = useState(false);

  const defaultProposal = {
    name: "",
    description: "",
    execution: "",
    time: 0,
    options: [],
    candidateNames: [],
    candidateAddresses: [],
    type: "normal",
    transferAddress: "",
    transferAmount: "",
    transferOption: "",
    id: 0,
  };
  const [proposal, setProposal] = useState(defaultProposal);

  const [candidateList, setCandidateList] = useState([
    { name: "", address: "" },
    { name: "", address: "" },
  ]);

  const handleProposalTypeChange = (e) => {
    const newType = e.target.value;
    setProposal({ ...proposal, type: newType });
    if (newType === "election") {
      // Reset candidates for election type
      setCandidateList([
        { name: "", address: "" },
        { name: "", address: "" },
      ]);
    }
  };

  const handlePollClick = (poll, isCompleted = false) => {
    setSelectedPoll(poll);
    setIsPollCompleted(isCompleted);
    router.push(`/voting?poll=${poll.id}&userDAO=${userDAO}`);
    if (isCompleted) {
      onCompletedOpen();
    } else {
      onOpen();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProposal({ ...proposal, [name]: value });
  };

  const handleOptionsChange = (e) => {
    const options = e.target.value.split(", ");
    setProposal({ ...proposal, options });
  };

  const handleCreatePollClick = () => {
    setShowCreatePoll(!showCreatePoll);
  };

  const handleTransferAddressChange = (e) => {
    setProposal({ ...proposal, transferAddress: e.target.value });
  };

  const handleTransferAmountChange = (e) => {
    setProposal({ ...proposal, transferAmount: e.target.value });
  };

  const handleTransferOptionChange = (e) => {
    setProposal({ ...proposal, transferOption: e.target.value });
  };

  const handleCandidateChange = (index, field, value) => {
    const updatedCandidates = [...candidateList];
    updatedCandidates[index][field] = value;
    setCandidateList(updatedCandidates);
  };

  const addCandidate = () => {
    setCandidateList([...candidateList, { name: "", address: "" }]);
  };

  useEffect(() => {
    if (router.query.poll) {
      const pollID = router.query.poll;

      const findPoll = (proposals) => {
        for (const proposal of proposals) {
          if (proposal.id === pollID) {
            return proposal;
          }
        }
        return null;
      };

      let pollFound = null;
      let pollType = "";

      if (Array.isArray(democracyVotingOngoing) && democracyVotingOngoing.length > 0) {
        pollFound = findPoll(democracyVotingOngoing);
        if (pollFound) pollType = "Direct Democracy";
      }
      
      if (!pollFound && Array.isArray(hybridVotingOngoing) && hybridVotingOngoing.length > 0) {
        pollFound = findPoll(hybridVotingOngoing);
        if (pollFound) pollType = "Hybrid";
      }

      if (!pollFound && Array.isArray(participationVotingOngoing) && participationVotingOngoing.length > 0) {
        pollFound = findPoll(participationVotingOngoing);
        if (pollFound) pollType = "Participation";
      }

      if (!pollFound && Array.isArray(democracyVotingCompleted) && democracyVotingCompleted.length > 0) {
        pollFound = findPoll(democracyVotingCompleted);
        if (pollFound) pollType = "Direct Democracy";
      }

      if (!pollFound && Array.isArray(hybridVotingCompleted) && hybridVotingCompleted.length > 0) {
        pollFound = findPoll(hybridVotingCompleted);
        if (pollFound) pollType = "Hybrid";
      }

      if (!pollFound && Array.isArray(participationVotingCompleted) && participationVotingCompleted.length > 0) {
        pollFound = findPoll(participationVotingCompleted);
        if (pollFound) pollType = "Participation";
      }

      if (pollFound) {
        setSelectedPoll(pollFound);
        setVotingTypeSelected(pollType);
        setSelectedTab(pollType === "Direct Democracy" ? 0 : 1);
        setIsPollCompleted(
          (Array.isArray(democracyVotingCompleted) && democracyVotingCompleted.includes(pollFound)) ||
          (Array.isArray(hybridVotingCompleted) && hybridVotingCompleted.includes(pollFound)) ||
          (Array.isArray(participationVotingCompleted) && participationVotingCompleted.includes(pollFound))
        );
        if (
          (Array.isArray(democracyVotingCompleted) && democracyVotingCompleted.includes(pollFound)) ||
          (Array.isArray(hybridVotingCompleted) && hybridVotingCompleted.includes(pollFound)) ||
          (Array.isArray(participationVotingCompleted) && participationVotingCompleted.includes(pollFound))
        ) {
          onCompletedOpen();
        } else {
          onOpen();
        }
      }
    }
  }, [
    router.query.poll,
    democracyVotingOngoing,
    democracyVotingCompleted,
    hybridVotingOngoing,
    hybridVotingCompleted,
    participationVotingOngoing,
    participationVotingCompleted,
    onOpen,
    onCompletedOpen
  ]);

  const handlePollCreated = async () => {
    setLoadingSubmit(true);
    try {
      const last = proposal.type === "transferFunds";
      const election = proposal.type === "election";

      if (election) {
        // For an election, the candidate names will serve as the 'options'
        const candidateNames = candidateList.map(c => c.name);
        const candidateAddresses = candidateList.map(c => c.address);
        // Assign candidateNames to proposal.options for the contract call
        proposal.candidateNames = candidateNames;
        proposal.candidateAddresses = candidateAddresses;
        proposal.options = candidateNames;

        await createProposalElection(
          directDemocracyVotingContractAddress,
          proposal.name,
          proposal.description,
          proposal.time,
          proposal.options,             // options replaced by candidate names
          proposal.candidateAddresses,  // candidate addresses
          proposal.candidateNames,      // candidate names
          0, 
          "0x0000000000000000000000000000000000000000",
          "0",
          false
        );
      } else {
        // Normal or Transfer Funds
        await createProposalDDVoting(
          directDemocracyVotingContractAddress,
          proposal.name,
          proposal.description,
          proposal.time,
          proposal.options,
          last ? proposal.transferOption : 0,
          last ? proposal.transferAddress : address,
          last ? proposal.transferAmount : "0",
          last
        );
      }

      setLoadingSubmit(false);
      setShowCreatePoll(false);
      setProposal(defaultProposal);
    } catch (error) {
      console.error("Error creating poll:", error);
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      <Navbar />
      {poContextLoading ? (
        <Center height="90vh">
          <Spinner size="xl" />
        </Center>
      ) : (
        <Container maxW="container.2xl" py={4} px={"3.8%"}>
          <HeadingVote selectedTab={selectedTab} PTVoteType={PTVoteType} />
          <Tabs
            index={selectedTab}
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
                Direct Democracy
              </Tab>
              <Tab
                fontSize="2xl"
                fontWeight="extrabold"
                color="rgba(333, 333, 333, 1)"
                _selected={{ backgroundColor: "ghostwhite", color: "black" }}
              >
                {PTVoteType }
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
                    <VStack alignItems={"flex-start"} spacing={6}>
                      <HStack w="100%" justifyContent="space-between">
                        <Heading pl={2} color="rgba(333, 333, 333, 1)">
                          Ongoing Votes
                        </Heading>
                        <Button
                          fontWeight="black"
                          p="1%"
                          w="20%"
                          bg="green.300"
                          mt="1%"
                          onClick={handleCreatePollClick}
                          _hover={{ bg: "green.400", transform: "scale(1.05)" }}
                        >
                          {showCreatePoll ? "Hide Create Vote Form" : "Create Vote"}
                        </Button>
                      </HStack>
                      <HStack justifyContent={"flex-start"} w="100%" spacing={4}>
                        {displayedOngoingProposals.length > 0 ? (
                          displayedOngoingProposals.map((proposal, index) => (
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
                              p={2}
                              zIndex={1}
                              _hover={{ bg: "black", boxShadow: "md", transform: "scale(1.05)" }}
                              onClick={() => {
                                if (!showDetermineWinner[proposal.id]) {
                                  handlePollClick(proposal);
                                }
                              }}
                            >
                              <div className="glass" style={glassLayerStyle} />
                              <Text mb="4" fontSize="xl" fontWeight="extrabold">{proposal.name}</Text>
                                {showDetermineWinner[proposal.id] ? (
                                  <Button
                                    colorScheme="gray"
                                    size="sm"
                                    onClick={() => {
                                      getWinner(proposal.type === "Direct Democracy" ? directDemocracyVotingContractAddress : votingContractAddress, proposal.id);
                                    }}
                                  >
                                    Determine Winner
                                  </Button>
                                ) : (
                                  <CountDown duration={calculateRemainingTime(proposal?.experationTimestamp)} />
                                )}
                              <Text mt="2"> Voting Options:</Text>
                              <HStack mb={2} spacing={6}>
                                {proposal.options.map((option, index) => (
                                  <Text fontSize="sm" fontWeight="extrabold" key={index}>{option.name}</Text>
                                ))}
                              </HStack>
                            </Box>
                          ))
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
                                No Ongoing Votes
                              </Text>
                            </Flex>
                          </Box>
                        )}
                        {displayedOngoingProposals.length > 0 && (
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
                                  boxSize="6" 
                                  color="black"
                                  />
                                }
                                onClick={handlePreviousProposalsClickOngoing}
                              />
                              <IconButton
                                aria-label="Next polls"
                                background="transparent"
                                border="none"
                                _hover={{ bg: 'transparent' }} 
                                _active={{ bg: 'transparent' }}
                                icon={
                                  <ArrowForwardIcon 
                                  boxSize="6" 
                                  color="black"
                                  />
                                }
                                onClick={handleNextProposalsClickOngoing}
                              />
                            </HStack>
                          </>
                        )}
                      </HStack>
                      <Heading pl={2} color="rgba(333, 333, 333, 1)">
                        History
                      </Heading>
                      <HStack spacing={4} w="100%" justifyContent="flex-start">
                        {displayedCompletedProposals.length > 0 ? (
                          displayedCompletedProposals.map((proposal, index) => {
                            const totalVotes = proposal.totalVotes;
                            let WinnerName = proposal.options[proposal.winningOptionIndex]?.name || "No Winner";
                            if (proposal.validWinner === false) {
                              WinnerName = "No Winner";
                            }

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
                                      : `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;
                                  return {
                                    value: (option.votes / totalVotes) * 100,
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
                                onClick = {() => handlePollClick(proposal, true)}
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
                                    <YAxis type="category" dataKey="name" hide="true" />
                                    {data[0].values.map((option, index) => (
                                      <Bar key={index} dataKey={`values[${index}].value`} stackId="a" fill={option.color} />
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
                        {displayedCompletedProposals.length > 0 && (
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
                                    boxSize="6"
                                    color="black"
                                  />
                                }
                                onClick={handlePreviousProposalsClickCompleted}
                              />
                              <IconButton
                                background="transparent"
                                border="none"
                                _hover={{ bg: "transparent" }}
                                _active={{ bg: "transparent" }}
                                aria-label="Next history polls"
                                icon={
                                  <ArrowForwardIcon
                                    boxSize="6"
                                    color="black"
                                  />
                                }
                                onClick={handleNextProposalsClickCompleted}
                              />
                            </HStack>
                          </>
                        )}
                      </HStack>
                    </VStack>
                  </Flex>
                </Flex>
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
                    <VStack alignItems={"flex-start"} spacing={6}>
                      <HStack w="100%" justifyContent="space-between">
                        <Heading pl={2} color="rgba(333, 333, 333, 1)">
                          Ongoing Votes
                        </Heading>
                        <Button
                          fontWeight="black"
                          p="1%"
                          w="20%"
                          bg="green.300"
                          mt="1%"
                          onClick={handleCreatePollClick}
                          _hover={{ bg: "green.400", transform: "scale(1.05)" }}
                        >
                          {showCreatePoll ? "Hide Create Vote Form" : "Create Vote"}
                        </Button>
                      </HStack>
                      <HStack justifyContent={"flex-start"} w="100%" spacing={4}>
                        {displayedOngoingProposals.length > 0 ? (
                          displayedOngoingProposals.map((proposal, index) => (
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
                              p={2}
                              zIndex={1}
                              _hover={{ bg: "black", boxShadow: "md", transform: "scale(1.05)" }}
                              onClick={() => {
                                if (!showDetermineWinner[proposal.id]) {
                                  handlePollClick(proposal);
                                }
                              }}
                            >
                              <div className="glass" style={glassLayerStyle} />
                              <Text mb="4" fontSize="xl" fontWeight="extrabold">{proposal.name}</Text>
                              {showDetermineWinner[proposal.id] ? (
                                  <Button
                                    colorScheme="gray"
                                    size="sm"
                                    onClick={() => {
                                      getWinner(proposal.type === "Direct Democracy" ? directDemocracyVotingContractAddress : votingContractAddress, proposal.id);
                                    }}
                                  >
                                    Determine Winner
                                  </Button>
                                ) : (
                                  <CountDown duration={calculateRemainingTime(proposal?.experationTimestamp)} />
                                )}
                              <Text mt="2"> Voting Options:</Text>
                              <HStack mb={2} spacing={6}>
                                {proposal.options.map((option, index) => (
                                  <Text fontSize="sm" fontWeight="extrabold" key={index}>{option.name}</Text>
                                ))}
                              </HStack>
                            </Box>
                          ))
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
                                No Ongoing Votes
                              </Text>
                            </Flex>
                          </Box>
                        )}
                        {displayedOngoingProposals.length > 0 && (
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
                                  boxSize="6" 
                                  color="black"
                                  />
                                }
                                onClick={handlePreviousProposalsClickOngoing}
                              />
                              <IconButton
                                aria-label="Next polls"
                                background="transparent"
                                border="none"
                                _hover={{ bg: 'transparent' }} 
                                _active={{ bg: 'transparent' }}
                                icon={
                                  <ArrowForwardIcon 
                                  boxSize="6" 
                                  color="black"
                                  />
                                }
                                onClick={handleNextProposalsClickOngoing}
                              />
                            </HStack>
                          </>
                        )}
                      </HStack>
                      <Heading pl={2} color="rgba(333, 333, 333, 1)">
                        History
                      </Heading>
                      <HStack spacing={4} w="100%" justifyContent="flex-start">
                        {displayedCompletedProposals.length > 0 ? (
                          displayedCompletedProposals.map((proposal, index) => {
                            const totalVotes = proposal.totalVotes;
                            let WinnerName = proposal.options[proposal.winningOptionIndex]?.name || "No Winner";
                            if (proposal.validWinner === false) {
                              WinnerName = "No Winner";
                            }

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
                                      : `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`;
                                  return {
                                    value: (option.votes / totalVotes) * 100,
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
                                onClick={() => handlePollClick(proposal, true)}
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
                                    <YAxis type="category" dataKey="name" hide="true" />
                                    {data[0].values.map((option, index) => (
                                      <Bar key={index} dataKey={`values[${index}].value`} stackId="a" fill={option.color} />
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
                        {displayedCompletedProposals.length > 0 && (
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
                                    boxSize="6"
                                    color="black"
                                  />
                                }
                                onClick={handlePreviousProposalsClickCompleted}
                              />
                              <IconButton
                                background="transparent"
                                border="none"
                                _hover={{ bg: "transparent" }}
                                _active={{ bg: "transparent" }}
                                aria-label="Next history polls"
                                icon={
                                  <ArrowForwardIcon
                                    boxSize="6"
                                    color="black"
                                  />
                                }
                                onClick={handleNextProposalsClickCompleted}
                              />
                            </HStack>
                          </>
                        )}
                      </HStack>
                    </VStack>
                  </Flex>
                </Flex>
              </TabPanel>
              <Modal isOpen={showCreatePoll} onClose={handleCreatePollClick}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Create a Vote</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <VStack
                      as="form"
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
                      {proposal.type !== "election" && (
                        <FormControl>
                          <FormLabel>Options (comma and space separated)</FormLabel>
                          <Textarea
                            name="options"
                            value={proposal.options.join(", ")}
                            onChange={handleOptionsChange}
                            placeholder="Option 1, Option 2, Option 3"
                            required
                          />
                        </FormControl>
                      )}
                      <FormControl>
                        <FormLabel>Proposal Type</FormLabel>
                          <Select
                            name="type"
                            value={proposal.type}
                            onChange={handleProposalTypeChange}
                          >
                            <option value="normal">Normal</option>
                            <option value="transferFunds">Transfer Funds</option>
                            <option value="election">Election</option>
                          </Select>
                      </FormControl>

                      {proposal.type === "election" && (
                        <>
                          <FormLabel>Candidates</FormLabel>
                          {candidateList.map((candidate, index) => (
                            <HStack key={index} w="100%">
                              <FormControl>
                                <Input
                                  placeholder="Candidate Name"
                                  value={candidate.name}
                                  onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                                  required
                                />
                              </FormControl>
                              <FormControl>
                                <Input
                                  placeholder="Candidate Address"
                                  value={candidate.address}
                                  onChange={(e) => handleCandidateChange(index, 'address', e.target.value)}
                                  required
                                />
                              </FormControl>
                            </HStack>
                          ))}
                          <Button
                            leftIcon={<AddIcon />}
                            onClick={addCandidate}
                            mt={2}
                            variant="outline"
                          >
                            Add Candidate
                          </Button>
                        </>
                      )}

                      {proposal.type === 'transferFunds' && (
                        <>
                          <FormControl>
                            <FormLabel>Transfer Address</FormLabel>
                            <Input
                              type="text"
                              name="transferAddress"
                              value={proposal.transferAddress}
                              onChange={handleTransferAddressChange}
                              required
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Transfer Amount</FormLabel>
                            <Input
                              type="number"
                              name="transferAmount"
                              value={proposal.transferAmount}
                              onChange={handleTransferAmountChange}
                              required
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Transfer Option</FormLabel>
                            <Input
                              type="number"
                              name="transferOption"
                              value={proposal.transferOption}
                              onChange={handleTransferOptionChange}
                              required
                            />
                          </FormControl>
                        </>
                      )}
                      <Text fontSize="md" color="gray.500">Create votes to control treasury and create tasks or projects Coming Soon</Text>
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
            contractAddress={votingTypeSelected === "Direct Democracy" ? directDemocracyVotingContractAddress : votingContractAddress}
            selectedPoll={selectedPoll}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            onOpen={onOpen}
          />
          <CompletedPollModal
            isOpen={isCompletedOpen}
            onClose={onCompletedClose}
            selectedPoll={selectedPoll}
            voteType={votingTypeSelected}
          />
        </Container>
      )}
    </>
  );
};

export default Voting;
