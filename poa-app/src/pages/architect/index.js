import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import ArchitectInput from "@/components/Architect/ArchitectInput";
//import SpecificInput from "@/components/Architect/SpecificInput";
import MemberSpecificationModal from "@/components/Architect/MemberSpecificationModal";

import {
  Box,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import { useRouter } from "next/router";
import ConversationLog from "@/components/Architect/ConversationLog";
import Character from "@/components/Architect/Character";
import Selection from "@/components/Architect/Selection";

const steps = {
  ASK_NAME: "ASK_NAME",
  ASK_DESCRIPTION: "ASK_DESCRIPTION",
  ASK_MEMBERSHIP_DEFAULT: "ASK_MEMBERSHIP_DEFAULT",
  ASK_MEMBERSHIP_CUSTOMIZE: "ASK_MEMBERSHIP_CUSTOMIZE",
  ASK_VOTING: "ASK_VOTING",
};

const votingOptions = [
  { label: "Direct Democracy", value: "direct_democracy" },
  { label: "Quadratic Voting", value: "quadratic" },
];

const membershipOptions = [
  { label: "Executives", value: "executives" },
  { label: "Uniform Membership", value: "uniform_membership" },
];
const defaultMembershipOptions = [
  {
    label: "Keep default",
    value: "default",
    action: () => {
      setOrgDetails({
        ...orgDetails,
        membershipTypeNames: ["member", "executive"],
      });
      setCurrentStep(steps.ASK_VOTING);
      console.log("got he");
      setShowSelection(false);
      console.log("hiding selection");
    },
  },
  {
    label: "I'd like more customization",
    value: "customize",
    action: () => {
      console.log("hopening modal");
      setCurrentStep(steps.ASK_MEMBERSHIP_CUSTOMIZE);
      setShowSelection(false);
    },
  },
];

const ArchitectPage = () => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isMemberSpecificationModalOpen, setIsMemberSpecificationModalOpen] =
    useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showSelection, setShowSelection] = useState(false);

  const [options, setOptions] = useState([]);
  const [orgName, setOrgName] = useState(""); // Holds the organization name input by the user.
  const [currentStep, setCurrentStep] = useState(steps.ASK_NAME);
  const [siteCreated, setSiteCreated] = useState(false);

  // Refs and hooks for UI effects and navigation.
  const selectionRef = useRef(null);
  const [selectionHeight, setSelectionHeight] = useState(0); // State for managing the dynamic height of the selection component.
  const toast = useToast(); // Toast is used for showing alerts and messages to the user.
  const router = useRouter(); // useRouter hook from Next.js for handling client-side navigation.

  const [orgDetails, setOrgDetails] = useState({
    membershipTypeNames: ["member", "executive"], // Default membership types
    POname: "",
    quadraticVotingEnabled: false,
    democracyVoteWeight: "",
    participationVoteWeight: "",
    hybridVotingEnabled: false,
    participationVotingEnabled: false,
    logoURL: "",
    description: "",
    votingControlType: "",
  });

  // Function for creating the organization site. This is where you would
  // include the logic for creating a new organization based on user input.
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
    // Navigate to the new DAO route after creation.
    const formattedOrgName = encodeURIComponent(
      orgName.trim().toLowerCase().replace(/\s+/g, "-")
    );
    setIsConfirmationModalOpen(false);
    router.push(`/[userDAO]/home`, `/${formattedOrgName}/home`);
  };

  const nextStep = () => {
    switch (currentStep) {
      case steps.ASK_NAME:
        setCurrentStep(steps.ASK_DESCRIPTION);
        break;
      case steps.ASK_DESCRIPTION:
        setCurrentStep(steps.ASK_MEMBERSHIP_DEFAULT);
        break;
      //only if the user selects the customize button should it go to customize
      //otherwise it should go to voting
      case steps.ASK_MEMBERSHIP_DEFAULT:
        setCurrentStep(steps.ASK_MEMBERSHIP_CUSTOMIZE);
        break;
      case steps.ASK_MEMBERSHIP_CUSTOMIZE:
        setCurrentStep(steps.ASK_VOTING);
        break;
      case steps.ASK_ENABLE_QUAD_VOTING:
        setCurrentStep(steps.ASK_CONFIRMATION);
        break;
    }
  };

  const handleConfirmation = () => {
    // This is where you would handle the API call to create the site
    // For now, we'll navigate to the new route
    const formattedOrgName = encodeURIComponent(
      orgName.trim().toLowerCase().replace(/\s+/g, "-")
    );
    router.push(`/${formattedOrgName}/home`);
  };

  const handleStartOver = () => {
    // Reset all state to initial values
    setUserInput("");
    setMessages([]);
    setShowSelection(false);
    console.log("hiding selection");
    setOptions([]);
    setOrgName("");
    setOrgDetails({
      membershipTypeNames: ["member", "executive"], // Default membership types
      POname: "",
      quadraticVotingEnabled: false,
      democracyVoteWeight: "",
      participationVoteWeight: "",
      hybridVotingEnabled: false,
      participationVotingEnabled: false,
      logoURL: "",
      description: "",
      votingControlType: "",
    });
    setCurrentStep(steps.ASK_NAME);
    onClose(); // Close the confirmation modal
  };

  useEffect(() => {
    // Simulating a greeting message from "POA" on initial load
    const greetingMessage = {
      speaker: "POA",
      text: "Hello! I'm Poa, your perpetual organization architect.",
    };

    setMessages([...messages, greetingMessage]);
  }, []);

  const handleSaveMemberTier = (tierName) => {
    //  console.log("members: ", membershipTypeNames);
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      membershipTypeNames: [...prevDetails.membershipTypeNames, tierName],
    }));
    console.log("tier name", tierName);
    console.log("mem: ", orgDetails.membershipTypeNames);
  };

  useEffect(() => {
    console.log(
      "Updated membershipTypeNames: ",
      orgDetails.membershipTypeNames
    );
  }, [orgDetails.membershipTypeNames]);

  const handleSendClick = () => {
    // Handle user input based on the current step
    if (!userInput.trim()) return;

    switch (currentStep) {
      case "ASK_NAME":
        setOrgDetails({ ...orgDetails, POname: userInput.trim() });
        setCurrentStep("ASK_DESCRIPTION");
        break;
      case "ASK_DESCRIPTION":
        setOrgDetails({ ...orgDetails, description: userInput.trim() });
        setCurrentStep("ASK_MEMBERSHIP_DEFAULT");
        break;
      case "ASK_MEMBERSHIP_CUSTOMIZE":
        // This step is handled by the modal
        break;
      // Handle other cases as needed
    }

    setUserInput(""); // Clear the input after handling
    addMessage(userInput, "user"); // Show user input in the conversation log
  };

  useEffect(() => {
    switch (currentStep) {
      case "ASK_NAME":
        addMessage("Please give your organization's name.");
        break;
      case "ASK_DESCRIPTION":
        addMessage("Please describe your organization.");
        break;
      case "ASK_MEMBERSHIP_DEFAULT":
        addMessage(
          "The default membership structure has two tiers: executives and members. Would you like to add more tiers?"
        );
        setOptions([
          { label: "Keep default", value: "default" },
          { label: "I'd like more customization", value: "customize" },
        ]);
        setShowSelection(true);
        break;
      case "ASK_MEMBERSHIP_CUSTOMIZE":
        // Open the modal for customization
        break;
      case "ASK_VOTING":
        addMessage("Please select a voting type.");
        // Setup voting options here
        break;
    }
  }, [currentStep]);
  const generateOptions = (optionsArray = [], message) => {
    console.log("showng selection");
    setShowSelection(true);
    const optionsWithActions = optionsArray.map((option) => ({
      ...option,
      action: () =>
        setOrgDetails((prevDetails) => ({
          ...prevDetails,
          [currentStep]: option.value, // Make sure this aligns with your state structure
        })),
    }));

    setOptions(optionsWithActions);
    if (message) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { speaker: "system", text: message },
      ]);
    }
  };

  const handleOptionSelected = (value) => {
    // Handle option selection based on the current step
    setShowSelection(false); // Hide selection options after choosing
    if (currentStep === "ASK_MEMBERSHIP_DEFAULT") {
      if (value === "default") {
        // Keep default setup and proceed to voting
        setCurrentStep("ASK_VOTING");
      } else if (value === "customize") {
        // Open modal for custom membership setup
        // Assume setIsMemberSpecificationModalOpen exists to control the modal
        setIsMemberSpecificationModalOpen(true);
      }
    }
    // Handle other selections as needed
  };

  const addMessage = (text, speaker = "system") => {
    setMessages((prevMessages) => [...prevMessages, { speaker, text }]);
  };
  return (
    <Layout isArchitectPage>
      <Box position="fixed" top="0" left="0" right="0" zIndex="sticky">
        <Character />
      </Box>

      <Box
        position="fixed"
        top="115px" // This should be the height of the Character component
        bottom="60px"
        overflowY="auto"
        width="full"
        pt="4"
        px="4"
      >
        <ConversationLog
          messages={messages}
          selectionHeight={selectionHeight}
        />
        <Modal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Your Selections</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Display the user's selections here */}
              <p>Name: {orgDetails.name}</p>
              <p>Description: {orgDetails.description}</p>
              <p>Membership Type: {orgDetails.membershipType}</p>
              <p>Voting Type: {orgDetails.votingType}</p>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleStartOver}>
                Start Over
              </Button>
              <Button variant="ghost" onClick={createOrgSite}>
                Yes, show me my site!
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <MemberSpecificationModal
          isOpen={isMemberSpecificationModalOpen}
          onSave={handleSaveMemberTier}
          onClose={() => setIsMemberSpecificationModalOpen(false)}
        />
      </Box>

      {showSelection && options.length > 0 && (
        <Box
          position="fixed"
          bottom="60px" // ArchitectInput component height
          left="0"
          right="0"
          p="4"
          display="flex"
          alignItems="centerx"
          justifyContent="center"
          bg="purple.50"
          borderTop="2px solid"
          borderColor="gray.200"
          zIndex="sticky"
        >
          <Selection
            ref={selectionRef}
            options={options}
            onOptionSelected={handleOptionSelected}
          />
        </Box>
      )}

      <Box
        position="fixed"
        bottom="0"
        width="full"
        p={4}
        paddingRight={10}
        zIndex="sticky"
      >
        {orgName && (
          <Button
            position="absolute"
            top="4"
            right="4"
            colorScheme="teal"
            onClick={() => router.push(`/${orgName}/home`)}
          >
            Access site
          </Button>
        )}
        <Box
          position="fixed"
          bottom="0"
          width="full"
          p={4}
          paddingRight={10}
          zIndex="sticky"
        >
          <ArchitectInput
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onSubmit={handleSendClick}
            //isDisabled={showSelection} // Pass showSelection as the isDisabled prop
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default ArchitectPage;
