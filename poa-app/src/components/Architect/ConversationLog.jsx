// components/ConversationLog.jsx
import React, { useEffect, useRef } from "react";
import { VStack } from "@chakra-ui/react";
import SpeechBubble from "./SpeechBubble";

const ConversationLog = ({ messages }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <VStack align="stretch" spacing={4} overflowY="auto">
      {messages.map((message, index) => (
        <SpeechBubble key={index} speaker={message.speaker}>
          {message.text}
        </SpeechBubble>
      ))}
      <div ref={endOfMessagesRef} /> {/* Invisible element at the end of messages */}
    </VStack>
  );
};

export default ConversationLog;
