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
  Badge,
  Image,
  Progress,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Tooltip,
  ButtonGroup,
  FormErrorMessage,
  Collapse,
  useBreakpointValue,
  HStack,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  CloseIcon,
  InfoIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import OpenAI from "openai";
import ArchitectInput from "@/components/Architect/ArchitectInput";
import MemberSpecificationModal from "@/components/Architect/MemberSpecificationModal";
import LogoDropzoneModal from "@/components/Architect/LogoDropzoneModal";
import ConfirmationModal from "@/components/Architect/ConfirmationModal";
import LinksModal from "@/components/Architect/LinksModal";
import ConversationLog from "@/components/Architect/ConversationLog";
import Deployer from "@/components/Architect/TempDeployer";
import { useWeb3Context } from "@/context/web3Context";
import { useIPFScontext } from "@/context/ipfsContext";
import { main } from "../../../scripts/newDeployment";
import { useRouter } from "next/router";

const steps = {
  ORGANIZATION_DETAILS: "ORGANIZATION_DETAILS",
  VOTING_FEATURES: "VOTING_FEATURES",
  ADDITIONAL_SETTINGS: "ADDITIONAL_SETTINGS",
  CONFIRMATION: "CONFIRMATION",
};

const stepDescriptions = {
  ORGANIZATION_DETAILS:
    "Describe your organization to help contributors understand your goals and vision.",
  VOTING_FEATURES:
    "Select the voting features that best suit your organization's needs.",
  ADDITIONAL_SETTINGS: "Configure additional settings for your organization.",
  CONFIRMATION:
    "Review and confirm your organization's details before deployment.",
};

