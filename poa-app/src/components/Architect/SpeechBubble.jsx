import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import { Box, Text, Heading, Link, ListItem, OrderedList, UnorderedList, Code, Divider, Spinner, VStack } from "@chakra-ui/react";

const ChakraUIRenderer = {
  h1: ({ children }) => (
    <Heading as="h1" size={["lg", "xl", "2xl"]} my={4}>
      {children}
    </Heading>
  ),
  h2: ({ children }) => (
    <Heading as="h2" size={["md", "lg", "xl"]} my={4}>
      {children}
    </Heading>
  ),
  h3: ({ children }) => (
    <Heading as="h3" size={["sm", "md", "lg"]} my={4}>
      {children}
    </Heading>
  ),
  h4: ({ children }) => (
    <Heading as="h4" size={["xs", "sm", "md"]} my={4}>
      {children}
    </Heading>
  ),
  h5: ({ children }) => (
    <Heading as="h5" size={["xs", "sm"]} my={4}>
      {children}
    </Heading>
  ),
  h6: ({ children }) => (
    <Heading as="h6" size="xs" my={4}>
      {children}
    </Heading>
  ),
  p: ({ children }) => (
    <Text my={2} fontSize={["sm", "md", "lg"]}>
      {children}
    </Text>
  ),
  a: ({ href, children }) => (
    <Link href={href} color="teal.500" fontSize={["sm", "md", "lg"]}>
      {children}
    </Link>
  ),
  li: ({ children }) => (
    <ListItem my={1} fontSize={["sm", "md", "lg"]}>
      {children}
    </ListItem>
  ),
  ol: ({ children }) => (
    <OrderedList my={2} styleType="decimal" fontSize={["sm", "md", "lg"]}>
      {children}
    </OrderedList>
  ),
  ul: ({ children }) => (
    <UnorderedList my={2} styleType="disc" fontSize={["sm", "md", "lg"]}>
      {children}
    </UnorderedList>
  ),
  code: ({ inline, children }) => {
    return inline ? (
      <Code px={2} py={1} rounded="md" fontSize={["sm", "md"]}>
        {children}
      </Code>
    ) : (
      <Code
        display="block"
        whiteSpace="pre"
        p={4}
        my={2}
        rounded="md"
        fontSize={["sm", "md"]}
      >
        {children}
      </Code>
    );
  },
  hr: () => <Divider my={4} />,
  blockquote: ({ children }) => (
    <Box pl={4} borderLeft="4px" borderColor="gray.200" my={4}>
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

const SpeechBubble = ({ speaker, children, containerRef, isTyping}) => {
  const isUser = speaker === "User";

  return (
    <Box
      bg={isUser ? "purple.400" : "purple.600"}
      color="white"
      pt={2}
      pl={6}
      pr={6}
      borderRadius="lg"
      alignSelf={isUser ? "flex-end" : "flex-start"}
      maxWidth={["87%", "80%", "73%", "67%"]}
      marginLeft={["2%", "5%", "9.5%", "13%"]}
      marginRight={["2%", "5%", "9.5%", "13%"]}
      marginTop={0}
      marginBottom={2}
    >
      <Text mb="1" fontSize={["lg","2xl"]} fontWeight="bold">{speaker}</Text>
      <Box p="0">
        {isTyping ? (
          <VStack>
            <Spinner />
            <Text mb="2">Consulting Poa...</Text>
          </VStack>
        ) : (
          <TypingMarkdown text={children} containerRef={containerRef} />
        )}
      </Box>
    </Box>
  );
};

export default SpeechBubble;
