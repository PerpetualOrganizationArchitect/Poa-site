import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import ArchitectInput from "@/components/Architect/ArchitectInput";
import SpecificInput from "@/components/Architect/SpecificInput";

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
  Text,
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
  // ... add other steps as needed
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
      setCurrentStep(steps.ASK_MEMBERSHIP_CUSTOMIZE);
      setShowSelection(false);
      console.log("hiding selection");
    },
  },
];

const ArchitectPage = () => {
  // State hooks for managing user input and app state.
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showSelection, setShowSelection] = useState(false);
  const [options, setOptions] = useState([]);
  const [orgName, setOrgName] = useState(""); // Holds the organization name input by the user.
  const [currentStep, setCurrentStep] = useState(steps.ASK_NAME);
  const [siteCreated, setSiteCreated] = useState(false);
  const [orgDetails, setOrgDetails] = useState({
    name: "",
    description: "",
    membershipType: "",
    votingType: "",
    membershipTypeNames: ["member", "executive"], // Default membership types
  });

  // Refs and hooks for UI effects and navigation.
  const selectionRef = useRef(null);
  const [showSpecificInput, setShowSpecificInput] = useState(false);
  const [selectionHeight, setSelectionHeight] = useState(0); // State for managing the dynamic height of the selection component.
  const toast = useToast(); // Toast is used for showing alerts and messages to the user.
  const router = useRouter(); // useRouter hook from Next.js for handling client-side navigation.

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
      case steps.ASK_MEMBERSHIP_DEFAULT:
        setCurrentStep(steps.ASK_MEMBERSHIP_CUSTOMIZE);
        break;
      case steps.ASK_MEMBERSHIP_CUSTOMIZE:
        setCurrentStep(steps.ASK_VOTING);

        break;
      case steps.ASK_VOTING:
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

  const startOver = () => {
    // Reset all state to initial values
    setUserInput("");
    setMessages([]);
    setShowSelection(false);
    console.log("hiding selection");
    setOptions([]);
    setOrgName("");
    setOrgDetails({
      name: "",
      description: "",
      membershipType: "",
      votingType: "",
      // ... reset other details as needed
    });
    setCurrentStep(steps.ASK_NAME);
    onClose(); // Close the confirmation modal
  };

  useEffect(() => {
    // Update the selectionHeight state if the selectionRef is set and the component is visible
    if (showSelection && selectionRef.current) {
      const height = selectionRef.current.offsetHeight; // Get the height of the Selection component
      setSelectionHeight(height); // Set the height state
    }
  }, [showSelection, options]);
  useEffect(() => {
    setShowSelection(false);
  }, []);

  useEffect(() => {
    // Simulating a greeting message from "POA" on initial load
    const greetingMessage = {
      speaker: "POA",
      text: "Hello! I'm Poa, your perpetual organization architect.",
    };

    setMessages([...messages, greetingMessage]);
  }, []);

  useEffect(() => {
    // Simulate the greeting message and show options
    generateOptions();
  }, []);

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

  const handleOptionSelected = (selectedOptionValue) => {
    console.log("hiding selection");
    setShowSelection(false);
    // Find the option by value and call its action
    const selectedOption = options.find(
      (option) => option.value === selectedOptionValue
    );
    if (selectedOption && selectedOption.action) {
      selectedOption.action();
      console.log("Current step: ", currentStep);
      if (currentStep !== steps.ASK_MEMBERSHIP_DEFAULT) {
        // This check ensures we only auto-advance for steps that don't have special logic
        console.log("here");
        nextStep();
      }
    } else {
      // If no specific action, just move to the next step
      nextStep();
    }
    if (currentStep === steps.ASK_MEMBERSHIP_CUSTOMIZE) {
      setShowSpecificInput(true);
      return;
    }
    if (currentStep === steps.ASK_VOTING) {
      setIsConfirmationModalOpen(true);
    }

    // setShowSelection(false);
    // console.log("hiding selection");
    // nextStep(); // Move to the next step after the selection
  };

  const handleStartOver = () => {
    setOrgDetails({
      name: "",
      description: "",
      membershipType: "",
      votingType: "",
    });
    setIsConfirmationModalOpen(false);
    setCurrentStep(steps.ASK_NAME);
  };

  const handleSpecificInputSubmit = (inputValue) => {
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      membershipTypeNames: [...prevDetails.membershipTypeNames, inputValue],
    }));
    setShowSpecificInput(false); // Hide SpecificInput after submission
    nextStep(); // Proceed to the next step
  };

  const handleSendClick = () => {
    if (!userInput.trim()) return;

    switch (currentStep) {
      case steps.ASK_NAME:
        setOrgName(userInput.trim());
        setSiteCreated(true);
        setOrgDetails({ ...orgDetails, name: userInput });
        nextStep();
        break;
      case steps.ASK_DESCRIPTION:
        setOrgDetails({ ...orgDetails, description: userInput });
        nextStep();
        break;
      case steps.ASK_MEMBERSHIP_DEFAULT:
        setOrgDetails({ ...orgDetails, description: userInput });
        nextStep();
        break;
      case steps.ASK_MEMBERSHIP_CUSTOMIZE:
        break;

      case steps.ASK_VOTING:
        setOrgDetails({ ...orgDetails, description: userInput });
        nextStep();
        break;
      // ... handle other cases
    }

    // Clear the input field and add the user's message to the conversation log
    setUserInput("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { speaker: "user", text: userInput },
    ]);
  };

  useEffect(() => {
    let message = "";
    switch (currentStep) {
      case steps.ASK_NAME:
        message = "Please give your organization's name.";
        break;
      case steps.ASK_DESCRIPTION:
        message = "Please describe your organization.";
        break;
      case steps.ASK_MEMBERSHIP_DEFAULT:
        message =
          "The default membership structure has two tiers: executives and members. Would you like to add more tiers?";
        generateOptions(defaultMembershipOptions, message);
        return;
      case steps.ASK_MEMBERSHIP_CUSTOMIZE:
        console.log("on customize step");
        console.log("hiding selection");
        setShowSelection(false);
        setShowSpecificInput(true);
        message =
          "Please enter the names of specific membership tiers you want to add.";

        return;
      case steps.ASK_VOTING:
        message = "Please select a voting type.";
        generateOptions(votingOptions, message);
        return;
    }

    if (message) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { speaker: "system", text: message },
      ]);
    }
  }, [currentStep]);

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
      </Box>
      {showSpecificInput && (
        <SpecificInput
          inputFields={[{ label: "New Tier Name:" }]} // This prop structure assumes SpecificInput expects an array
          onInputsChanged={handleSpecificInputSubmit} // Adjust according to how SpecificInput is designed to return data
          showAddTierButton={true}
        />
      )}

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
      {showSpecificInput && (
        <SpecificInput
          // Adjust props according to your SpecificInput's expected props
          onSubmit={handleSpecificInputSubmit}
        />
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
            isDisabled={showSelection} // Pass showSelection as the isDisabled prop
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default ArchitectPage;
