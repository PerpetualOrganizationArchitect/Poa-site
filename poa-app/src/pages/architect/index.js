import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import ArchitectInput from "@/components/Architect/ArchitectInput";
import { Box, Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import ConversationLog from "@/components/Architect/ConversationLog";
import Character from "@/components/Architect/Character";
import Selection from "@/components/Architect/Selection";

const ArchitectPage = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showSelection, setShowSelection] = useState(false);
  const [options, setOptions] = useState([]);
  const selectionRef = useRef(null);
  const [selectionHeight, setSelectionHeight] = useState(0);
  const [orgName, setOrgName] = useState(""); // State to hold the organization name
  const toast = useToast();
  const router = useRouter();

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

    // You would typically call an API to create the site on the server here
    // For the test function, we'll just navigate to a dynamic route
    router.push(`/[userDAO]/taskmanager`, `/${orgName}/taskmanager`);
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
    const greetingMessage1 = {
      speaker: "POA",
      text: "Hello! I'm Poa, your perpetual organization architect.",
    };

    const greetingMessage2 = {
      speaker: "POA",
      text: "Click the button below when you're ready to get started.",
    };
    setMessages([...messages, greetingMessage1, greetingMessage2]);

    setShowSelection(true);
  }, []);

  useEffect(() => {
    // Simulate the greeting message and show options
    generateOptions();
  }, []);

  const generateOptions = () => {
    // For the greeting, generate one option
    const greetingOptions = [
      {
        title: "I'm Ready!",
        action: () => {
          // Close the selection
          setShowSelection(false);
          // Add new system messages
          setMessages((prevMessages) => [
            ...prevMessages,
            { speaker: "system", text: "Let's start building!" },
            {
              speaker: "system",
              text: "What type of community are you looking to build?",
            },
          ]);
        },
      },
    ];
    setOptions(greetingOptions);
    setShowSelection(true);
  };

  const handleOptionSelected = (action) => {
    action(); // Perform the action associated with the option
  };

  const handleSendClick = () => {
    if (!userInput.trim()) return;

    if (userInput.toLowerCase().startsWith("org:")) {
      setOrgName(userInput.split(":")[1].trim());
      createOrgSite();
      setUserInput("");
    } else {
      // Handle other user input
      const newUserMessage = { speaker: "user", text: userInput };
      const newResponseMessage = {
        speaker: "system",
        text: "This is a hardcoded response.",
      };

      setMessages([...messages, newUserMessage, newResponseMessage]);
      setUserInput("");
    }
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
        <ConversationLog messages={messages} />
      </Box>

      {orgName && (
        <Button
          position="fixed"
          bottom="100px" // Adjust this value so it doesn't overlap with ArchitectInput
          width="full"
          p={4}
          colorScheme="teal"
          onClick={() => router.push(`/${orgName}/tasks`)}
        >
          Go to {orgName}'s Dashboard
        </Button>
      )}

      {showSelection && (
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
