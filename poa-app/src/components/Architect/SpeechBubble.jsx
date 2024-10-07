import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import { Box, Text, Heading, Link, ListItem, OrderedList, UnorderedList, Code, Divider, Spinner, VStack } from "@chakra-ui/react";

const ChakraUIRenderer = {
  h1: ({ children }) => (
    <Heading as="h1" size={["md", "lg", "xl"]} my={3}>
      {children}
    </Heading>
  ),
  h2: ({ children }) => (
    <Heading as="h2" size={["sm", "md", "lg"]} my={3}>
      {children}
    </Heading>
  ),
  h3: ({ children }) => (
    <Heading as="h3" size={["xs", "sm", "md"]} my={2}>
      {children}
    </Heading>
  ),
  h4: ({ children }) => (
    <Heading as="h4" size={["xs", "xs", "sm"]} my={2}>
      {children}
    </Heading>
  ),
  h5: ({ children }) => (
    <Heading as="h5" size="xs" my={2}>
      {children}
    </Heading>
  ),
  h6: ({ children }) => (
    <Heading as="h6" size="xs" my={2}>
      {children}
    </Heading>
  ),
  p: ({ children }) => (
    <Text my={1} fontSize={["xs", "sm", "md"]}>
      {children}
    </Text>
  ),
  a: ({ href, children }) => (
    <Link href={href} color="teal.500" fontSize={["xs", "sm", "md"]}>
      {children}
    </Link>
  ),
  li: ({ children }) => (
    <ListItem my={1} fontSize={["xs", "sm", "md"]}>
      {children}
    </ListItem>
  ),
  ol: ({ children }) => (
    <OrderedList my={1} styleType="decimal" fontSize={["xs", "sm", "md"]}>
      {children}
    </OrderedList>
  ),
  ul: ({ children }) => (
    <UnorderedList my={1} styleType="disc" fontSize={["xs", "sm", "md"]}>
      {children}
    </UnorderedList>
  ),
  code: ({ inline, children }) => {
    return inline ? (
      <Code px={1} py={0.5} rounded="md" fontSize={["xs", "sm"]}>
        {children}
      </Code>
    ) : (
      <Code
        display="block"
        whiteSpace="pre"
        p={3}
        my={1}
        rounded="md"
        fontSize={["xs", "sm"]}
      >
        {children}
      </Code>
    );
  },
  hr: () => <Divider my={3} />,
  blockquote: ({ children }) => (
    <Box pl={3} borderLeft="3px" borderColor="gray.200" my={3}>
      {children}
    </Box>
  ),
};



const TypingMarkdown = ({ text, containerRef, onCompleted }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let currentText = "";
    let index = 0;
    const typingSpeed = 6.9; 

    const typeText = () => {
      if (index < text.length) {
        currentText += text[index];
        setDisplayText(currentText);
        index++;
        setTimeout(typeText, typingSpeed);
      }
    };

    typeText();
  }, [text]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayText, containerRef]);

  return (
    <Box>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkRehype]}
        components={ChakraUIRenderer}
      >
        {displayText}
      </ReactMarkdown>
    </Box>
  );
};

// In SpeechBubble component
const SpeechBubble = ({ speaker, children, containerRef, isTyping }) => {
  const isUser = speaker === "User";

  return (
    <Box
      bg={isUser ? "purple.400" : "purple.600"}
      color="white"
      pt={2}
      pl={4}
      pr={4}
      borderRadius="lg"
      alignSelf={isUser ? "flex-end" : "flex-start"}
      maxWidth="100%"
      marginY={2}
    >
      <Text mb="1" fontSize="md" fontWeight="bold">
        {speaker}
      </Text>
      <Box p="0">
        {isTyping ? (
          <VStack>
            <Spinner />
            <Text mb="2">Consulting Poa...</Text>
          </VStack>
        ) : (
          <TypingMarkdown
            text={children}
            containerRef={containerRef}
            textSize="sm" // Adjusted text size
          />
        )}
      </Box>
    </Box>
  );
};


export default SpeechBubble;
