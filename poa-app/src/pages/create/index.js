// ArchitectPage.js

import React, { useState, useEffect, useRef } from "react";
import {
  Spinner,
  Center,
  Box,
  useToast,
  Button,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Checkbox,
  Select,
  Badge,
} from "@chakra-ui/react";
import OpenAI from "openai";
import ArchitectInput from "@/components/Architect/ArchitectInput";
import MemberSpecificationModal from "@/components/Architect/MemberSpecificationModal";
import WeightModal from "@/components/Architect/WeightModal";
import LogoDropzoneModal from "@/components/Architect/LogoDropzoneModal";
import ConfirmationModal from "@/components/Architect/ConfirmationModal";
import LinksModal from "@/components/Architect/LinksModal";
import ConversationLog from "@/components/Architect/ConversationLog";
import Deployer from "@/components/Architect/TempDeployer";
import { useWeb3Context } from "@/context/web3Context";
import { useIPFScontext } from "@/context/ipfsContext";
import { main } from "../../../scripts/newDeployment";

const steps = {
  ORGANIZATION_DETAILS: "ORGANIZATION_DETAILS",
  VOTING_FEATURES: "VOTING_FEATURES",
  ADDITIONAL_SETTINGS: "ADDITIONAL_SETTINGS",
  CONFIRMATION: "CONFIRMATION",
};

