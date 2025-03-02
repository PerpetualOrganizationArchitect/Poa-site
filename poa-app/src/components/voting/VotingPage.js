import React, { useState, useEffect } from "react";
import {
  Container,
  Center,
  Spinner,
  TabPanel,
  useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useWeb3Context } from "@/context/web3Context";
import { usePOContext } from "@/context/POContext";
import { useVotingContext } from "@/context/VotingContext";
import { useAccount } from "wagmi";

import Navbar from "@/templateComponents/studentOrgDAO/NavBar";
import HeadingVote from "@/templateComponents/studentOrgDAO/voting/header";
import PollModal from "@/templateComponents/studentOrgDAO/voting/pollModal";
import CompletedPollModal from "@/templateComponents/studentOrgDAO/voting/CompletedPollModal";

import VotingTabs from "./VotingTabs";
import VotingPanel from "./VotingPanel";
import CreateVoteModal from "./CreateVoteModal";

const VotingPage = () => {
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
  const [selectedTab, setSelectedTab] = useState(0);
  const [ongoingStartIndex, setOngoingStartIndex] = useState(0);
  const [completedStartIndex, setCompletedStartIndex] = useState(0);
  const proposalDisplayLimit = 3;
  
  // Poll state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isPollCompleted, setIsPollCompleted] = useState(false);

  // Proposal state
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

  // Safe array handling
  const safeVotingOngoing = Array.isArray(selectedTab === 0 ? democracyVotingOngoing : (PTVoteType === "Hybrid" ? hybridVotingOngoing : participationVotingOngoing)) 
    ? (selectedTab === 0 ? democracyVotingOngoing : (PTVoteType === "Hybrid" ? hybridVotingOngoing : participationVotingOngoing)) 
    : [];
  
  const safeVotingCompleted = Array.isArray(selectedTab === 0 ? democracyVotingCompleted : (PTVoteType === "Hybrid" ? hybridVotingCompleted : participationVotingCompleted)) 
    ? (selectedTab === 0 ? democracyVotingCompleted : (PTVoteType === "Hybrid" ? hybridVotingCompleted : participationVotingCompleted)) 
    : [];

  // Display filtered proposals
  const displayedOngoingProposals = safeVotingOngoing.slice(
    ongoingStartIndex,
    ongoingStartIndex + proposalDisplayLimit
  );

  const displayedCompletedProposals = [...safeVotingCompleted]
    .reverse()
    .slice(completedStartIndex, completedStartIndex + proposalDisplayLimit);

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
    // Reset pagination when changing tabs
    setOngoingStartIndex(0);
    setCompletedStartIndex(0);
  };

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

  const handleCreatePollClick = () => {
    setShowCreatePoll(!showCreatePoll);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProposal({ ...proposal, [name]: value });
  };

  const handleOptionsChange = (e) => {
    const options = e.target.value.split(", ");
    setProposal({ ...proposal, options });
  };

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

  // Effect to check for expired proposals
  useEffect(() => {
    safeVotingOngoing.forEach(proposal => {
      updateWinnerStatus(proposal?.experationTimestamp, proposal?.id, proposal?.isHybrid);
    });
  }, [safeVotingOngoing]);

  // Effect to handle URL parameter for poll selection
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
          
          <VotingTabs
            selectedTab={selectedTab}
            handleTabsChange={handleTabsChange}
            PTVoteType={PTVoteType}
          >
            <TabPanel>
              <VotingPanel
                displayedOngoingProposals={displayedOngoingProposals}
                displayedCompletedProposals={displayedCompletedProposals}
                showDetermineWinner={showDetermineWinner}
                getWinner={getWinner}
                calculateRemainingTime={calculateRemainingTime}
                contractAddress={directDemocracyVotingContractAddress}
                onPollClick={handlePollClick}
                onPreviousOngoingClick={handlePreviousProposalsClickOngoing}
                onNextOngoingClick={handleNextProposalsClickOngoing}
                onPreviousCompletedClick={handlePreviousProposalsClickCompleted}
                onNextCompletedClick={handleNextProposalsClickCompleted}
                onCreateClick={handleCreatePollClick}
                showCreatePoll={showCreatePoll}
              />
            </TabPanel>
            <TabPanel>
              <VotingPanel
                displayedOngoingProposals={displayedOngoingProposals}
                displayedCompletedProposals={displayedCompletedProposals}
                showDetermineWinner={showDetermineWinner}
                getWinner={getWinner}
                calculateRemainingTime={calculateRemainingTime}
                contractAddress={votingContractAddress}
                onPollClick={handlePollClick}
                onPreviousOngoingClick={handlePreviousProposalsClickOngoing}
                onNextOngoingClick={handleNextProposalsClickOngoing}
                onPreviousCompletedClick={handlePreviousProposalsClickCompleted}
                onNextCompletedClick={handleNextProposalsClickCompleted}
                onCreateClick={handleCreatePollClick}
                showCreatePoll={showCreatePoll}
              />
            </TabPanel>
          </VotingTabs>
          
          <CreateVoteModal
            isOpen={showCreatePoll}
            onClose={handleCreatePollClick}
            proposal={proposal}
            handleInputChange={handleInputChange}
            handleOptionsChange={handleOptionsChange}
            handleProposalTypeChange={handleProposalTypeChange}
            handleTransferAddressChange={handleTransferAddressChange}
            handleTransferAmountChange={handleTransferAmountChange}
            handleTransferOptionChange={handleTransferOptionChange}
            handleCandidateChange={handleCandidateChange}
            addCandidate={addCandidate}
            handlePollCreated={handlePollCreated}
            loadingSubmit={loadingSubmit}
            candidateList={candidateList}
          />
          
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

export default VotingPage; 