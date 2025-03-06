import React, { useEffect, useRef } from "react";
import { VStack, Box } from "@chakra-ui/react";
import SpeechBubble from "./SpeechBubble";

const ConversationLog = ({ messages, selectionHeight }) => {
  const containerRef = useRef(null);
  const isInitialRenderRef = useRef(true);

  // Handle auto-scrolling when messages change
  useEffect(() => {
    if (containerRef.current) {
      // Scroll immediately on initial render
      if (isInitialRenderRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
        isInitialRenderRef.current = false;
      } else {
        // For subsequent updates, use a short timeout to ensure content is rendered
        setTimeout(() => {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }, 10);
      }
    }
  }, [messages]);

  return (
    <Box
      position="relative"
      width="100%"
      height="100%"
      overflow="hidden"
    >
      <VStack
        ref={containerRef}
        align="stretch"
        spacing={4}
        overflowY="auto"
        pb={`${selectionHeight + 40}px`}
        maxHeight="80vh" 
        className="scroll-container"
        width="100%"
        pr="0"
        mr="0"
        sx={{
          '&::-webkit-scrollbar': {
            width: '8px',
            position: 'absolute',
            right: '0',
          },
          '&::-webkit-scrollbar-track': {
            width: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '24px',
          },
          paddingRight: '0',
          marginRight: '0',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)',
        }}
      >
        {messages.map((message, index) => (
          <SpeechBubble
            key={message.id || index}
            speaker={message.speaker}
            containerRef={containerRef}
            isTyping={message.isTyping} 
            isLastMessage={index === messages.length - 1}
            isPreTyped={message.isPreTyped}
            id={message.id}
          >
            {message.text}
          </SpeechBubble>
        ))}
        <Box height="20px" width="100%" />
      </VStack>
    </Box>
  );
};

export default ConversationLog;
