import React from "react";
import { Box, Text, Heading, Link, ListItem, OrderedList, UnorderedList, Code, Divider } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

const ChakraUIRenderer = {
  h1: ({ children }) => <Heading as="h1" size="2xl" my={4}>{children}</Heading>,
  h2: ({ children }) => <Heading as="h2" size="xl" my={4}>{children}</Heading>,
  h3: ({ children }) => <Heading as="h3" size="lg" my={4}>{children}</Heading>,
  h4: ({ children }) => <Heading as="h4" size="md" my={4}>{children}</Heading>,
  h5: ({ children }) => <Heading as="h5" size="sm" my={4}>{children}</Heading>,
  h6: ({ children }) => <Heading as="h6" size="xs" my={4}>{children}</Heading>,
  p: ({ children }) => <Text my={2}>{children}</Text>,
  a: ({ href, children }) => <Link href={href} color="teal.500">{children}</Link>,
  li: ({ children }) => <ListItem my={1}>{children}</ListItem>,
  ol: ({ children }) => <OrderedList my={2} styleType="decimal">{children}</OrderedList>,
  ul: ({ children }) => <UnorderedList my={2} styleType="disc">{children}</UnorderedList>,
  code: ({ inline, children }) => {
    return inline ? (
      <Code px={2} py={1} rounded="md">{children}</Code>
    ) : (
      <Code display="block" whiteSpace="pre" p={4} my={2} rounded="md">{children}</Code>
    );
  },
  hr: () => <Divider my={4} />,
  blockquote: ({ children }) => (
    <Box pl={4} borderLeft="4px" borderColor="gray.200" my={4}>
      {children}
    </Box>
  ),
};

const SpeechBubble = ({ speaker, children }) => {
  const isUser = speaker === "User";

  console.log("speaker:", speaker);
  console.log("children:", children);
  console.log("children type:", typeof children);

  return (
    <Box
      bg={isUser ? "purple.400" : "purple.600"}
      color="white"
      p={3}
      borderRadius="lg"
      alignSelf={isUser ? "flex-end" : "flex-start"}
      maxWidth="60%"
      marginLeft={4}
      marginRight={4}
      marginTop={2}
      marginBottom={2}
    >
      <Text mb="2" fontWeight="bold">{speaker}</Text>
      <Box p="0" ml="2">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkRehype]}
          components={ChakraUIRenderer}
        >
          {children}
        </ReactMarkdown>
      </Box>
    </Box>
  );
};

export default SpeechBubble;
