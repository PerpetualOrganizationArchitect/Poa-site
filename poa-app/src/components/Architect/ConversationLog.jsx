// components/ConversationLog.jsx
import React, { useEffect, useRef } from "react";
import { VStack } from "@chakra-ui/react";
import SpeechBubble from "./SpeechBubble";

const ConversationLog = ({ messages, selectionHeight }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectionHeight]);

  return (
    <VStack
      align="stretch"
      spacing={4}
      overflowY="auto"
      pb={`${selectionHeight}px`}
    >
      {messages.map((message, index) => (
        <SpeechBubble key={index} speaker={message.speaker}>
          {message.text}
        </SpeechBubble>
      ))}
      <div ref={endOfMessagesRef} />
    </VStack>
  );
};

export default ConversationLog;
