import React, { useState, useEffect } from 'react';
import Layout from "../../components/Layout";
import ArchitectInput from "@/components/Architect/ArchitectInput";
import { Box, Flex } from "@chakra-ui/react";
import ConversationLog from "@/components/Architect/ConversationLog";
import Character from "@/components/Architect/Character";
import Selection from "@/components/Architect/Selection";

const ArchitectPage = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showSelection, setShowSelection] = useState(false);

  useEffect(() => {
    // Simulating a greeting message from "POA" on initial load
    const greetingMessage = { speaker: 'POA', text: "Hello!, I'm POA." };
    setMessages([greetingMessage]);

    // After showing the greeting, we display the Selection component
    setShowSelection(true);
  }, []);


  const handleSendClick = () => {
    if (!userInput.trim()) return;

    const newUserMessage = { speaker: "user", text: userInput };
    const newResponseMessage = {
      speaker: "system",
      text: "This is a hardcoded response.",
    };

    setMessages([...messages, newUserMessage, newResponseMessage]);
    setUserInput("");
  };

  const characterPosition = messages.length % 2 === 0 ? "left" : "right";

  return (
    <Layout isArchitectPage>
      <Character position={characterPosition} />
      <Flex direction="column" h="100vh">
        <Box flex="1" overflowY="auto">
          <ConversationLog messages={messages} />
        </Box>
        {showSelection && (
          <Flex
            position="fixed"
            bottom="0"
            left="0"
            right="0"
            height="50%" // Taking up half of the screen vertically
            alignItems="center" // Center vertically in the Flex container
            justifyContent="center" // Center horizontally in the Flex container
            bg="gray.100" // Example background color for visibility
            borderTop="2px" // Example styling
            borderColor="gray.200" // Example styling
          >
            <Box p="4" boxShadow="md" bg="white" borderRadius="lg">
              <Selection />
            </Box>
          </Flex>
    )}
      </Flex>
      <Box position="fixed" bottom="0" width="full" p={4} paddingRight={10}>
      

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