const ArchitectPage = () => {
  const { signer, address } = useWeb3Context();
  const { addToIpfs } = useIPFScontext();
  const toast = useToast();
  const router = useRouter();

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isMemberSpecificationModalOpen, setIsMemberSpecificationModalOpen] =
    useState(false);
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

  const [isCollapsed, setIsCollapsed] = useState(false);

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const handleExitClick = () => {
    setIsExitModalOpen(true);
  };

  const handleExitConfirm = () => {
    setIsExitModalOpen(false);
    router.push("/landing");
  };

  const handleExitCancel = () => {
    setIsExitModalOpen(false);
  };

  const [orgDetails, setOrgDetails] = useState({
    membershipTypeNames: ["Default", "Executive"],
    executiveRoleNames: ["Executive"],
    POname: "",
    description: "",
    links: [],
    quadraticVotingEnabled: false,
    democracyVoteWeight: 50,
    participationVoteWeight: 50,
    hybridVotingEnabled: false,
    participationVotingEnabled: false,
    logoURL: "",
    infoIPFSHash: "",
    votingControlType: "",
    directDemocracyQuorum: "",
    hybridVoteQuorum: "",
    participationVoteQuorum: "",
    directDemocracyEnabled: true,
    username: "",
    electionHubEnabled: false,
    educationHubEnabled: false,
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

    const assistant = await openai.beta.assistants.retrieve(
      "asst_HopuEd843XXuOmDlfRCCfT7k"
    );
    const thread = await openai.beta.threads.create();
    setAssistant(assistant);
    setThread(thread);

    const introMessage =
      '#### Hello! I\'m **Poa**, your Perpetual Organization architect. I\'m here to help you build unstoppable, fully community-owned organizations.\n\n' +
      'Feel free to ask me any questions as you go through the setup process on the right side of the screen.';

    addMessage(introMessage, "Poa");
  };

  const addMessage = (text, speaker = "Poa", isTyping = false) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { speaker, text, isTyping },
    ]);
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
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: input,
    });
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });
    let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    while (response.status === "in_progress" || response.status === "queued") {
      await new Promise((resolve) => setTimeout(resolve, 200));
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
            ? {
                ...msg,
                text: lastMessage.content[0]["text"].value,
                isTyping: false,
              }
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
          description:
            "Please provide both organization name and description.",
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

  const handleBackStep = () => {
    if (currentStep === steps.VOTING_FEATURES) {
      setCurrentStep(steps.ORGANIZATION_DETAILS);
    } else if (currentStep === steps.ADDITIONAL_SETTINGS) {
      setCurrentStep(steps.VOTING_FEATURES);
    } else if (currentStep === steps.CONFIRMATION) {
      setCurrentStep(steps.ADDITIONAL_SETTINGS);
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
        orgDetails.electionHubEnabled,
        orgDetails.educationHubEnabled,
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

  const [linksAdded, setLinksAdded] = useState(false);
  const [logoUploaded, setLogoUploaded] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  // Responsive values using useBreakpointValue
  const formPadding = useBreakpointValue({ base: 3, lg: 4, xl: 6 });
  const formSpacing = useBreakpointValue({ base: 4, lg: 6, xl: 8 });
  const componentSize = useBreakpointValue({ base: "md", lg: "lg", xl: "xl" });
  const labelFontSize = useBreakpointValue({ base: "md", lg: "lg", xl: "xl" });
  const headerFontSize = useBreakpointValue({
    base: "lg",
    lg: "xl",
    xl: "2xl",
  });
  const inputSize = useBreakpointValue({ base: "md", lg: "lg", xl: "lg" });
  const buttonSize = useBreakpointValue({ base: "md", lg: "lg", xl: "lg" });
  const progressSize = useBreakpointValue({ base: "sm", lg: "md", xl: "lg" });

  const exitButtonTop = useBreakpointValue({
    base: "8px",
    lg: "8px",
    xl: "12px",
  });
  const exitButtonRight = useBreakpointValue({
    base: "10px",
    lg: "16px",
    xl: "25px",
  });
  const exitButtonSize = useBreakpointValue({ base: "md", lg: "md", xl: "lg" });

  const Header = ({ step, description, progress }) => (
    <Box
      mt={{ base: "8", lg: "10", xl: "12" }}
      mb={4}
      p={formPadding}
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      boxShadow="md"

    >
      <Text
        fontSize={headerFontSize}
        fontWeight="bold"
        mb={2}
        color="gray.700"
      >
        {step}
      </Text>
      <Text
        fontSize={{ base: "sm", lg: "md", xl: "lg" }}
        color="gray.500"
        mb={4}
      >
        {description}
      </Text>
      <HStack justify="space-between">
        <Progress
          value={progress}
          size={progressSize}
          borderRadius="lg"
          colorScheme="blue"
          flex="1" 
        />
        <Text
          fontSize="xs"
          color="gray.500"
          whiteSpace="nowrap" 
          ml={2} 
        >
          Step {getCurrentStepIndex() + 1} of {Object.keys(steps).length}
        </Text>
    </HStack>
    </Box>
  );

  const getCurrentStepIndex = () => {
    return Object.keys(steps).indexOf(currentStep);
  };

  // Validation function
  const validateQuorum = (value) => {
    if (value < 0 || value > 100 || isNaN(value)) {
      return "Please enter a valid percentage between 0 and 100.";
    }
    return "";
  };

  // State for form errors
  const [errors, setErrors] = useState({});

  // Handler for Next button click
  const onNext = () => {
    const newErrors = {};
    if (!orgDetails.directDemocracyQuorum) {
      newErrors.directDemocracyQuorum = "This field is required.";
    } else {
      const errorMsg = validateQuorum(orgDetails.directDemocracyQuorum);
      if (errorMsg) newErrors.directDemocracyQuorum = errorMsg;
    }

    if (orgDetails.hybridVotingEnabled) {
      if (!orgDetails.hybridVoteQuorum) {
        newErrors.hybridVoteQuorum = "This field is required.";
      } else {
        const errorMsg = validateQuorum(orgDetails.hybridVoteQuorum);
        if (errorMsg) newErrors.hybridVoteQuorum = errorMsg;
      }
      if (
        orgDetails.democracyVoteWeight + orgDetails.participationVoteWeight !==
        100
      ) {
        newErrors.voteWeights =
          "The total weight must equal 100%. Please adjust the values.";
      }
    }

    if (orgDetails.participationVotingEnabled) {
      if (!orgDetails.participationVoteQuorum) {
        newErrors.participationVoteQuorum = "This field is required.";
      } else {
        const errorMsg = validateQuorum(orgDetails.participationVoteQuorum);
        if (errorMsg) newErrors.participationVoteQuorum = errorMsg;
      }
    }

    if (!orgDetails.votingControlType) {
      newErrors.votingControlType = "Please select a voting control type.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleNextStep();
    } else {
      toast({
        title: "Form validation error",
        description: "Please fix the errors before proceeding.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handler for interconnected input fields
  const handleVoteWeightChange = (field, value) => {
    const intValue = parseInt(value) || 0;
    if (intValue < 0 || intValue > 100) return;

    if (field === "democracy") {
      setOrgDetails({
        ...orgDetails,
        democracyVoteWeight: intValue,
        participationVoteWeight: 100 - intValue,
      });
    } else {
      setOrgDetails({
        ...orgDetails,
        participationVoteWeight: intValue,
        democracyVoteWeight: 100 - intValue,
      });
    }
  };

  return (
    <Flex
      height="100vh"
      overflow="hidden"
      direction={{ base: "column", md: "row" }}
    >
      {/* Exit Button */}
      <Box position="absolute" top={exitButtonTop} right={exitButtonRight}>
        <IconButton
          onClick={handleExitClick}
          colorScheme="blackAlpha"
          aria-label="Exit"
          icon={<CloseIcon />}
          size={exitButtonSize}
          isRound
        />
      </Box>
      {/* Left Sidebar for Chat Bot */}
      <Box
        width={
          isCollapsed
            ? "129px"
            : { base: "100%", md: "100%", lg: "40%" }
        }
        overflow="hidden"
        position="relative"
        p={0}
        bg={isCollapsed ? "transparent" : "rgba(0, 0, 0, 0.45)"}
        borderRight={
          isCollapsed ? "none" : { base: "none", lg: "none" }
        }
      >
        {/* Only show content if not collapsed */}
        {!isCollapsed ? (
          <>
            {/* Collapse Button */}
            <Button
              position="absolute"
              top="20px"
              right="6px"
              onClick={toggleCollapse}
              borderRadius="full"
              colorScheme="teal"
            >
              <ChevronLeftIcon />
            </Button>
            <Box
              overflowY="auto"
              width="full"
              pt="4"
              pb="100px"
              pl="3"
              pr="3"
            >
              <Center mb="4">
                <Image
                  src="/images/high_res_poa.png"
                  alt="Poa Logo"
                  width={{ base: "80px", md: "100px" }}
                  height={{ base: "80px", md: "100px" }}
                />
              </Center>

              <ConversationLog messages={messages} />
            </Box>
            {isInputVisible && (
              <Box
                position="absolute"
                bottom="0"
                width="full"
                p={0}
                bg="gray.100"
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
          </>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="top"
            height="100%"
            cursor="pointer"
            onClick={toggleCollapse}
            mt="6"
            ml="4"
          >
            {/* Display the Poa high-res image */}
            <Image
              src="/images/high_res_poa.png"
              alt="Poa Logo"
              width="100px"
              height="100px"
            />
          </Box>
        )}
      </Box>
  
      {/* Right Content Area for Input Forms */}
      <Box
        width={
          isCollapsed
            ? "100%"
            : { base: "100%", md: "100%", lg: "60%" }
        }
        overflowY="auto"
        p={formPadding}
      >
        <Header
          step={currentStep.replace(/_/g, " ")}
          description={stepDescriptions[currentStep]}
          progress={
            (getCurrentStepIndex() + 1) * (100 / Object.keys(steps).length)
          }
        />
  
        {currentStep === steps.ORGANIZATION_DETAILS && (
          <>
            {/* Organization Details Form */}
            <Stack
              bg="white"
              spacing={formSpacing}
              p={formPadding}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="md"
            >
              <FormControl id="orgName" isRequired>
                <FormLabel fontSize={labelFontSize} fontWeight="medium">
                  Organization Name
                </FormLabel>
                <Input
                  size={inputSize}
                  placeholder="Enter your organization name"
                  value={orgDetails.POname}
                  onChange={(e) =>
                    setOrgDetails({ ...orgDetails, POname: e.target.value })
                  }
                />
              </FormControl>
              <FormControl id="orgDescription" isRequired>
                <FormLabel fontSize={labelFontSize} fontWeight="medium">
                  Description
                </FormLabel>
                <Textarea
                  size={inputSize}
                  placeholder="Enter a brief description"
                  value={orgDetails.description}
                  onChange={(e) =>
                    setOrgDetails({
                      ...orgDetails,
                      description: e.target.value,
                    })
                  }
                />
              </FormControl>
              <Stack
                spacing={4}
                direction={{ base: "column", md: "row" }}
              >
                <FormControl id="orgLinks">
                  <FormLabel fontSize={labelFontSize} fontWeight="medium">
                    Organization Links
                  </FormLabel>
                  <Button
                    size={buttonSize}
                    onClick={() => setIsLinksModalOpen(true)}
                  >
                    {linksAdded ? "Edit Links" : "Add Links"}
                  </Button>
                  {linksAdded && (
                    <Badge colorScheme="green" ml={2}>
                      Links Added
                    </Badge>
                  )}
                </FormControl>
  
                <FormControl id="orgLogo">
                  <FormLabel fontSize={labelFontSize} fontWeight="medium">
                    Organization Logo
                  </FormLabel>
                  <Button
                    size={buttonSize}
                    onClick={() => setIsLogoModalOpen(true)}
                  >
                    {logoUploaded ? "Change Logo" : "Upload Logo"}
                  </Button>
                  {logoUploaded && (
                    <Badge colorScheme="green" ml={2}>
                      Logo Uploaded
                    </Badge>
                  )}
                </FormControl>
              </Stack>
              {/* Next and Back Buttons */}
              <Flex
                justifyContent="space-between"
                mt={4}
                direction={{ base: "column", md: "row" }}
              >
                <Button
                  size={buttonSize}
                  colorScheme="gray"
                  onClick={handleBackStep}
                  isDisabled={currentStep === steps.ORGANIZATION_DETAILS}
                  mb={{ base: 2, md: 0 }}
                >
                  Back
                </Button>
                <Button
                  size={buttonSize}
                  colorScheme="blue"
                  onClick={handleNextStep}
                  isDisabled={!orgDetails.POname || !orgDetails.description}
                >
                  Next
                </Button>
              </Flex>
            </Stack>
          </>
        )}
  
        {currentStep === steps.VOTING_FEATURES && (
          <>
            {/* Voting Features Selection */}
            <Stack
              spacing={formSpacing}
              p={formPadding}
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="md"
            >
              {/* Direct Democracy Quorum */}
              <FormControl
                isRequired
                isInvalid={errors.directDemocracyQuorum}
              >
                <FormLabel fontSize={labelFontSize} fontWeight="medium">
                  Direct Democracy Approval Percentage (Quorum)
                  <Tooltip
                    label="Set the required approval percentage for direct democracy decisions. Ask Poa if you have further questions."
                    fontSize="md"
                  >
                    <InfoIcon ml={2} />
                  </Tooltip>
                </FormLabel>
                <Input
                  type="number"
                  size={inputSize}
                  placeholder="Enter approval percentage"
                  value={orgDetails.directDemocracyQuorum || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setOrgDetails({
                      ...orgDetails,
                      directDemocracyQuorum: value,
                    });
                  }}
                  aria-describedby="direct-democracy-quorum-helper"
                />
                <FormErrorMessage>
                  {errors.directDemocracyQuorum}
                </FormErrorMessage>
              </FormControl>
  
              {/* Voting Type Selection */}
              <FormControl isRequired>
                <FormLabel fontSize={labelFontSize} fontWeight="medium">
                  Select Voting Type
                  <Tooltip
                    label="Choose between Hybrid or Participation-Based voting. Ask Poa if you have further questions."
                    fontSize="md"
                  >
                    <InfoIcon ml={2} />
                  </Tooltip>
                </FormLabel>
                <ButtonGroup size={buttonSize} isAttached variant="outline">
                  <Button
                    // leftIcon={<SettingsIcon />}
                    variant={
                      orgDetails.hybridVotingEnabled ? "solid" : "outline"
                    }
                    onClick={() =>
                      setOrgDetails({
                        ...orgDetails,
                        hybridVotingEnabled: true,
                        participationVotingEnabled: false,
                      })
                    }
                    aria-pressed={orgDetails.hybridVotingEnabled}
                  >
                    Hybrid
                  </Button>
                  <Button
                    // leftIcon={<SettingsIcon />}
                    variant={
                      orgDetails.participationVotingEnabled
                        ? "solid"
                        : "outline"
                    }
                    onClick={() =>
                      setOrgDetails({
                        ...orgDetails,
                        hybridVotingEnabled: false,
                        participationVotingEnabled: true,
                      })
                    }
                    aria-pressed={orgDetails.participationVotingEnabled}
                  >
                    Participation-Based
                  </Button>
                </ButtonGroup>
              </FormControl>
  
              {/* Hybrid Voting Settings */}
              {orgDetails.hybridVotingEnabled && (
                <Collapse in={orgDetails.hybridVotingEnabled} animateOpacity>
                  <FormControl
                    isRequired
                    isInvalid={errors.voteWeights}
                    mt={4}
                  >
                    <FormLabel fontSize={labelFontSize} fontWeight="medium">
                      Vote Weight Distribution
                      <Tooltip
                        label="Set the percentage split between Direct Democracy and Participation-Based Voting. The total must equal 100%."
                        fontSize="md"
                      >
                        <InfoIcon ml={2} />
                      </Tooltip>
                    </FormLabel>
                    <Stack
                      direction={{ base: "column", md: "row" }}
                      spacing={4}
                    >
                      <Box>
                        <FormLabel>Direct Democracy (%)</FormLabel>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={orgDetails.democracyVoteWeight}
                          onChange={(e) =>
                            handleVoteWeightChange("democracy", e.target.value)
                          }
                          size={inputSize}
                        />
                      </Box>
                      <Box>
                        <FormLabel>Participation-Based (%)</FormLabel>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={orgDetails.participationVoteWeight}
                          onChange={(e) =>
                            handleVoteWeightChange(
                              "participation",
                              e.target.value
                            )
                          }
                          size={inputSize}
                        />
                      </Box>
                    </Stack>
                    <FormErrorMessage>
                      {errors.voteWeights}
                    </FormErrorMessage>
                  </FormControl>
  
                  <FormControl
                    isRequired
                    isInvalid={errors.hybridVoteQuorum}
                    mt={4}
                  >
                    <FormLabel fontSize={labelFontSize} fontWeight="medium">
                      Hybrid Voting Approval Percentage (Quorum)
                      <Tooltip
                        label="Set the required approval percentage for hybrid voting decisions. Ask Poa if you have further questions."
                        fontSize="md"
                      >
                        <InfoIcon ml={2} />
                      </Tooltip>
                    </FormLabel>
                    <Input
                      type="number"
                      size={inputSize}
                      placeholder="Enter approval percentage"
                      value={orgDetails.hybridVoteQuorum || ""}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        setOrgDetails({
                          ...orgDetails,
                          hybridVoteQuorum: value,
                        });
                      }}
                      aria-describedby="hybrid-vote-quorum-helper"
                    />
                    <FormErrorMessage>
                      {errors.hybridVoteQuorum}
                    </FormErrorMessage>
                  </FormControl>
                </Collapse>
              )}
  
              {/* Participation Voting Settings */}
              {orgDetails.participationVotingEnabled && (
                <Collapse
                  in={orgDetails.participationVotingEnabled}
                  animateOpacity
                >
                  <FormControl
                    isRequired
                    isInvalid={errors.participationVoteQuorum}
                    mt={4}
                  >
                    <FormLabel fontSize={labelFontSize} fontWeight="medium">
                      Participation Voting Approval Percentage (Quorum)
                      <Tooltip
                        label="Set the required approval percentage for participation-based voting decisions. Ask Poa if you have further questions."
                        fontSize="md"
                      >
                        <InfoIcon ml={2} />
                      </Tooltip>
                    </FormLabel>
                    <Input
                      type="number"
                      size={inputSize}
                      placeholder="Enter approval percentage"
                      value={orgDetails.participationVoteQuorum || ""}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        setOrgDetails({
                          ...orgDetails,
                          participationVoteQuorum: value,
                        });
                      }}
                      aria-describedby="participation-vote-quorum-helper"
                    />
                    <FormErrorMessage>
                      {errors.participationVoteQuorum}
                    </FormErrorMessage>
                  </FormControl>
                </Collapse>
              )}
  
              {/* Quadratic Voting Option */}
              <FormControl mt={4}>
                <FormLabel fontSize={labelFontSize} fontWeight="medium">
                  Enable Quadratic Voting
                  <Tooltip
                    label="Quadratic Voting allows users to express the intensity of their preferences. Ask Poa if you have further questions."
                    fontSize="md"
                  >
                    <InfoIcon ml={2} />
                  </Tooltip>
                </FormLabel>
                <Checkbox
                  size={componentSize}
                  colorScheme="teal"
                  isChecked={orgDetails.quadraticVotingEnabled}
                  onChange={(e) =>
                    setOrgDetails({
                      ...orgDetails,
                      quadraticVotingEnabled: e.target.checked,
                    })
                  }
                >
                  Quadratic Voting
                </Checkbox>
              </FormControl>
  
              {/* Voting Contract Control */}
              <FormControl
                isRequired
                isInvalid={errors.votingControlType}
                mt={4}
              >
                <FormLabel fontSize={labelFontSize} fontWeight="medium">
                  Voting Contract Control
                  <Tooltip
                    label="Select which voting mechanism controls the voting contract. Ask Poa if you have further questions."
                    fontSize="md"
                  >
                    <InfoIcon ml={2} />
                  </Tooltip>
                </FormLabel>
                <ButtonGroup size={buttonSize} isAttached variant="outline">
                  <Button
                    variant={
                      orgDetails.votingControlType === "DirectDemocracy"
                        ? "solid"
                        : "outline"
                    }
                    onClick={() =>
                      setOrgDetails({
                        ...orgDetails,
                        votingControlType: "DirectDemocracy",
                      })
                    }
                    aria-pressed={
                      orgDetails.votingControlType === "DirectDemocracy"
                    }
                  >
                    Direct Democracy
                  </Button>
                  {orgDetails.hybridVotingEnabled && (
                    <Button
                      variant={
                        orgDetails.votingControlType === "Hybrid"
                          ? "solid"
                          : "outline"
                      }
                      onClick={() =>
                        setOrgDetails({
                          ...orgDetails,
                          votingControlType: "Hybrid",
                        })
                      }
                      aria-pressed={
                        orgDetails.votingControlType === "Hybrid"
                      }
                    >
                      Hybrid
                    </Button>
                  )}
                  {orgDetails.participationVotingEnabled && (
                    <Button
                      variant={
                        orgDetails.votingControlType === "Participation"
                          ? "solid"
                          : "outline"
                      }
                      onClick={() =>
                        setOrgDetails({
                          ...orgDetails,
                          votingControlType: "Participation",
                        })
                      }
                      aria-pressed={
                        orgDetails.votingControlType === "Participation"
                      }
                    >
                      Participation-Based
                    </Button>
                  )}
                </ButtonGroup>
                <FormErrorMessage>
                  {errors.votingControlType}
                </FormErrorMessage>
              </FormControl>
  
              {/* Next and Back Buttons */}
              <Flex
                justifyContent="space-between"
                mt={4}
                direction={{ base: "column", md: "row" }}
              >
                <Button
                  size={buttonSize}
                  colorScheme="gray"
                  onClick={handleBackStep}
                  mb={{ base: 2, md: 0 }}
                >
                  Back
                </Button>
                <Button
                  size={buttonSize}
                  colorScheme="blue"
                  onClick={onNext}
                >
                  Next
                </Button>
              </Flex>
            </Stack>
          </>
        )}
  
        {currentStep === steps.ADDITIONAL_SETTINGS && (
          <>
            {/* Additional Settings */}
            <Stack
              spacing={formSpacing}
              p={formPadding}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              boxShadow="md"
              bg="white"
            >
              <FormControl>
                <FormLabel fontSize={labelFontSize} fontWeight="medium">
                  Do you want to add more roles?
                </FormLabel>
                <Button
                  size={buttonSize}
                  colorScheme="teal"
                  onClick={() => setIsMemberSpecificationModalOpen(true)}
                >
                  Add Roles
                </Button>
              </FormControl>
                {/* Learn and Earn Option */}
                <FormControl>
                      <FormLabel fontSize={labelFontSize} fontWeight="medium">
                        Enable Learn and Earn
                        <Tooltip
                          label="Learn and Earn lets users learn about the organization or other topics and earn tokens."
                          fontSize="md"
                        >
                          <InfoIcon ml={2} />
                        </Tooltip>
                      </FormLabel>
                      <Checkbox
                        size={componentSize}
                        colorScheme="teal"
                        isChecked={orgDetails.educationHubEnabled}
                        onChange={(e) =>
                          setOrgDetails({
                            ...orgDetails,
                            educationHubEnabled: e.target.checked,
                          })
                        }
                      >
                        Learn and Earn
                      </Checkbox>
                    </FormControl>

                    {/* Elections Option */}
                    <FormControl>
                      <FormLabel fontSize={labelFontSize} fontWeight="medium">
                        Enable Elections
                        <Tooltip
                          label="Elections give the ability for the community to elect new executives."
                          fontSize="md"
                        >
                          <InfoIcon ml={2} />
                        </Tooltip>
                      </FormLabel>
                      <Checkbox
                        size={componentSize}
                        colorScheme="teal"
                        isChecked={orgDetails.electionHubEnabled}
                        onChange={(e) =>
                          setOrgDetails({
                            ...orgDetails,
                            electionHubEnabled: e.target.checked,
                          })
                        }
                      >
                        Elections
                      </Checkbox>
                    </FormControl>

              {/* Next and Back Buttons */}
              <Flex
                justifyContent="space-between"
                mt={4}
                direction={{ base: "column", md: "row" }}
              >
                <Button
                  size={buttonSize}
                  colorScheme="gray"
                  onClick={handleBackStep}
                  mb={{ base: 2, md: 0 }}
                >
                  Back
                </Button>
                <Button
                  size={buttonSize}
                  colorScheme="blue"
                  onClick={handleNextStep}
                >
                  Next
                </Button>
              </Flex>
            </Stack>
          </>
        )}
        {/* Modals and Additional Components */}
        <MemberSpecificationModal
          isOpen={isMemberSpecificationModalOpen}
          onSave={handleSaveMemberRole}
          onClose={() => setIsMemberSpecificationModalOpen(false)}
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
        {/* Exit Confirmation Modal */}
        <Modal isOpen={isExitModalOpen} onClose={handleExitCancel}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Are you sure?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              All progress will be lost. Do you really want to stop creating
              your organization?
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={handleExitConfirm}>
                Yes, Exit
              </Button>
              <Button variant="ghost" onClick={handleExitCancel}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
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
