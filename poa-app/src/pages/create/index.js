import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import ArchitectInput from "@/components/Architect/ArchitectInput";
import MemberSpecificationModal from "@/components/Architect/MemberSpecificationModal";
import WeightModal from "@/components/Architect/WeightModal";
import LogoDropzoneModal from "@/components/Architect/LogoDropzoneModal";
import ConfirmationModal from "@/components/Architect/ConfirmationModal";
import DeployProgressLoader from "@/components/Architect/DeployProgressLoader";
import { motion } from "framer-motion";
import {
  Spinner,
  Center,
  Box,
  useToast,
  Button,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import Deployer from "@/components/Architect/TempDeployer";
import { useRouter } from "next/router";
import ConversationLog from "@/components/Architect/ConversationLog";
import Character from "@/components/Architect/Character";
import Selection from "@/components/Architect/Selection";
import { main } from "../../../scripts/newDeployment";
import { useWeb3Context } from "@/context/web3Context";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";

const steps = {
  ASK_INTRO: "ASK_INTRO",
  ASK_MORE_INFO: "ASK_MORE_INFO",
  ASK_READY: "ASK_READY",
  ASK_NAME: "ASK_NAME",
  ASK_DESCRIPTION: "ASK_DESCRIPTION",
  ASK_VOTING: "ASK_VOTING",
  ASK_VOTING_WEIGHT: "ASK_VOTING_WEIGHT",
  ASK_IF_LOGO_UPLOAD: "ASK_IF_LOGO_UPLOAD",
  ASK_LOGO_UPLOAD: "ASK_LOGO_UPLOAD",
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
  { label: "Participation Based", value: "participation_based" },
  { label: "Direct Democracy", value: "direct_democracy" },
  { label: "Hybrid", value: "hybrid" },
];

const ArchitectPage = () => {
  const { signer } = useWeb3Context();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isMemberSpecificationModalOpen, setIsMemberSpecificationModalOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showSelection, setShowSelection] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [options, setOptions] = useState([]);
  const [orgName, setOrgName] = useState("");
  const [currentStep, setCurrentStep] = useState(steps.ASK_INTRO);
  const [siteCreated, setSiteCreated] = useState(false);
  const [showDeployer, setShowDeployer] = useState(false);
  const [loadingCompleted, setLoadingCompleted] = useState(false);
  const selectionRef = useRef(null);
  const [selectionHeight, setSelectionHeight] = useState(0);
  const toast = useToast();
  const router = useRouter();
  const [assistant, setAssistant] = useState(null);
  const [thread, setThread] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [openai, setOpenai] = useState(null);

  const cornerTextBox = (
    <Box position="fixed" top="150px" right="40" padding="8px" backgroundColor="red" color="white" borderRadius="5px" width={["100px", "180px"]}>
      <Text fontSize="md">
        This is a working early alpha release deployed on the Sepolia testnet. AI under construction. Coming May 10th
      </Text>
    </Box>
  );

  const [orgDetails, setOrgDetails] = useState({
    membershipTypeNames: ["Gold", "Silver", "Bronze", "Default", "Executive"],
    POname: "",
    quadraticVotingEnabled: false,
    democracyVoteWeight: 100,
    participationVoteWeight: 0,
    hybridVotingEnabled: false,
    participationVotingEnabled: false,
    logoURL: "",
    votingControlType: "DirectDemocracy",
  });

  const handleConnect = () => {
    setForce(true);
    setChecked(false);
  };

  const createOrgSite = () => {
    if (!orgName.trim()) {
      toast({
        title: "Organization name is required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }
  };

  const handleStartOver = () => {
    setUserInput("");
    setMessages([]);
    setShowSelection(false);
    setOptions([]);
    setOrgName("");
    setOrgDetails({
      membershipTypeNames: ["Gold", "Silver", "Bronze", "Default", "Executive"],
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

  const startOver = () => {
    setUserInput("");
    setMessages([]);
    setShowSelection(false);
    setOptions([]);
    setOrgName("");
    setOrgDetails({
      name: "",
      description: "",
      membershipType: "",
      votingType: "",
    });
    setCurrentStep(steps.ASK_NAME);
    onClose();
  };

  useEffect(() => {
    if (showSelection && selectionRef.current) {
      const height = selectionRef.current.offsetHeight + 20;
      setSelectionHeight(height);
    }
  }, [showSelection, options]);

  useEffect(() => {
    initChatBot();
  }, []);

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

    const greetingMessage = {
      speaker: "Poa",
      text: "Hello! I'm Poa, your perpetual organization architect. Would you like to learn more about perpetual organizations and hear some examples, or get started?",
    };
    setMessages([greetingMessage]);
  };

  const handleSaveMemberRole = (roleName) => {
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      membershipTypeNames: [...prevDetails.membershipTypeNames, roleName],
    }));
    addMessage(`I just added the ${roleName} role to your organization.`);
    askToAddAnotherRole(roleName);
    setCurrentStep(steps.ASK_ADD_ANOTHER_ROLE);
  };

  const askToAddAnotherRole = () => {
    addMessage(`Would you like to add another role?`);
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

  const enableQuadraticVoting = () => {
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      quadraticVotingEnabled: true,
    }));
  };

  const handleWeight = ({ participationWeight, democracyWeight }) => {
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      hybridVotingEnabled: true,
      democracyVoteWeight: democracyWeight,
      participationVoteWeight: participationWeight,
    }));
    setCurrentStep(steps.ASK_IF_LOGO_UPLOAD);
  };

  const handleSaveAllSelections = async () => {
    setIsConfirmationModalOpen(false);
    console.log("Saving: ", orgDetails);
    await deploy(orgDetails);
    setLoadingCompleted(true);
    setShowDeployer(true);
  };

  const deploy = async (orgDetails) => {
    console.log("Deploying...");
    console.log(orgDetails);
    try {
      main(
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
      setTimeout(() => {
        setIsDeploying(true);
      }, 3000);
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

  const handleSendClick = () => {
    if (!userInput.trim()) return;
    handleUserInput(userInput.trim());
    setUserInput("");
  };

  const handleUserInput = async (input) => {
    addMessage(input, "User");

    // check if the user is ready to start or has more questions
    if (input.toLowerCase().includes("start") || input.toLowerCase().includes("ready")) {
      setCurrentStep(steps.ASK_NAME);
      return;
      
    }

    if (currentStep === steps.ASK_INTRO) {
      setIsWaiting(true);

      // Send a message to the thread
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: input,
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
      });

      // Create a response
      let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);

      // Wait for the response to be ready
      while (response.status === "in_progress" || response.status === "queued") {
        console.log("waiting...");

        await new Promise((resolve) => setTimeout(resolve, 250));

        response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      }

      setIsWaiting(false);

      // Get the messages for the thread
      const messageList = await openai.beta.threads.messages.list(thread.id);

      // Find the last message for the current run
      const lastMessage = messageList.data
        .filter((message) => message.run_id === run.id && message.role === "assistant")
        .pop();

      // Print the last message coming from the assistant
      if (lastMessage) {
        addMessage(lastMessage.content[0]["text"].value, "Poa");
        addMessage("Do you have any more questions about perpetual organizations, or are you ready to get started?");
      }
    } else {
      switch (currentStep) {
        case steps.ASK_READY:
          if (input.toLowerCase().includes("ready")) {
            setCurrentStep(steps.ASK_NAME);
          } else {
            addMessage("What else would you like to know about perpetual organizations?");
          }
          break;
        case steps.ASK_NAME:
          setOrgDetails({ ...orgDetails, POname: input });
          setCurrentStep(steps.ASK_DESCRIPTION);
          break;
        case steps.ASK_DESCRIPTION:
          setCurrentStep(steps.ASK_VOTING);
          break;
        // Add cases for other steps as needed
      }
    }
  };

  useEffect(() => {
    switch (currentStep) {
      case steps.ASK_NAME:
        addMessage("Please give your organization's name.");
        break;
      case steps.ASK_DESCRIPTION:
        addMessage("Please describe your organization.");
        break;
      case steps.ASK_VOTING:
        addMessage("Please select a voting type.");
        setShowSelection(true);
        setOptions(votingOptions);
        break;
      case steps.ASK_QUAD_VOTING:
        addMessage("Would you like to enable quadratic voting?");
        setShowSelection(true);
        setOptions([
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]);
        break;
      case steps.ASK_IF_LOGO_UPLOAD:
        addMessage("Would you like to upload a logo?");
        setShowSelection(true);
        setOptions([
          { label: "Yes", value: "yes" },
          { label: "Later", value: "no" },
        ]);
        break;
      // Add more steps as needed
    }
  }, [currentStep]);

  const handleCloseWeightModal = () => {
    setIsWeightModalOpen(false);
    setCurrentStep(steps.ASK_IF_LOGO_UPLOAD);
  };

  const pinLogoFile = () => {
    console.log("pinning incoming");
  };

  const handleOptionSelected = (value) => {
    setShowSelection(false);
    if (currentStep === steps.ASK_VOTING) {
      if (value === "participation_based") {
        enableParticipation();
        setCurrentStep(steps.ASK_QUAD_VOTING);
      } else if (value === "hybrid") {
        setIsWeightModalOpen(true);
        setCurrentStep(steps.ASK_VOTING_WEIGHT);
      }
    }
    if (currentStep === steps.ASK_QUAD_VOTING) {
      if (value === "yes") {
        enableQuadraticVoting();
      }
      setCurrentStep(steps.ASK_IF_LOGO_UPLOAD);
    }
    if (currentStep === steps.ASK_IF_LOGO_UPLOAD) {
      if (value === "yes") {
        setIsLogoModalOpen(true);
        setCurrentStep(steps.ASK_LOGO_UPLOAD);
      } else if (value === "no") {
        setIsConfirmationModalOpen(true);
        setCurrentStep(steps.ASK_CONFIRMATION);
      }
    }
  };

  const addMessage = (text, speaker = "Poa") => {
    setMessages((prevMessages) => [...prevMessages, { speaker, text }]);
  };

  const renderMessageContent = (message) => {
    return <ReactMarkdown>{message.text}</ReactMarkdown>;
  };

  return (
    <Layout isArchitectPage>
      {cornerTextBox}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Box mt="10" position="fixed" top="0" left="0" right="0" zIndex="sticky">
          <motion.div variants={itemVariants}>
            <Character />
          </motion.div>
        </Box>

        <Box position="fixed" top="115px" bottom="60px" overflowY="auto" width="full" pt="4" px="4">
          <ConversationLog messages={messages} selectionHeight={selectionHeight} renderMessageContent={renderMessageContent} />
          <MemberSpecificationModal
            isOpen={isMemberSpecificationModalOpen}
            onSave={handleSaveMemberRole}
            onClose={() => setIsMemberSpecificationModalOpen(false)}
          />
          <WeightModal isOpen={isWeightModalOpen} onSave={handleWeight} onClose={handleCloseWeightModal} />
          <ConfirmationModal
            isOpen={isConfirmationModalOpen}
            orgDetails={orgDetails}
            onClose={() => setIsConfirmationModalOpen(false)}
            onStartOver={handleStartOver}
            onSave={() => setShowDeployer(true)}
            onConnect={handleConnect}
          />
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
            <Selection ref={selectionRef} options={options} onOptionSelected={handleOptionSelected} />
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
