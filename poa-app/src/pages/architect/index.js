import React, { useState } from "react";
import Layout from "../../components/Layout";
import ArchitectInput from "@/components/Architect/ArchitectInput";
import { Box } from "@chakra-ui/react";
import ConversationLog from "@/components/Architect/ConversationLog";
import Character from "@/components/Architect/Character";

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
    setUserInput("");
  };

  const characterPosition = messages.length % 2 === 0 ? "left" : "right";

  return (
    <Layout isArchitectPage>
      <Character position={characterPosition} />
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
