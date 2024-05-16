// components/SpeechBubble.jsx
import React from "react";
import { Box, Text } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SpeechBubble = ({ speaker, children }) => {
  console.log(children);
  const isUser = speaker === "User";
  return (
    <Box
      bg={isUser ? "purple.400" : "purple.600"}
      color="white"
      p={3}
      borderRadius="lg"
      alignSelf={isUser ? "flex-end" : "flex-start"}
      maxWidth="60%"
      marginLeft={6}
      marginRight={6}
      marginTop={2}
      marginBottom={2}
    >
      <Text mb="2" fontWeight="bold">{speaker}</Text>
      <Box p="2" ml="4">
      <ReactMarkdown remarkPlugins={[remarkGfm]} >{children}</ReactMarkdown>
      </Box>
    </Box>
  );
};

export default SpeechBubble;
