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
// Define the selectionHeight based on the visibility of the Selection component
const selectionHeight = showSelection ? '50%' : '0%'; // If Selection is shown, it takes 50% of the screen height

return (
  <Layout isArchitectPage>
      <Character />
    <Flex direction="column" h={`calc(100vh - ${selectionHeight})`}>
    
      <Box flex="1" overflowY="auto">
        <ConversationLog messages={messages} />
      </Box>
    </Flex>
    {showSelection && (
      <Box
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        height={selectionHeight} // This is already set to take 50% of the screen height when shown
        p="4"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.100"
        borderTop="2px solid"
        borderColor="gray.200"
      >
        <Selection />
      </Box>
    )}
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
