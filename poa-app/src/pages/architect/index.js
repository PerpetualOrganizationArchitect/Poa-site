import React, { useState } from "react";
import Layout from "../../components/Layout";
import ArchitectInput from "@/components/Architect/ArchitectInput";
import { Box, useDisclosure } from "@chakra-ui/react";
import ConversationLog from "@/components/Architect/ConversationLog";
import Character from "@/components/Architect/Character";
import Tutorial from "@/components/Architect/Tutorial";

const ArchitectPage = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true }); // Controls the tutorial modal

  // Open the tutorial by default when the component mounts
  // useState with function initializer is used to only run the function once on initial render
  useState(() => {
    onOpen();
  }, [onOpen]);

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
      {/* Tutorial component is conditionally rendered */}
      {isOpen && <Tutorial onClose={onClose} />}

      <Box position="relative" zIndex="2">
        <Character position={characterPosition} />
      </Box>

      <Box position="relative" zIndex="1">
        <ConversationLog messages={messages} />
      </Box>

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
