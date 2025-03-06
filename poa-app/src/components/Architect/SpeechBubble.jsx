import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import { Box, Text, Heading, Link, ListItem, OrderedList, UnorderedList, Code, Divider, Spinner, VStack } from "@chakra-ui/react";

// Utility to help with debugging
const debugLog = (message, condition = true) => {
  if (process.env.NODE_ENV !== 'production' && condition) {
    console.log(`[SpeechBubble Debug] ${message}`);
  }
};

const ChakraUIRenderer = {
  h1: ({ children }) => (
    <Heading as="h1" size={["md", "lg", "xl"]} my={2}>
      {children}
    </Heading>
  ),
  h2: ({ children }) => (
    <Heading as="h2" size={["sm", "md", "lg"]} my={2}>
      {children}
    </Heading>
  ),
  h3: ({ children }) => (
    <Heading as="h3" size={["xs", "sm", "md"]} my={2}>
      {children}
    </Heading>
  ),
  h4: ({ children }) => (
    <Heading as="h4" size={["xs", "xs", "sm"]} my={2} fontWeight="bold">
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
    <Text my={1} fontSize={["sm", "sm", "md"]} lineHeight={1.5} letterSpacing="0.01em">
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

// Simple Typing Animation Component
const TypingAnimation = ({ text, isPreTyped, onComplete, containerRef, isLastMessage }) => {
  const [displayedText, setDisplayedText] = useState(isPreTyped ? text : '');
  const timeoutRef = useRef(null);
  const textRef = useRef(text);
  const typingRef = useRef(false);
  const idRef = useRef(`typing-${Math.random().toString(36).substring(2, 9)}`);
  const isInitialMount = useRef(true);
  
  // Debug on mount and updates
  useEffect(() => {
    debugLog(`[${idRef.current}] Mounting TypingAnimation: text=${text?.substring(0, 15)}..., isPreTyped=${isPreTyped}`);
    
    // Force start typing immediately on initial mount
    if (isInitialMount.current && text && text.length > 0 && !isPreTyped) {
      isInitialMount.current = false;
      setDisplayedText('');
      typingRef.current = false; // Reset typing flag to allow starting
      
      // Start typing immediately
      setTimeout(() => {
        startTyping();
      }, 0);
    }
    
    return () => {
      debugLog(`[${idRef.current}] Unmounting TypingAnimation`);
    };
  }, []);
  
  // Function to start typing - separated to allow immediate invocation
  const startTyping = () => {
    if (typingRef.current || !text || displayedText === text) return;
    
    debugLog(`[${idRef.current}] Starting typing animation for: ${text.substring(0, 15)}...`);
    typingRef.current = true;
    let index = displayedText.length;
    const speed = 8; // slightly faster typing
    
    const type = () => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
        timeoutRef.current = setTimeout(type, speed);
      } else {
        debugLog(`[${idRef.current}] Typing complete`);
        typingRef.current = false;
        if (onComplete) onComplete();
      }
    };
    
    // Start typing without delay
    type();
  };
  
  useEffect(() => {
    // If pre-typed, show full text immediately
    if (isPreTyped) {
      debugLog(`[${idRef.current}] Pre-typed message, showing immediately`);
      setDisplayedText(text);
      if (onComplete) onComplete();
      return;
    }
    
    // Skip empty text
    if (!text || text.length === 0) {
      debugLog(`[${idRef.current}] Empty text, nothing to type`);
      return;
    }
    
    // Early return if we already have the complete text displayed
    if (displayedText === text) {
      debugLog(`[${idRef.current}] Text already complete: ${text.substring(0, 15)}...`);
      if (onComplete && !typingRef.current) onComplete();
      return;
    }
    
    // If text has changed, reset
    if (text !== textRef.current) {
      debugLog(`[${idRef.current}] Text changed, resetting`);
      textRef.current = text;
      setDisplayedText('');
    }
    
    // Don't start a new typing animation if one is already in progress
    if (typingRef.current) {
      debugLog(`[${idRef.current}] Typing already in progress`);
      return;
    }
    
    // Start typing immediately
    startTyping();
    
    // Scroll to bottom as we type
    const scrollToBottom = () => {
      if (containerRef?.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight + 100;
      }
    };
    
    // Initial scroll
    scrollToBottom();
    
    // Set up scroll interval during typing
    const scrollInterval = setInterval(scrollToBottom, 100);
    
    // Cleanup
    return () => {
      if (timeoutRef.current) {
        debugLog(`[${idRef.current}] Cleaning up typing animation`);
        clearTimeout(timeoutRef.current);
      }
      clearInterval(scrollInterval);
    };
  }, [text, isPreTyped, onComplete, containerRef, displayedText]);
  
  return (
    <Box className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkRehype]}
        components={ChakraUIRenderer}
      >
        {displayedText}
      </ReactMarkdown>
    </Box>
  );
};

