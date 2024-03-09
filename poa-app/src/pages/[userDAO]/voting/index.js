// pages/[userDAO]/voting/index.js
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
import Countdown from "@/templateComponents/studentOrgDAO/voting/countDown";
import { IconButton } from "@chakra-ui/react";
import PollModal from "@/templateComponents/studentOrgDAO/voting/pollModal";
import { ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";

// import { useGraphVotingContext } from "@/contexts/graphVotingContext";


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

  const {createProposalDDVoting} = useWeb3Context();
  const {directDemocracyVotingContractAddress, setLoaded} = useGraphContext();

  useEffect(() => {
    setLoaded(userDAO);
  }, [userDAO]);



  const [selectedTab, setSelectedTab] = useState(0);

  //   const {
  //     kubidOngoingProposals,
  //     kubidCompletedProposals,
  //     loadOngoingKubidInitial,
  //     loadCompletedKubidInitial,
  //     loadMoreKubidOngoing,
  //     loadMoreKubidCompleted,
  //   } = useGraphVotingContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedPoll, setSelectedPoll] = useState(null);

  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [showCreateVote, setShowCreateVote]= useState(false);

  //   const [ongoingStartIndexKubid, setOngoingStartIndexKubid] = useState(0);
  //   const [historyStartIndexKubid, setHistoryStartIndexKubid] = useState(0);

  //   const [ongoingStartIndexKubix, setOngoingStartIndexKubix] = useState(0);
  //   const [historyStartIndexKubix, setHistoryStartIndexKubix] = useState(0);

  //   const displayOngoingPollsKubid = kubidOngoingProposals.slice(
  //     ongoingStartIndexKubid,
  //     ongoingStartIndexKubid + 3
  //   );
  //   const displayHistoryPollsKubid = [...kubidCompletedProposals].slice(
  //     historyStartIndexKubid,
  //     historyStartIndexKubid + 3
  //   );

  //   const displayOngoingPollsKubix = ongoingPollsKubix.slice(
  //     ongoingStartIndexKubix,
  //     ongoingStartIndexKubix + 3
  //   );
  //   const displayHistoryPollsKubix = [...completedPollsKubix]
  //     .reverse()
  //     .slice(historyStartIndexKubix, historyStartIndexKubix + 3);
  //   const [loaded, setLoaded] = useState(false);

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handlePollCreated = () => {
    function run() {
        return createProposalDDVoting(directDemocracyVotingContractAddress, proposal.name, proposal.description, proposal.time, proposal.options, 0, "0x06e6620C67255d308A466293070206176288A67B", 0, false);
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
    router.push(`/voting?poll=${poll.id}`);
    onOpen();
  };

  //   useEffect(() => {
  //     const fetchPolls = async () => {
  //       await loadCompletedKubidInitial();
  //       await loadOngoingKubidInitial();
  //       setLoaded(true);
  //     };
  //     fetchPolls();
  //   }, []);

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

  //   useEffect(() => {
  //     console.log("router.query.poll: ", router.query.poll);

  //     if (router.query.poll !== undefined && loaded) {
  //       console.log("router.query.poll: ", router.query.poll);
  //       // find poll with index poll
  //       const poll = kubidOngoingProposals.find(
  //         (poll) => poll.id === router.query.poll
  //       );
  //       console.log("poll: ", poll);
  //       setSelectedPoll(poll);
  //       onOpen();
  //     }
  //   }, [router.query.poll, kubidOngoingProposals, loaded]);

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

                    {/*HStack needs to go here*/}

                    {/* List ongoing votes here */}

                    {/* History */}
                    <Heading pl={2} color="rgba(333, 333, 333, 1)">
                      History{" "}
                    </Heading>
                    {/* <HStack spacing={4} w="100%" justifyContent="flex-start">
                      {kubidCompletedProposals.length > 0 ? (
                        displayHistoryPollsKubid.map((proposal, index) => {
                          const totalVotes = proposal.options.reduce(
                            (total, option) =>
                              total +
                              ethers.BigNumber.from(option.votes).toNumber(),
                            0
                          );
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
                                    (ethers.BigNumber.from(
                                      option.votes
                                    ).toNumber() /
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
                                Winner: {proposal.winnerName}
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
                      {kubidCompletedProposals.length > 0 ? (
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
                              onClick={() => {
                                if (historyStartIndexKubid - 3 >= 0) {
                                  setHistoryStartIndexKubid(
                                    historyStartIndexKubid - 3
                                  );
                                }
                              }}
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
                              onClick={() => {
                                if (
                                  historyStartIndexKubid + 3 <
                                  kubidCompletedProposals.length
                                ) {
                                  loadMoreKubidCompleted();
                                  setHistoryStartIndexKubid(
                                    historyStartIndexKubid + 3
                                  );
                                }
                              }}
                            />
                          </HStack>
                        </>
                      ) : null}
                    </HStack> */}
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
                        Ongoing Polls{" "}
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
                            : "Create Democracy Vote"
                          : showCreatePoll
                          ? "Hide Create Poll Form"
                          : "Create Poll"}
                      </Button>
                    </HStack>

                    {/* <HStack justifyContent={"flex-start"} w="100%" spacing={4}>
                      {ongoingPollsKubix.length > 0 ? (
                        ongoingPollsKubix.map((poll, index) => (
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
                            _hover={{
                              bg: "black",
                              boxShadow: "md",
                              transform: "scale(1.05)",
                            }}
                            onClick={() => handlePollClick(poll)}
                          >
                            <div className="glass" style={glassLayerStyle} />
                            <Text mb="4" fontSize="xl" fontWeight="extrabold">
                              {poll.name}
                            </Text>
                            <CountDown
                              duration={Math.floor(
                                (poll?.completionDate - new Date().getTime()) /
                                  1000
                              )}
                            />
                            <Text mt="2"> Voting Options:</Text>
                            <HStack spacing={6}>
                              {poll.options.map((option, index) => (
                                <Text
                                  fontSize="lg"
                                  fontWeight="extrabold"
                                  key={index}
                                >
                                  {option.name}
                                </Text>
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
                              No Ongoing Polls
                            </Text>
                          </Flex>
                        </Box>
                      )}
                      {ongoingPollsKubix.length > 0 ? (
                        <>
                          <Spacer />
                          <HStack justifyContent="bottom" spacing={-2}>
                            <IconButton
                              aria-label="Next polls"
                              background="transparent"
                              border="none"
                              _hover={{ bg: "transparent" }}
                              _active={{ bg: "transparent" }}
                              icon={
                                <ArrowForwardIcon
                                  boxSize="6" // smaller size
                                  color="black"
                                />
                              }
                              onClick={() => {
                                if (
                                  ongoingStartIndexKubix + 3 <
                                  ongoingPollsKubix.length
                                ) {
                                  setOngoingStartIndexKubix(
                                    ongoingStartIndexKubix + 3
                                  );
                                }
                              }}
                            />
                            <IconButton
                              aria-label="Previous polls"
                              background="transparent"
                              border="none"
                              _hover={{ bg: "transparent" }}
                              _active={{ bg: "transparent" }}
                              icon={
                                <ArrowBackIcon
                                  boxSize="6" // smaller size
                                  color="black"
                                />
                              }
                              onClick={() => {
                                if (ongoingStartIndexKubix - 3 >= 0) {
                                  setOngoingStartIndexKubid(
                                    ongoingStartIndexKubix - 3
                                  );
                                }
                              }}
                            />
                          </HStack>
                        </>
                      ) : null}
                    </HStack> */}

                    <Heading pl={2} color="rgba(333, 333, 333, 1)">
                      History{" "}
                    </Heading>
                    {/* <HStack spacing={4} w="100%" justifyContent="flex-start">
                      {completedPollsKubix.length > 0 ? (
                        displayHistoryPollsKubix.map((poll, index) => {
                          const totalVotes = poll.options.reduce(
                            (total, option) =>
                              total +
                              ethers.BigNumber.from(option.votes).toNumber(),
                            0
                          );
                          const predefinedColors = [
                            "red",
                            "darkblue",
                            "yellow",
                            "purple",
                          ];
                          const data = [
                            {
                              name: "Options",
                              values: poll.options.map((option, index) => {
                                const color =
                                  index < predefinedColors.length
                                    ? predefinedColors[index]
                                    : `rgba(${Math.random() * 255}, ${
                                        Math.random() * 255
                                      }, ${Math.random() * 255}, 1)`;
                                return {
                                  value:
                                    (ethers.BigNumber.from(
                                      option.votes
                                    ).toNumber() /
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
                                {poll.name}
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
                                Winner: {poll.winner}
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
                          color="ghostwhite"
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
                      {completedPollsKubix.length > 0 ? (
                        <>
                          <Spacer />
                          <HStack justifyContent="bottom" spacing={4}>
                            <IconButton
                              aria-label="Next polls"
                              background="transparent"
                              border="none"
                              _hover={{ bg: "transparent" }}
                              _active={{ bg: "transparent" }}
                              icon={
                                <ArrowForwardIcon
                                  boxSize="6" // smaller size
                                  color="black"
                                />
                              }
                              onClick={() => {
                                if (
                                  ongoingStartIndexKubix + 3 <
                                  ongoingPollsKubix.length
                                ) {
                                  setOngoingStartIndexKubix(
                                    ongoingStartIndexKubix + 3
                                  );
                                }
                              }}
                            />
                            <IconButton
                              aria-label="Previous polls"
                              background="transparent"
                              border="none"
                              _hover={{ bg: "transparent" }}
                              _active={{ bg: "transparent" }}
                              icon={
                                <ArrowBackIcon
                                  boxSize="6" // smaller size
                                  color="black"
                                />
                              }
                              onClick={() => {
                                if (ongoingStartIndexKubix - 3 >= 0) {
                                  setOngoingStartIndexKubid(
                                    ongoingStartIndexKubix - 3
                                  );
                                }
                              }}
                            />
                          </HStack>
                        </>
                      ) : null}
                    </HStack> */}
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
                      <FormLabel>Name</FormLabel>
                      <Input
                        type="text"
                        name="name"
                        value={proposal.name}
                        onChange={handleInputChange}
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        name="description"
                        value={proposal.description}
                        onChange={handleInputChange}
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Execution</FormLabel>
                      <Textarea
                        name="execution"
                        value={proposal.execution}
                        onChange={handleInputChange}
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Time</FormLabel>
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
                        <FormLabel>Options</FormLabel>
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
          // handleVote={handleVote}
          // loadingVote={loadingVote}
          // selectedPoll={selectedPoll}
          //   selectedOption={selectedOption}
          //   setSelectedOption={setSelectedOption}
          onOpen={onOpen}
        />
      </Container>
    </>
  );
};

export default Voting;
