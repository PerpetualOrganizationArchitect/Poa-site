import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import {
  Spinner,
  Center,
  Box,
  useToast,
  Button,
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
import LinksModal from "@/components/Architect/LinksModal";
import ConversationLog from "@/components/Architect/ConversationLog";
import Character from "@/components/Architect/Character";
import Selection from "@/components/Architect/Selection";
import Deployer from "@/components/Architect/TempDeployer";
import { useWeb3Context } from "@/context/web3Context";
import { useIPFScontext } from "@/context/ipfsContext";
import { main } from "../../../scripts/newDeployment";

const steps = {
  ASK_INTRO: "ASK_INTRO",
  ASK_NAME: "ASK_NAME",
  ASK_DESCRIPTION: "ASK_DESCRIPTION",
  ASK_IF_LINKS: "ASK_IF_LINKS",
  ASK_LINKS: "ASK_LINKS",
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

const startOptions = [
  { label: "Get Started Building your Pereptual Organization", value: "get_start" },
];


const ArchitectPage = () => {
  const { signer } = useWeb3Context();
  const { addToIpfs } = useIPFScontext();
  const toast = useToast();
  const router = useRouter();
  const selectionRef = useRef(null);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isMemberSpecificationModalOpen, setIsMemberSpecificationModalOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
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
  const initChatBotCalled = useRef(false);
  const [isInputVisible, setIsInputVisible] = useState(true);

  const [orgDetails, setOrgDetails] = useState({
    membershipTypeNames: ["Regular", "Executive"],
    executiveRoleNames: ["Executive"],
    POname: "",
    description: "",
    links: [],
    quadraticVotingEnabled: false,
    democracyVoteWeight: 100,
    participationVoteWeight: 0,
    hybridVotingEnabled: false,
    participationVotingEnabled: false,
    logoURL: "",
    infoIPFSHash: "",
    votingControlType: "DirectDemocracy",
    directDemocracyQuorum: 51,
    hybridVoteQuorum: 51,
    participationVoteQuorum: 51,
  });

  useEffect(() => {
    if (!initChatBotCalled.current) {
      initChatBot();
      setOptions(startOptions);
      setShowSelection(true);

      initChatBotCalled.current = true;
    }
  }, []);

  useEffect(() => {
    if (showSelection && selectionRef.current) {
      setSelectionHeight(selectionRef.current.offsetHeight + 20);
    }
  }, [showSelection, options]);

  const handleSaveLinks = async (links) => {
    console.log("links", links);
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      links,
    }));
    setIsLinksModalOpen(false);

    setCurrentStep(steps.ASK_DIRECT_DEMOCRACY);
    addMessage("Links have been added.\n\n Now, let's talk about voting. **Direct Democracy**, where everyone gets an equal vote. Enabled by default, this can be used for informal polling or controlling the organization itself. I'll ask you about other voting types in a moment.\n\n #### What approval percentage would you like?\n\n If you're not sure, 51% is a good default. This is the minimum percentage of votes required for a poll option to win.");
  };

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

    const introMessage =
      ' #### Hello! I\'m **Poa**, your Perpetual Organization architect. I\'m here to help you build unstoppable, fully community-owned organizations.\n\n' +
      '**Perpetual Organizations** come with a custom voting system for organizational management like deciding on projects or managing money, a task manager for determining contribution levels, various options for raising money without giving away power, and more. Ask me if you have any questions about what features Poa offers!\n\n' +
      '#### Examples of Organizations Poa Can Help You Create\n\n' +
      '- **Student Organizations**:\n' +
      'Student-led groups controlled either by one of Poa\'s many voting systems.\n\n' +
      '- **Fully Worker-owned Cooperatives**:\n' +
      'Voting power is based off a combination of contribution level and direct democracy\n\n' +
      '- **Activist Groups**:\n' +
      'Community-driven organizations focusing on social good without profit motives. Poa ensures the community stays in control at all levels.\n\n' +
      '- **Open Source Software Collectives**:\n' +
      'Collaborative groups aiming to innovate and advance software development through a contributor ownership model.\n\n\n' +
      '\n#### Would you like to learn more about Perpetual Organizations and all of Poa\'s community-first voting systems or get started building your own Perpetual Organization?\n\n';

    addMessage(introMessage, "Poa");

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
      executiveRoleNames: ["Executive"],
      POname: "",
      description: "",
      links: [],
      quadraticVotingEnabled: false,
      democracyVoteWeight: 100,
      participationVoteWeight: 0,
      directDemocracyQuorum: 51,
      hybridVoteQuorum: 51,
      participationVoteQuorum: 51,
      hybridVotingEnabled: false,
      participationVotingEnabled: false,
      logoURL: "",
      votingControlType: "DirectDemocracy",
    });
    setCurrentStep(steps.ASK_NAME);
  };

  const pinLogoFile = async (ipfsUrl) => {
    try {
      setOrgDetails((prevDetails) => ({
        ...prevDetails,
        logoURL: ipfsUrl,
      }));
      setIsLogoModalOpen(false);
      addMessage("Logo uploaded successfully. Now let's confirm your selections.");
      setTimeout(() => {
        setIsConfirmationModalOpen(true);
      }, 300);
      setCurrentStep(steps.ASK_CONFIRMATION);
    } catch (error) {
      console.error("Error setting logo URL:", error);
      toast({
        title: "Logo upload failed.",
        description: "There was an error setting the logo URL.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const createAndUploadJson = async () => {
    console.log("orgDetails json", orgDetails);
    const jsonData = {
      description: orgDetails.description,
      links: orgDetails.links.map(link => ({
        name: link.name,
        url: link.url,
      })),
    };
    try {
      const result = await addToIpfs(JSON.stringify(jsonData));
      setOrgDetails((prevDetails) => ({
        ...prevDetails,
        infoIPFSHash: result.path,
      }));
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      toast({
        title: "IPFS upload failed.",
        description: "There was an error uploading the data to IPFS.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleUserInput = async (input) => {
    console.log("input", input);
    addMessage(input, "User");

    switch (currentStep) {
      case steps.ASK_INTRO:
        if (input.toLowerCase().includes("get_start")) {
          setShowSelection(false);
          console.log("starting...");
          setCurrentStep(steps.ASK_NAME);
          addMessage(`Great! Let's get started.\n\n #### What would you like to name your organization?`);
        } else {
          await askChatBot(input);
          addMessage("#### Do you have any more questions about perpetual organizations, or are you ready to get started?");
        }
        break;
      case steps.ASK_NAME:
        setOrgDetails((prevDetails) => ({ ...prevDetails, POname: input }));
        setCurrentStep(steps.ASK_DESCRIPTION);
        addMessage(`#### Awesome! Now, can you describe your organization in a few words? This will be displayed on your organization's homepage.`);
        break;
      case steps.ASK_DESCRIPTION:
        setOrgDetails((prevDetails) => ({ ...prevDetails, description: input }));
        addMessage("#### Got it! Do you have any links you want to add for your organization?");
        setCurrentStep(steps.ASK_IF_LINKS);
        setOptions(yesNoOptions);
        setShowSelection(true);
        setIsInputVisible(false);
        break;
      case steps.ASK_IF_LINKS:
        setShowSelection(false);
        setIsInputVisible(true);
        if (input.toLowerCase() === "yes") {
          setIsLinksModalOpen(true);
        } else {
          await createAndUploadJson();
          setCurrentStep(steps.ASK_DIRECT_DEMOCRACY);
          addMessage("No links will be added.\n\n Now, let's talk about voting. **Direct Democracy**, where everyone gets an equal vote. Enabled by default, this can be used for informal polling or controlling the organization itself. I'll ask you about other voting types in a moment.\n\n #### What approval percentage would you like?\n\n If you're not sure, 51% is a good default. This is the minimum percentage of votes required for a option to win.");
        }
        break;
      case steps.ASK_DIRECT_DEMOCRACY:
        await createAndUploadJson();
        setOrgDetails((prevDetails) => ({
          ...prevDetails,
          directDemocracyQuorum: parseInt(input, 10),
        }));
        setCurrentStep(steps.ASK_VOTING);

        const markdownContent =
          'The Approval percentage has been set.\n' +
          'Now let’s talk about other voting types. **Hybrid** and **Participation-based Voting** can be enabled in addition to direct democracy. You can also proceed without any additional voting types. Here is an explanation of each:\n\n' +
          '### Participation-Based Voting\n' +
          '**Description:**\n' +
          'Participation-based voting allocates votes based on members\' participation or contributions. Members who are more active or have contributed more to the organization have a greater influence on decisions.\n\n' +
          '**Advantages:**\n' +
          '- Rewards active and contributing members\n' +
          '- Encourages greater involvement and productivity\n' +
          '- Aligns decision-making power with effort and investment\n\n' +
          '**When to Use:**\n' +
          'This method is suitable for organizations where contributions vary significantly among members, and it is important to incentivize and reward active participation.\n\n' +
          '### Hybrid Voting\n' +
          '**Description:**\n' +
          'Hybrid voting combines elements of both direct democracy and participation-based voting. Votes are weighted based on a predefined percentage of equal votes (direct democracy) and contribution-based votes (participation-based).\n\n' +
          '**Example:**\n' +
          'An organization is voting on a project to work on. In a hybrid voting system, 70% of the voting power could be allocated to the participants, while the remaining 30% would be direct democracy votes. This allows for a balance between community needs (democracy) and making sure that contributors are willing to work on the project.\n\n' +
          '**Advantages:**\n' +
          '- Balances fairness with incentivizing contributions\n' +
          '- Flexible and customizable to organizational needs\n' +
          '- Encourages participation while maintaining majority rule\n\n' +
          '**When to Use:**\n' +
          'Hybrid voting is best for organizations that want to balance equal representation with rewarding active contributors. It’s particularly useful in diverse teams where contributions and engagement levels vary.\n\n' +
          `#### If you have any more questions about voting go ahead and ask! If not, select a voting type below.`;

        const markdownContentString = String(markdownContent);

        addMessage(markdownContentString, "Poa");

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
          addMessage("Great! Participation based voting has been enabled.\n\n #### What Approval percentage would you like?");
          setCurrentStep(steps.ASK_QUORUM_PERCENTAGE);
        } else if (input.toLowerCase() === "neither") {
          setCurrentStep(steps.ASK_ROLE);
          addMessage("Proceeding without additional voting types.");
          addMessage("By default, your organization will have two roles: Regular and Executive. Executive members can create tasks and polls. You will be an executive by default.\n\n #### Would you like to add more roles?");
          setOptions(yesNoOptions);
          setShowSelection(true);
        } else {
          await askChatBot(input);
          addMessage("Do you have any more questions about hybrid or participation-based voting, or are you ready to select a voting type?");
          setShowSelection(true);
          setOptions(votingOptions);
        }
        break;
      case steps.ASK_QUORUM_PERCENTAGE:
        if (orgDetails.hybridVotingEnabled) {
          setOrgDetails((prevDetails) => ({
            ...prevDetails,
            hybridVoteQuorum: parseInt(input, 10),
          }));
        } else if (orgDetails.participationVotingEnabled) {
          setOrgDetails((prevDetails) => ({
            ...prevDetails,
            participationVoteQuorum: parseInt(input, 10),
          }));
        }
        setCurrentStep(steps.ASK_QUADRATIC_VOTING);
        addMessage("Approval percentage has been set.\n\n #### Would you like to enable quadratic voting?\n\n Quadratic voting allows participants to cast votes that reflect the strength of their preferences, giving more weight to stronger preferences while preventing any single participant from having too much influence. The cost of each additional vote increases quadratically, meaning that the number of votes a participant casts for an option is the square root of the amount they are willing to spend. This helps balance influence more fairly among voters.");
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
          addMessage("Quadratic voting has been enabled.\n\n #### Now, which voting contract would you like to control the treasury, decide projects, and upgrade the organization?");
        } else {
          addMessage("Quadratic voting will not be enabled.\n\n #### Now, which voting contract would you like to control the treasury, decide projects, and upgrade the organization?");
        }
        setCurrentStep(steps.ASK_VOTING_CONTRACT);

        setShowSelection(true);
        setOptions([
          { label: "Direct Democracy", value: "direct_democracy" },
          { label: orgDetails.hybridVotingEnabled ? "Hybrid" : "Participation Based", value: orgDetails.hybridVotingEnabled ? "hybrid" : "participation_based" },
        ]);
        break;
      case steps.ASK_VOTING_CONTRACT:
          let votingControlType;
          switch (input) {
            case 'hybrid':
              votingControlType = 'Hybrid';
              break;
            case 'direct_democracy':
              votingControlType = 'DirectDemocracy';
              break;
            case 'participation_based':
              votingControlType = 'Participation';
              break;
            default:
              votingControlType = input; // default to the input value if it doesn't match any case
          }
          setOrgDetails((prevDetails) => ({
            ...prevDetails,
            votingControlType: votingControlType,
          }));
          setCurrentStep(steps.ASK_ROLE);
          addMessage("Voting contract has been set.\n\n By default, your organization will have two roles: Regular and Executive. Executive members can create tasks and polls.\n\n #### Would you like to add more roles?");
          setOptions(yesNoOptions);
          setShowSelection(true);
          break;
      case steps.ASK_ROLE:
        setShowSelection(false);
        if (input.toLowerCase() === "yes") {
          setIsMemberSpecificationModalOpen(true);
        } else {
          setCurrentStep(steps.ASK_IF_LOGO_UPLOAD);
          addMessage("Okay, skipping role addition.\n\n #### Would you like to upload a logo for your organization? Click No if you don't have one.");
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

  const handleSaveMemberRole = (roleName) => {
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      membershipTypeNames: [...prevDetails.membershipTypeNames, roleName],
    }));
    addMessage(`I just added the ${roleName} role to your organization.`);
    askToAddAnotherRole();
  };

  const askToAddAnotherRole = () => {
    addMessage("#### Would you like to add another role?");
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
    setIsWeightModalOpen(false);
    addMessage("Hybrid vote weights have been set.\n\n #### What Approval percentage would you like?");
    setCurrentStep(steps.ASK_QUORUM_PERCENTAGE);
  };

  const handleSaveAllSelections = async () => {
    setIsConfirmationModalOpen(false);
    await deployOrg();
    setLoadingCompleted(true);
    //setShowDeployer(true);
  };

  const deployOrg = async () => {
    console.log("Deploying organization with the following details:", orgDetails);
    const quorum = orgDetails.participationVoteQuorum || orgDetails.hybridVoteQuorum;
    try {
      await main(
        orgDetails.membershipTypeNames,
        orgDetails.executiveRoleNames,
        orgDetails.POname,
        orgDetails.quadraticVotingEnabled,
        orgDetails.democracyVoteWeight,
        orgDetails.participationVoteWeight,
        orgDetails.hybridVotingEnabled,
        orgDetails.participationVotingEnabled,
        orgDetails.logoURL,
        orgDetails.infoIPFSHash,
        orgDetails.votingControlType,
        orgDetails.directDemocracyQuorum,
        quorum,
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
      <Box position="fixed" top="30px" right="30px" padding="8px" backgroundColor="red" color="white" borderRadius="5px" width={["100px", "180px"]}>
        <Text fontSize="sm">
          This is AlphaV1. There may be some bugs. Please report in our discord.
        </Text>
      </Box>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Box mt="8" position="fixed" top="0" left="0" right="0" zIndex="sticky">
          <motion.div variants={itemVariants}>
            <Character />
          </motion.div>
        </Box>
        <Box position="fixed" top="110px" overflowY="auto" width="full" pt="2" px="2">
          <ConversationLog messages={messages} selectionHeight={selectionHeight} renderMessageContent={(message) => message.text} />
          <MemberSpecificationModal isOpen={isMemberSpecificationModalOpen} onSave={handleSaveMemberRole} onClose={() => setIsMemberSpecificationModalOpen(false)} />
          <WeightModal isOpen={isWeightModalOpen} onSave={handleWeight} onClose={() => setIsWeightModalOpen(false)} />
          <LinksModal isOpen={isLinksModalOpen} onSave={handleSaveLinks} onClose={() => setIsLinksModalOpen(false)} />
          <ConfirmationModal isOpen={isConfirmationModalOpen} orgDetails={orgDetails} onClose={() => setIsConfirmationModalOpen(false)} onStartOver={handleStartOver} onSave={handleSaveAllSelections} wallet={signer} />
          <Deployer signer={signer} isOpen={showDeployer} onClose={() => setShowDeployer(false)} deploymentDetails={orgDetails} />
          <LogoDropzoneModal isOpen={isLogoModalOpen} onSave={pinLogoFile} />
          {isDeploying && (
            <Center>
              <Spinner size="xl" />
            </Center>
          )}
        </Box>
        {showSelection && isInputVisible && options.length > 0 && (
          <Box position="fixed" bottom="60px" left="0" right="0" p="4" display="flex" alignItems="center" justifyContent="center"bg="rgba(255, 255, 255, 0.9)" backdropFilter="blur(5px)" borderTop="2px solid" borderColor="gray.200" zIndex="sticky">
            <Selection ref={selectionRef} options={options} onOptionSelected={handleUserInput} />
          </Box>
        )}
        {showSelection && !isInputVisible && options.length > 0 && (
          <Box position="fixed" bottom="0px" left="0" right="0" p="4" display="flex" alignItems="center" justifyContent="center" bg="rgba(255, 255, 255, 0.9)" backdropFilter="blur(5px)" borderTop="2px solid" borderColor="gray.200" zIndex="sticky">
            <Selection ref={selectionRef} options={options} onOptionSelected={handleUserInput} />
          </Box>
        )}
        <Box position="fixed" bottom="0" width="full" p={4} paddingRight={10} zIndex="sticky">
          {orgName && loadingCompleted && (
            <Button position="absolute" top="4" right="4" colorScheme="teal" onClick={() => router.push(`/home/?userDAO=${orgName}`)}>
              Access site
            </Button>
          )}
          {isInputVisible && (
            <ArchitectInput value={userInput} onChange={(e) => setUserInput(e.target.value)} onSubmit={handleSendClick} isDisabled={isWaiting} />
          )}
        </Box>
      </motion.div>
    </Layout>
  );
};

export default ArchitectPage;