// A simplified typing animation as backup
const SimpleTypingAnimation = ({ text, isPreTyped }) => {
  const [displayedText, setDisplayedText] = useState(isPreTyped ? text : '');
  const mountedRef = useRef(false);
  
  useEffect(() => {
    // Mark component as mounted
    mountedRef.current = true;
    
    if (isPreTyped) {
      setDisplayedText(text);
      return;
    }
    
    // Start right away
    setDisplayedText('');
    let i = 0;
    
    // Faster typing speed (10ms)
    const timer = setInterval(() => {
      if (!mountedRef.current) return; // Prevent state updates if unmounted
      
      if (i <= text.length) {
        setDisplayedText(text.substring(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 10);
    
    return () => {
      mountedRef.current = false;
      clearInterval(timer);
    };
  }, [text, isPreTyped]);
  
  return (
    <Text fontSize="md" whiteSpace="pre-wrap" lineHeight={1.5}>
      {displayedText}
    </Text>
  );
};

// Memoized version of the typing animation to prevent unnecessary re-renders
const MemoizedTypingAnimation = React.memo(
  TypingAnimation,
  (prevProps, nextProps) => {
    // Only re-render if text or isPreTyped changes
    return prevProps.text === nextProps.text && 
           prevProps.isPreTyped === nextProps.isPreTyped;
  }
);

const SpeechBubble = ({ speaker, children, containerRef, isTyping, isLastMessage, isPreTyped, id }) => {
  const isUser = speaker === "User";
  const [isTypingComplete, setIsTypingComplete] = useState(isPreTyped);
  const messageIdRef = useRef(id || `message-${Math.random().toString(36).substring(2, 11)}`);
  const [useSimpleAnimation, setUseSimpleAnimation] = useState(false);
  const mountTimeRef = useRef(Date.now());
  
  // Handle completion of typing
  const handleTypingComplete = () => {
    setIsTypingComplete(true);
  };
  
  // Start with simple animation if this is a new page load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if this is likely a fresh page load (within 2 seconds of navigation)
      const pageLoadTime = window.performance?.timing?.navigationStart || 0;
      const now = Date.now();
      const isRecentPageLoad = (now - pageLoadTime < 2000) || (now - mountTimeRef.current < 300);
      
      if (!isUser && !isTyping && !isPreTyped && children && isRecentPageLoad) {
        debugLog(`Message ${messageIdRef.current}: Using simple animation due to page load`);
        setUseSimpleAnimation(true);
      }
    }
  }, []);
  
  // If complex animation hasn't made progress after 500ms, switch to simple
  useEffect(() => {
    if (!isUser && !isTyping && !isPreTyped && children && children.length > 0) {
      const timer = setTimeout(() => {
        if (!isTypingComplete) {
          debugLog(`Message ${messageIdRef.current}: Falling back to simple animation`);
          setUseSimpleAnimation(true);
        }
      }, 500); // Reduced from 1000ms to 500ms
      
      return () => clearTimeout(timer);
    }
  }, [isUser, isTyping, isPreTyped, children, isTypingComplete]);

  return (
    <Box
      bg={isUser ? "purple.400" : "purple.600"}
      color="white"
      pt={3}
      pb={3}
      pl={4}
      pr={4}
      borderRadius="lg"
      alignSelf={isUser ? "flex-end" : "flex-start"}
      maxWidth="100%"
      marginY={2}
      boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
      className="speech-bubble"
      id={messageIdRef.current}
    >
      <Text mb={2} fontSize="md" fontWeight="bold">
        {speaker}
      </Text>
      <Box p="0">
        {isTyping ? (
          <VStack align="center" spacing={2} py={2}>
            <Spinner size="sm" />
            <Text fontSize="sm">Consulting Poa...</Text>
          </VStack>
        ) : isUser ? (
          <Text fontSize="md" whiteSpace="pre-wrap" lineHeight={1.5}>
            {children}
          </Text>
        ) : useSimpleAnimation ? (
          <SimpleTypingAnimation 
            text={children || ""} 
            isPreTyped={isPreTyped} 
          />
        ) : (
          <MemoizedTypingAnimation
            text={children || ""}
            isPreTyped={isPreTyped}
            onComplete={handleTypingComplete}
            containerRef={containerRef}
            isLastMessage={isLastMessage}
            key={`typing-${messageIdRef.current}`}
          />
        )}
      </Box>
    </Box>
  );
};

export default SpeechBubble;
