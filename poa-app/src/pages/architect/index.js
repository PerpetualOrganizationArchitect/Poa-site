import React, { useState } from "react";
import Layout from "../../components/Layout";
import ArchitectInput from "@/components/Architect/ArchitectInput";
import { Box } from "@chakra-ui/react";
import ConversationLog from "@/components/Architect/ConversationLog";

const ArchitectPage = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSendClick = () => {
    if (!userInput.trim()) return;

    const newUserMessage = { speaker: "user", text: userInput };
    const newResponseMessage = {
      speaker: "system",
      text: "This is a hardcoded response.",
    };

    setMessages([...messages, newUserMessage, newResponseMessage]);
    setUserInput(""); // Reset input field
  };

  return (
    <Layout isArchitectPage>
      <ConversationLog messages={messages} />
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
