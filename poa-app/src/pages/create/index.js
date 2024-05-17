import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import {
  Spinner,
  Center,
  Box,
  useToast,
  Button,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";

import ArchitectInput from "@/components/Architect/ArchitectInput";
import MemberSpecificationModal from "@/components/Architect/MemberSpecificationModal";
import WeightModal from "@/components/Architect/WeightModal";
import LogoDropzoneModal from "@/components/Architect/LogoDropzoneModal";
import ConfirmationModal from "@/components/Architect/ConfirmationModal";
import ConversationLog from "@/components/Architect/ConversationLog";
import Character from "@/components/Architect/Character";
import Selection from "@/components/Architect/Selection";
import Deployer from "@/components/Architect/TempDeployer";
import { useWeb3Context } from "@/context/web3Context";
import { main } from "../../../scripts/newDeployment";

const steps = {
  ASK_INTRO: "ASK_INTRO",
  ASK_NAME: "ASK_NAME",
  ASK_DESCRIPTION: "ASK_DESCRIPTION",
  ASK_DIRECT_DEMOCRACY: "ASK_DIRECT_DEMOCRACY",
  ASK_QUADRATIC_VOTING: "ASK_QUADRATIC_VOTING",
  ASK_VOTING: "ASK_VOTING",
  ASK_VOTING_WEIGHT: "ASK_VOTING_WEIGHT",
  ASK_ROLE: "ASK_ROLE",
  ASK_IF_LOGO_UPLOAD: "ASK_IF_LOGO_UPLOAD",
  ASK_LOGO_UPLOAD: "ASK_LOGO_UPLOAD",
  ASK_CONFIRMATION: "ASK_CONFIRMATION",
  ASK_VOTING_CONTRACT: "ASK_VOTING_CONTRACT",
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const votingOptions = [
  { label: "Hybrid", value: "hybrid" },
  { label: "Participation Based", value: "participation_based" },
  { label: "Neither", value: "neither" },
];

const yesNoOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const ArchitectPage = () => {
  const { signer } = useWeb3Context();
  const toast = useToast();
  const router = useRouter();
  const selectionRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isMemberSpecificationModalOpen, setIsMemberSpecificationModalOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showSelection, setShowSelection] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [options, setOptions] = useState([]);
  const [orgName, setOrgName] = useState("");
  const [currentStep, setCurrentStep] = useState(steps.ASK_INTRO);
  const [siteCreated, setSiteCreated] = useState(false);
  const [showDeployer, setShowDeployer] = useState(false);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const [selectionHeight, setSelectionHeight] = useState(0);
  const [assistant, setAssistant] = useState(null);
  const [thread, setThread] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [openai, setOpenai] = useState(null);

  const [orgDetails, setOrgDetails] = useState({
    membershipTypeNames: ["Regular", "Executive"],
    POname: "",
    quadraticVotingEnabled: false,
    democracyVoteWeight: 100,
    participationVoteWeight: 0,
    hybridVotingEnabled: false,
    participationVotingEnabled: false,
    logoURL: "",
    votingControlType: "DirectDemocracy",
  });

  useEffect(() => {
    initChatBot();
  }, []);

  useEffect(() => {
    if (showSelection && selectionRef.current) {
      setSelectionHeight(selectionRef.current.offsetHeight + 20);
    }
  }, [showSelection, options]);

  const initChatBot = async () => {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    setOpenai(openai);

    const assistant = await openai.beta.assistants.retrieve("asst_HopuEd843XXuOmDlfRCCfT7k");
    const thread = await openai.beta.threads.create();
    setAssistant(assistant);
    setThread(thread);

    addMessage("Hello! I'm Poa, your perpetual organization architect. Would you like to learn more about perpetual organizations and hear some examples, or get started?", "Poa");
  };

  const addMessage = (text, speaker = "Poa") => {
    
    setMessages((prevMessages) => [...prevMessages, { speaker, text }]);

  };

  const handleSendClick = () => {
    if (!userInput.trim()) return;
    handleUserInput(userInput.trim());
    setUserInput("");
  };

  const handleStartOver = () => {
    setUserInput("");
    setMessages([]);
    setShowSelection(false);
    setOptions([]);
    setOrgName("");
    setOrgDetails({
      membershipTypeNames: ["Regular", "Executive"],
      POname: "",
      quadraticVotingEnabled: false,
      democracyVoteWeight: 100,
      participationVoteWeight: 0,
      hybridVotingEnabled: false,
      participationVotingEnabled: false,
      logoURL: "",
      votingControlType: "DirectDemocracy",
    });
    setCurrentStep(steps.ASK_NAME);
    onClose();
  };

  const pinLogoFile = (file) => {
    console.log("Pinning logo file:", file);
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      logoURL: URL.createObjectURL(file),
    }));
    setIsLogoModalOpen(false);
    addMessage("Logo uploaded successfully. Now let's confirm your selections.");
    // wait for .3 seconds before asking for confirmation
    setTimeout(() => {
      setIsConfirmationModalOpen(true);
    }, 300);

    setCurrentStep(steps.ASK_CONFIRMATION);
  };

  const handleUserInput = async (input) => {
    console.log("input", input);
    addMessage(input, "User");
  
    switch (currentStep) {
      case steps.ASK_INTRO:
        if (input.toLowerCase().includes("ready") || input.toLowerCase().includes("start")) {
          console.log("starting...");
          setCurrentStep(steps.ASK_NAME);
          addMessage(`Great! Let's get started. What would you like to name your organization?`);
        } else {
          await askChatBot(input);
          addMessage("Do you have any more questions about perpetual organizations, or are you ready to get started?");
        }
        break;
      case steps.ASK_NAME:
        setOrgDetails((prevDetails) => ({ ...prevDetails, POname: input }));
        setCurrentStep(steps.ASK_DESCRIPTION);
        addMessage(`Awesome! Now, can you describe your organization in a few words? This will be displayed on your organization's homepage.`);
        break;
      case steps.ASK_DESCRIPTION:
        setOrgDetails((prevDetails) => ({ ...prevDetails, description: input }));
        setCurrentStep(steps.ASK_DIRECT_DEMOCRACY);
        addMessage(`Got it! Now, let's talk about voting. Direct democracy is an option by default. This can be used for informal polling or controlling the organization itself. I'll ask you about other voting types in a moment.`);
        addMessage("What quorum percentage would you like? If you're not sure, 51% is a good default. This is the minimum percentage of votes required for a decision to pass.");
        break;
      case steps.ASK_DIRECT_DEMOCRACY:
        setOrgDetails((prevDetails) => ({
          ...prevDetails,
          democracyVoteWeight: parseInt(input, 10), // Assuming input is a number
        }));
        setCurrentStep(steps.ASK_VOTING);
        addMessage("The Quorum percentage has been set. Now let's talk about other voting types. Hybrid and participation-based voting can be enabled in addition to direct democracy. You can also proceed without any additional voting types. Here is an explanation of each:");
        const markdownContent = '## Voting Types for Poa\n\n'
        + '### Participation-Based Voting\n'
        + '**Description:**\n'
        + 'Participation-based voting allocates votes based on members\' participation or contributions. Members who are more active or have contributed more to the organization have a greater influence on decisions.\n\n'
        + '**Advantages:**\n'
        + '- Rewards active and contributing members\n'
        + '- Encourages greater involvement and productivity\n'
        + '- Aligns decision-making power with effort and investment\n\n'
        + '**When to Use:**\n'
        + 'This method is suitable for organizations where contributions vary significantly among members, and it is important to incentivize and reward active participation.\n\n'
        + '### Hybrid Voting\n'
        + '**Description:**\n'
        + 'Hybrid voting combines elements of both direct democracy and participation-based voting. Votes are weighted based on a predefined percentage of equal votes (direct democracy) and contribution-based votes (participation-based).\n\n'
        +'**Example:**\n'
        + 'An organization is voting on a project to work on. In a hybrid voting system, 70% of the voting power could be allocated to the participants, while the remaining 30% would be direct democracy votes. This allows for a balance between community needs (democracy) and making sure that contributors are willing to work on the project.\n\n'
        + '**Advantages:**\n'
        + '- Balances fairness with incentivizing contributions\n'
        + '- Flexible and customizable to organizational needs\n'
        + '- Encourages participation while maintaining majority rule\n\n'
        + '**When to Use:**\n'
        + 'Hybrid voting is best for organizations that want to balance equal representation with rewarding active contributors. It’s particularly useful in diverse teams where contributions and engagement levels vary.\n';

        const markdownContentString = String(markdownContent);

      addMessage(markdownContentString, "Poa");
        addMessage(`If you have any more questions about voting go ahead and ask! If not, select a voting type below.`);
        setShowSelection(true);
        setOptions(votingOptions);
        break;
      case steps.ASK_VOTING:
        setShowSelection(false);
        if (input.toLowerCase() === "hybrid") {
          setOrgDetails((prevDetails) => ({
            ...prevDetails,
            hybridVotingEnabled: true,
          }));
          addMessage("Hybrid voting has been enabled. Now let's set the voting weights for each type.");
          setCurrentStep(steps.ASK_VOTING_WEIGHT);
          setIsWeightModalOpen(true);
        } else if (input.toLowerCase() === "participation_based") {
          setOrgDetails((prevDetails) => ({
            ...prevDetails,
            participationVotingEnabled: true,
          }));
          addMessage("Great! Participation based voting has been enabled. What quorum percentage would you like?");
          setCurrentStep(steps.ASK_VOTING_WEIGHT);
        } else if (input.toLowerCase() === "neither") {
          setCurrentStep(steps.ASK_ROLE);
          addMessage("Proceeding without additional voting types.");
          addMessage("By default, your organization will have two roles: Regular and Executive. Executive members can create tasks and polls. You will be an executive by default. Would you like to add more roles?");
          setOptions(yesNoOptions);
          setShowSelection(true);
        } else {
          await askChatBot(input);
          addMessage("Do you have any more questions about hybrid or participation-based voting, or are you ready to select a voting type?");
          setShowSelection(true);
          setOptions(votingOptions);
        }
        break;
      case steps.ASK_VOTING_WEIGHT:
        setOrgDetails((prevDetails) => ({
          ...prevDetails,
          hybridVoteWeight: parseInt(input, 10), 
        }));
        setCurrentStep(steps.ASK_QUADRATIC_VOTING);
        // need explanation of quad voting here
        addMessage("Weights have been set. Would you like to enable quadratic voting?");
        setOptions(yesNoOptions);
        setShowSelection(true);
        break;
      case steps.ASK_QUADRATIC_VOTING:
        setShowSelection(false);
        if (input.toLowerCase() === "yes") {
          setOrgDetails((prevDetails) => ({
            ...prevDetails,
            quadraticVotingEnabled: true,
          }));
          addMessage("Quadratic voting has been enabled.");
        } else {
          addMessage("Quadratic voting will not be enabled.");
        }
        setCurrentStep(steps.ASK_VOTING_CONTRACT);
        addMessage("Now, which voting contract would you like to control the treasury and upgrade the organization?");
        setShowSelection(true);
        setOptions([
          { label: "Direct Democracy", value: "direct_democracy" },
          { label: orgDetails.hybridVotingEnabled ? "Hybrid" : "Participation Based", value: orgDetails.hybridVotingEnabled ? "hybrid" : "participation_based" },
        ]);
        break;
      case steps.ASK_VOTING_CONTRACT:
        setOrgDetails((prevDetails) => ({
          ...prevDetails,
          votingControlType: input,
        }));
        setCurrentStep(steps.ASK_ROLE);
        addMessage("Voting contract has been set. By default, your organization will have two roles: Regular and Executive. Executive members can create tasks and polls. Would you like to add more roles?");
        setOptions(yesNoOptions);
        setShowSelection(true);
        break;
      case steps.ASK_ROLE:
        setShowSelection(false);
        if (input.toLowerCase() === "yes") {
          setIsMemberSpecificationModalOpen(true);
        } else {
          setCurrentStep(steps.ASK_IF_LOGO_UPLOAD);
          addMessage("Okay, skipping role addition. Would you like to upload a logo for your organization? Click No if you don't have one.");
          setOptions(yesNoOptions);
          setShowSelection(true);
        }
        break;
      case steps.ASK_IF_LOGO_UPLOAD:
        setShowSelection(false);
        if (input.toLowerCase().includes("yes")) {
          setIsLogoModalOpen(true);
        } else {
          setCurrentStep(steps.ASK_CONFIRMATION);
          addMessage("Okay, skipping logo upload.");
          setIsConfirmationModalOpen(true);
        }
        break;
      case steps.ASK_CONFIRMATION:
        // Handle confirmation step open confirmation modal
        break;
    }
  };
  

  const askChatBot = async (input) => {
    setIsWaiting(true);
    await openai.beta.threads.messages.create(thread.id, { role: "user", content: input });
    const run = await openai.beta.threads.runs.create(thread.id, { assistant_id: assistant.id });
    let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    while (response.status === "in_progress" || response.status === "queued") {
      await new Promise((resolve) => setTimeout(resolve, 250));
      response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    setIsWaiting(false);
    const messageList = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messageList.data.find((message) => message.run_id === run.id && message.role === "assistant");

    if (lastMessage) {
      addMessage(lastMessage.content[0]["text"].value, "Poa");
    }
  };

  const explainVotingTypes = async () => {
    await askChatBot("Can you explain hybrid and participation-based voting?");
  };

  const handleSaveMemberRole = (roleName) => {
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      membershipTypeNames: [...prevDetails.membershipTypeNames, roleName],
    }));
    addMessage(`I just added the ${roleName} role to your organization.`);
    askToAddAnotherRole();
  };

  const askToAddAnotherRole = () => {
    addMessage("Would you like to add another role?");
    setOptions([
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ]);
    setShowSelection(true);
  };

  const enableParticipation = () => {
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      participationVotingEnabled: true,
    }));
  };

  const handleWeight = ({ participationWeight, democracyWeight }) => {
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      hybridVotingEnabled: true,
      democracyVoteWeight: democracyWeight,
      participationVoteWeight: participationWeight,
    }));
    onClose();
    addMessage("Weights have been set. What quorum percentage would you like?");
    setCurrentStep(steps.ASK_VOTING_WEIGHT);
  };

  const handleSaveAllSelections = async () => {
    setIsConfirmationModalOpen(false);
    await deployOrg();
    setLoadingCompleted(true);
    setShowDeployer(true);
  };

  const deployOrg = async () => {
    try {
      await main(
        orgDetails.membershipTypeNames,
        orgDetails.membershipTypeNames,
        orgDetails.POname,
        orgDetails.quadraticVotingEnabled,
        orgDetails.democracyVoteWeight,
        orgDetails.participationVoteWeight,
        orgDetails.hybridVotingEnabled,
        orgDetails.participationVotingEnabled,
        orgDetails.logoURL,
        orgDetails.votingControlType,
        signer
      );
      setTimeout(() => setIsDeploying(true), 3000);
    } catch (error) {
      toast({
        title: "Deployment failed.",
        description: "There was an error during the deployment process.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Layout isArchitectPage>
      <Box position="fixed" top="150px" right="40" padding="8px" backgroundColor="red" color="white" borderRadius="5px" width={["100px", "180px"]}>
        <Text fontSize="md">
          This is a working early alpha release deployed on the Sepolia testnet. AI under construction. Coming May 10th
        </Text>
      </Box>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Box mt="10" position="fixed" top="0" left="0" right="0" zIndex="sticky">
          <motion.div variants={itemVariants}>
            <Character />
          </motion.div>
        </Box>
        <Box position="fixed" top="115px" bottom="60px" overflowY="auto" width="full" pt="4" px="4">
          <ConversationLog messages={messages} selectionHeight={selectionHeight} renderMessageContent={(message) => {message.text}} />
          <MemberSpecificationModal isOpen={isMemberSpecificationModalOpen} onSave={handleSaveMemberRole} onClose={() => setIsMemberSpecificationModalOpen(false)} />
          <WeightModal isOpen={isWeightModalOpen} onSave={handleWeight} onClose={() => setIsWeightModalOpen(false)} />
          <ConfirmationModal isOpen={isConfirmationModalOpen} orgDetails={orgDetails} onClose={() => setIsConfirmationModalOpen(false)} onStartOver={handleStartOver} onSave={handleSaveAllSelections} />
          <Deployer signer={signer} isOpen={showDeployer} onClose={() => setShowDeployer(false)} deploymentDetails={orgDetails} />
          <LogoDropzoneModal isOpen={isLogoModalOpen} onSave={pinLogoFile} />
          {isDeploying && (
            <Center>
              <Spinner size="xl" />
            </Center>
          )}
        </Box>
        {showSelection && options.length > 0 && (
          <Box position="fixed" bottom="60px" left="0" right="0" p="4" display="flex" alignItems="center" justifyContent="center" bg="purple.50" borderTop="2px solid" borderColor="gray.200" zIndex="sticky">
            <Selection ref={selectionRef} options={options} onOptionSelected={handleUserInput} />
          </Box>
        )}
        <Box position="fixed" bottom="0" width="full" p={4} paddingRight={10} zIndex="sticky">
          {orgName && loadingCompleted && (
            <Button position="absolute" top="4" right="4" colorScheme="teal" onClick={() => router.push(`/home/?userDAO=${orgName}`)}>
              Access site
            </Button>
          )}
          <Box position="fixed" bottom="0" width="full" p={4} paddingRight={10} zIndex="sticky">
            <ArchitectInput value={userInput} onChange={(e) => setUserInput(e.target.value)} onSubmit={handleSendClick} isDisabled={isWaiting} />
          </Box>
        </Box>
      </motion.div>
    </Layout>
  );
};

export default ArchitectPage;
