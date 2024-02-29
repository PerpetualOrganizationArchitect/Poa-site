import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import ArchitectInput from "@/components/Architect/ArchitectInput";
import { Box, Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import ConversationLog from "@/components/Architect/ConversationLog";
import Character from "@/components/Architect/Character";
import Selection from "@/components/Architect/Selection";

const steps = {
  ASK_NAME: "ASK_NAME",
  ASK_DESCRIPTION: "ASK_DESCRIPTION",
  ASK_MEMBERSHIP: "ASK_MEMBERSHIP",
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

const ArchitectPage = () => {
  // State hooks for managing user input and app state.
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showSelection, setShowSelection] = useState(false);
  const [options, setOptions] = useState([]);
  const [orgName, setOrgName] = useState(""); // Holds the organization name input by the user.
  const [currentStep, setCurrentStep] = useState(steps.ASK_NAME);
  const [orgDetails, setOrgDetails] = useState({
    name: "",
    description: "",
    membershipType: "",
    // ... add other details as needed
  });
  // Refs and hooks for UI effects and navigation.
  const selectionRef = useRef(null);
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
    router.push(`/[userDAO]/home`, `/${orgName}/home`);
  };

  const nextStep = () => {
    switch (currentStep) {
      case steps.ASK_NAME:
        setCurrentStep(steps.ASK_DESCRIPTION);
        break;
      case steps.ASK_DESCRIPTION:
        setCurrentStep(steps.ASK_MEMBERSHIP);
        break;
      // ... handle other transitions
    }
  };

  useEffect(() => {
    // Update the selectionHeight state if the selectionRef is set and the component is visible
    if (showSelection && selectionRef.current) {
      const height = selectionRef.current.offsetHeight; // Get the height of the Selection component
      setSelectionHeight(height); // Set the height state
    }
  }, [showSelection, options]);

  useEffect(() => {
    // Simulating a greeting message from "POA" on initial load
    const greetingMessage = {
      speaker: "POA",
      text: "Hello! I'm Poa, your perpetual organization architect.",
    };

    setMessages([...messages, greetingMessage]);

    setShowSelection(true);
  }, []);

  useEffect(() => {
    // Simulate the greeting message and show options
    generateOptions();
  }, []);

  const generateOptions = (optionsArray, message) => {
    // Ensure that the optionsArray is an array before setting it to state.
    // If optionsArray is possibly undefined, default to an empty array.
    setOptions(optionsArray || []);

    // Add a message from the system to the conversation log.
    setMessages((prevMessages) => [
      ...prevMessages,
      { speaker: "system", text: message },
    ]);

    // Show the selection component.
    setShowSelection(true);
  };

  const handleOptionSelected = (action) => {
    action(); // Perform the action associated with the option
  };

  const handleSendClick = () => {
    if (!userInput.trim()) return;

    switch (currentStep) {
      case steps.ASK_NAME:
        setOrgDetails({ ...orgDetails, name: userInput });
        nextStep();
        break;
      case steps.ASK_DESCRIPTION:
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
      case steps.ASK_MEMBERSHIP:
        message = "Please select a membership type.";
        generateOptions(membershipOptions, message);
        return; // Prevent adding another system message after options are shown
      // ... add messages for other steps
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      { speaker: "system", text: message },
    ]);
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
        <ConversationLog messages={messages} />
      </Box>

      {orgName && (
        <Button
          position="fixed"
          bottom="100px" // Adjust this value so it doesn't overlap with ArchitectInput
          width="full"
          p={4}
          colorScheme="teal"
          onClick={() => router.push(`/${orgName}/home`)}
        >
          Go to {orgName}'s Dashboard
        </Button>
      )}

      {showSelection && options.length > 0 && (
        <Box
          position="fixed"
          bottom="60px" // ArchitectInput component height
          left="0"
          right="0"
          p="4"
          display="flex"
          alignItems="center"
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
        <ArchitectInput
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onSubmit={handleSendClick}
        />
      </Box>
    </Layout>
  );
};

export default ArchitectPage;
