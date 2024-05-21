import React, { useEffect, useRef } from "react";
import { VStack } from "@chakra-ui/react";
import SpeechBubble from "./SpeechBubble";

const ConversationLog = ({ messages, selectionHeight }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <VStack
      ref={containerRef}
      align="stretch"
      spacing={4}
      overflowY="auto"
      pb={`${selectionHeight}px`}
      maxHeight="80vh" // Set a maxHeight to limit the scrollable area
    >
      {messages.map((message, index) => (
        <SpeechBubble key={index} speaker={message.speaker} containerRef={containerRef}>
          {message.text}
        </SpeechBubble>
      ))}
    </VStack>
  );
};

export default ConversationLog;