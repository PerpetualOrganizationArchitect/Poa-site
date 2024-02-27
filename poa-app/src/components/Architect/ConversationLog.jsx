// components/ConversationLog.jsx
import React from "react";
import { VStack } from "@chakra-ui/react";
import SpeechBubble from "./SpeechBubble";

const ConversationLog = ({ messages }) => {
  return (
    <VStack align="stretch" spacing={4} overflowY="auto">
      {messages.map((message, index) => (
        <SpeechBubble key={index} speaker={message.speaker}>
          {message.text}
        </SpeechBubble>
      ))}
    </VStack>
  );
};

export default ConversationLog;