const ArchitectPage = () => {
  const { signer, address } = useWeb3Context();
  const { addToIpfs } = useIPFScontext();
  const toast = useToast();

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isMemberSpecificationModalOpen, setIsMemberSpecificationModalOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [assistant, setAssistant] = useState(null);
  const [thread, setThread] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [openai, setOpenai] = useState(null);
  const [isInputVisible, setIsInputVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(steps.ORGANIZATION_DETAILS);

  const [orgDetails, setOrgDetails] = useState({
    membershipTypeNames: ["Default", "Executive"],
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
    directDemocracyEnabled: true, // Added to control direct democracy
    username: "",
  });

  const initChatBotCalled = useRef(false);

  useEffect(() => {
    if (!initChatBotCalled.current) {
      initChatBot();
      initChatBotCalled.current = true;
    }
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

    const introMessage =
      '#### Hello! I\'m **Poa**, your Perpetual Organization architect. I\'m here to help you build unstoppable, fully community-owned organizations.\n\n' +
      'Feel free to ask me any questions as you go through the setup process on the right side of the screen.';

    addMessage(introMessage, "Poa");
  };

  const addMessage = (text, speaker = "Poa", isTyping = false) => {
    setMessages((prevMessages) => [...prevMessages, { speaker, text, isTyping }]);
  };

  const handleSendClick = () => {
    if (!userInput.trim()) return;
    handleUserInput(userInput.trim());
    setUserInput("");
  };

  const handleUserInput = async (input) => {
    addMessage(input, "User");
    await askChatBot(input);
  };

  const askChatBot = async (input) => {
    setIsWaiting(true);
    addMessage("", "Poa", true);
    await openai.beta.threads.messages.create(thread.id, { role: "user", content: input });
    const run = await openai.beta.threads.runs.create(thread.id, { assistant_id: assistant.id });
    let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    while (response.status === "in_progress" || response.status === "queued") {
      await new Promise((resolve) => setTimeout(resolve, 250));
      response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    setIsWaiting(false);
    const messageList = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messageList.data.find(
      (message) => message.run_id === run.id && message.role === "assistant"
    );

    if (lastMessage) {
      setMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === prevMessages.length - 1
            ? { ...msg, text: lastMessage.content[0]["text"].value, isTyping: false }
            : msg
        )
      );
    }
  };

  const handleNextStep = async () => {
    if (currentStep === steps.ORGANIZATION_DETAILS) {
      // Validate required fields
      if (!orgDetails.POname || !orgDetails.description) {
        toast({
          title: "Incomplete Information",
          description: "Please provide both organization name and description.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Upload description and links to IPFS
      await createAndUploadJson();

      setCurrentStep(steps.VOTING_FEATURES);
    } else if (currentStep === steps.VOTING_FEATURES) {
      // Proceed to additional settings
      setCurrentStep(steps.ADDITIONAL_SETTINGS);
    } else if (currentStep === steps.ADDITIONAL_SETTINGS) {
      // Proceed to confirmation
      setCurrentStep(steps.CONFIRMATION);
      setIsConfirmationModalOpen(true);
    }
  };

  const createAndUploadJson = async () => {
    const jsonData = {
      description: orgDetails.description,
      links: orgDetails.links.map((link) => ({
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

  const handleDeploy = async () => {
    setIsConfirmationModalOpen(false);
    await deployOrg();
    // Handle post-deployment actions
  };

  const deployOrg = async () => {
    setIsDeploying(true);
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
        true,
        true,
        orgDetails.logoURL,
        orgDetails.infoIPFSHash,
        orgDetails.votingControlType,
        orgDetails.directDemocracyQuorum,
        orgDetails.participationVoteQuorum,
        orgDetails.username,
        signer
      );
      // Handle successful deployment
    } catch (error) {
      console.error("Error deploying organization:", error);
      toast({
        title: "Deployment failed.",
        description: "There was an error during the deployment process.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    setIsDeploying(false);
  };

  const handleSaveMemberRole = (roleName) => {
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      membershipTypeNames: [...prevDetails.membershipTypeNames, roleName],
    }));
  };

  const handleWeight = ({ participationWeight, democracyWeight }) => {
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      democracyVoteWeight: democracyWeight,
      participationVoteWeight: participationWeight,
    }));
    setIsWeightModalOpen(false);
  };

  const [linksAdded, setLinksAdded] = useState(false); 
  const [logoUploaded, setLogoUploaded] = useState(false); 
  const [hybridWeightsSet, setHybridWeightsSet] = useState(false);

  return (
    <Flex height="100vh" overflow="hidden">
      {/* Left Sidebar for Chat Bot */}
      <Box
        width={["100%", "35%"]}
        borderRight="1px solid #e2e8f0"
        overflowY="auto"
        overflowX="hidden"
        position="relative"
        p={4}
      >
        {/* Conversation Log */}
        <Box overflowY="auto" width="full" pt="2" pb="100px">
          <ConversationLog messages={messages} />
        </Box>
        {/* Input Box */}
        {isInputVisible && (
          <Box
            position="absolute"
            bottom="0"
            width="full"
            p={2}
            bg="white"
            borderTop="1px solid #e2e8f0"
          >
            <ArchitectInput
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onSubmit={handleSendClick}
              isDisabled={isWaiting}
            />
          </Box>
        )}
      </Box>

      {/* Right Content Area for Input Forms */}
      <Box width={["100%", "65%"]} overflowY="auto" p={8}>
        {currentStep === steps.ORGANIZATION_DETAILS && (
          <>
            {/* Organization Details Form */}
            <Stack spacing={6} p={6} border="1px solid" borderColor="gray.200" borderRadius="md" boxShadow="md">
              <Text fontSize="2xl" fontWeight="bold" mb={4} color="gray.700">
                Describe Your Organization
              </Text>
              <FormControl id="orgName" isRequired>
                <FormLabel fontSize="lg" fontWeight="medium">Organization Name</FormLabel>
                <Input
                  size="lg"
                  placeholder="Enter your organization name"
                  value={orgDetails.POname}
                  onChange={(e) =>
                    setOrgDetails({ ...orgDetails, POname: e.target.value })
                  }
                />
              </FormControl>
              <FormControl id="orgDescription" isRequired>
                <FormLabel fontSize="lg" fontWeight="medium">Organization Description</FormLabel>
                <Textarea
                  size="lg"
                  placeholder="Enter a brief description"
                  value={orgDetails.description}
                  onChange={(e) =>
                    setOrgDetails({ ...orgDetails, description: e.target.value })
                  }
                />
              </FormControl>
              <FormControl id="orgLinks">
                <FormLabel fontSize="lg" fontWeight="medium">Organization Links</FormLabel>
                <Button size="lg" onClick={() => setIsLinksModalOpen(true)}>
                  {linksAdded ? "Edit Links" : "Add Links"}
                </Button>
                {linksAdded && <Badge colorScheme="green" ml={2}>Links Added</Badge>}
              </FormControl>
              <FormControl id="orgLogo">
                <FormLabel fontSize="lg" fontWeight="medium">Organization Logo</FormLabel>
                <Button size="lg" onClick={() => setIsLogoModalOpen(true)}>
                  {logoUploaded ? "Change Logo" : "Upload Logo"}
                </Button>
                {logoUploaded && <Badge colorScheme="green" ml={2}>Logo Uploaded</Badge>}
              </FormControl>
            </Stack>

            {/* Next Button */}
            <Button
              mt={6}
              size="lg"
              colorScheme="teal"
              onClick={handleNextStep}
              isDisabled={!orgDetails.POname || !orgDetails.description}
            >
              Next
            </Button>
          </>
        )}

        {currentStep === steps.VOTING_FEATURES && (
          <>
            {/* Voting Features Selection */}
            <Stack spacing={6} p={6} border="1px solid" borderColor="gray.200" borderRadius="md" boxShadow="md">
              <Text fontSize="2xl" fontWeight="bold" mb={4} color="gray.700">
                Select Voting Features
              </Text>
              <FormControl isRequired>
                <FormLabel fontSize="lg" fontWeight="medium">Enable Direct Democracy</FormLabel>
                <Checkbox
                  size="lg"
                  colorScheme="teal"
                  isChecked={orgDetails.directDemocracyEnabled}
                  onChange={(e) =>
                    setOrgDetails({ ...orgDetails, directDemocracyEnabled: e.target.checked })
                  }
                >
                  Direct Democracy
                </Checkbox>
              </FormControl>
              {orgDetails.directDemocracyEnabled && (
                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="medium">Direct Democracy Approval Percentage (Quorum)</FormLabel>
                  <Input
                    type="number"
                    size="lg"
                    placeholder="Enter approval percentage"
                    value={orgDetails.directDemocracyQuorum}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      setOrgDetails({ ...orgDetails, directDemocracyQuorum: value });
                    }}
                  />
                </FormControl>
              )}
              <FormControl>
                <FormLabel fontSize="lg" fontWeight="medium">Select Voting Type (Choose One)</FormLabel>
                <Select
                  placeholder="Select voting type"
                  size="lg"
                  value={
                    orgDetails.hybridVotingEnabled
                      ? "Hybrid"
                      : orgDetails.participationVotingEnabled
                      ? "Participation"
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setOrgDetails({
                      ...orgDetails,
                      hybridVotingEnabled: value === "Hybrid",
                      participationVotingEnabled: value === "Participation",
                    });
                  }}
                >
                  <option value="Hybrid">Hybrid Voting</option>
                  <option value="Participation">Participation-Based Voting</option>
                </Select>
              </FormControl>

              {orgDetails.hybridVotingEnabled && (
                <>
                  <FormControl>
                    <FormLabel fontSize="lg" fontWeight="medium">Hybrid Voting Weights</FormLabel>
                    <Button
                      size="lg"
                      onClick={() => setIsWeightModalOpen(true)}
                      bg="teal.500"
                      color="white"
                      _hover={{ bg: "teal.600" }}
                    >
                      {hybridWeightsSet ? "Edit Weights" : "Set Weights"}
                    </Button>
                    {hybridWeightsSet && <Badge colorScheme="green" ml={2}>Weights Set</Badge>}
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="lg" fontWeight="medium">Hybrid Voting Approval Percentage (Quorum)</FormLabel>
                    <Input
                      type="number"
                      size="lg"
                      placeholder="Enter approval percentage"
                      value={orgDetails.hybridVoteQuorum}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        setOrgDetails({ ...orgDetails, hybridVoteQuorum: value });
                      }}
                    />
                  </FormControl>
                </>
              )}

              {orgDetails.participationVotingEnabled && (
                <FormControl isRequired>
                  <FormLabel fontSize="lg" fontWeight="medium">Participation Voting Approval Percentage (Quorum)</FormLabel>
                  <Input
                    type="number"
                    size="lg"
                    placeholder="Enter approval percentage"
                    value={orgDetails.participationVoteQuorum}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      setOrgDetails({ ...orgDetails, participationVoteQuorum: value });
                    }}
                  />
                </FormControl>
              )}

              <FormControl>
                <FormLabel fontSize="lg" fontWeight="medium">Enable Quadratic Voting</FormLabel>
                <Checkbox
                  size="lg"
                  colorScheme="teal"
                  isChecked={orgDetails.quadraticVotingEnabled}
                  onChange={(e) =>
                    setOrgDetails({ ...orgDetails, quadraticVotingEnabled: e.target.checked })
                  }
                >
                  Quadratic Voting
                </Checkbox>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="lg" fontWeight="medium">Voting Contract Control</FormLabel>
                <Select
                  size="lg"
                  value={orgDetails.votingControlType}
                  onChange={(e) =>
                    setOrgDetails({ ...orgDetails, votingControlType: e.target.value })
                  }
                >
                  {orgDetails.directDemocracyEnabled && (
                    <option value="DirectDemocracy">Direct Democracy</option>
                  )}
                  {orgDetails.hybridVotingEnabled && (
                    <option value="Hybrid">Hybrid</option>
                  )}
                  {orgDetails.participationVotingEnabled && (
                    <option value="Participation">Participation-Based</option>
                  )}
                </Select>
              </FormControl>
              {/* Next Button */}
              <Button
                mt={6}
                size="lg"
                colorScheme="teal"
                onClick={handleNextStep}
              >
                Next
              </Button>
            </Stack>

          </>
        )}

        {currentStep === steps.ADDITIONAL_SETTINGS && (
          <>
            {/* Additional Settings */}
            <Stack spacing={6} p={6} border="1px solid" borderColor="gray.200" borderRadius="md" boxShadow="md">
              <Text fontSize="2xl" fontWeight="bold" mb={4} color="gray.700">
                Additional Settings
              </Text>
              <FormControl>
                <FormLabel fontSize="lg" fontWeight="medium">Do you want to add more roles?</FormLabel>
                <Button
                  size="lg"
                  colorScheme="teal"
                  onClick={() => setIsMemberSpecificationModalOpen(true)}
                >
                  Add Roles
                </Button>
              </FormControl>
              <Button
                mt={6}
                size="lg"
                colorScheme="teal"
                onClick={handleNextStep}
              >
                Next
              </Button>
            </Stack>
          </>
        )}

        {/* Modals and Additional Components */}
        <MemberSpecificationModal
          isOpen={isMemberSpecificationModalOpen}
          onSave={handleSaveMemberRole}
          onClose={() => setIsMemberSpecificationModalOpen(false)}
        />
        <WeightModal
          isOpen={isWeightModalOpen}
          onSave={() => {
            handleWeight();
            setHybridWeightsSet(true);
          }}
          onClose={() => setIsWeightModalOpen(false)}
        />
        <LinksModal
          isOpen={isLinksModalOpen}
          onSave={(links) => {
            setOrgDetails({ ...orgDetails, links });
            setLinksAdded(true);
          }}
          onClose={() => setIsLinksModalOpen(false)}
        />
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          orgDetails={orgDetails}
          onClose={() => setIsConfirmationModalOpen(false)}
          onStartOver={() => setCurrentStep(steps.ORGANIZATION_DETAILS)}
          onSave={handleDeploy}
          wallet={signer}
        />
        <Deployer
          signer={signer}
          isOpen={isDeploying}
          onClose={() => setIsDeploying(false)}
          deploymentDetails={orgDetails}
        />
        <LogoDropzoneModal
          isOpen={isLogoModalOpen}
          onSave={(ipfsUrl) => {
            setOrgDetails({ ...orgDetails, logoURL: ipfsUrl });
            setLogoUploaded(true);
          }}
          onClose={() => setIsLogoModalOpen(false)}
        />
        {isDeploying && (
          <Center>
            <Spinner mb="4" size="xl" />
          </Center>
        )}
      </Box>
    </Flex>
  );
};

export default ArchitectPage;
