import React, { useState } from 'react';
import { 
  Box, 
  VStack, 
  Text, 
  Divider, 
  Link as ChakraLink,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  Flex
} from '@chakra-ui/react';
import { FaBook, FaVoteYea, FaInfoCircle } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Link from 'next/link';

const SideBar = () => {
  const router = useRouter();
  const currentPath = router.asPath;
  
  const bgColor = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.700', 'blue.200');
  
  return (
    <Box 
      mt="20px" 
      position="sticky" 
      top="100px" 
      maxH="calc(100vh - 120px)" 
      overflowY="auto"
      p={4}
      borderRadius="xl"
      bg="rgba(0, 0, 0, 0.8)"
      backdropFilter="blur(10px)"
      borderWidth="1px"
      borderColor="rgba(255, 255, 255, 0.1)"
      width="250px"
      ml={4}
      color="white"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '24px',
        },
      }}
    >
      <VStack mt="1" align="flex-start" gap="4" width="100%">
        <Accordion defaultIndex={[0, 1]} allowMultiple width="100%">
          <AccordionItem border="none">
            <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
              <Flex align="center" flex="1">
                <Icon as={FaBook} mr={2} color="green.300" />
                <Text fontWeight="700" fontSize="18px">Get Started</Text>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} pl={6}>
              <VStack align="flex-start" width="100%" spacing={3}>
                <Link href={`/docs/perpetualOrganization`} passHref>
                  <ChakraLink 
                    as="span" 
                    display="block" 
                    width="100%" 
                    p={2} 
                    borderRadius="md"
                    bg={currentPath === '/docs/perpetualOrganization' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
                    color={currentPath === '/docs/perpetualOrganization' ? 'white' : 'gray.300'}
                    fontWeight={currentPath === '/docs/perpetualOrganization' ? '600' : '500'}
                    _hover={{ 
                      bg: 'rgba(255, 255, 255, 0.15)',
                      color: 'white'
                    }}
                  >
                    What is a Perpetual Organization
                  </ChakraLink>
                </Link>
                
                <Link href={`/docs/create`} passHref>
                  <ChakraLink 
                    as="span" 
                    display="block" 
                    width="100%" 
                    p={2} 
                    borderRadius="md"
                    bg={currentPath === '/docs/create' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
                    color={currentPath === '/docs/create' ? 'white' : 'gray.300'}
                    fontWeight={currentPath === '/docs/create' ? '600' : '500'}
                    _hover={{ 
                      bg: 'rgba(255, 255, 255, 0.15)',
                      color: 'white'
                    }}
                  >
                    Creating a PO
                  </ChakraLink>
                </Link>
                
                <Link href={`/docs/join`} passHref>
                  <ChakraLink 
                    as="span" 
                    display="block" 
                    width="100%" 
                    p={2} 
                    borderRadius="md"
                    bg={currentPath === '/docs/join' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
                    color={currentPath === '/docs/join' ? 'white' : 'gray.300'}
                    fontWeight={currentPath === '/docs/join' ? '600' : '500'}
                    _hover={{ 
                      bg: 'rgba(255, 255, 255, 0.15)',
                      color: 'white'
                    }}
                  >
                    Joining a PO
                  </ChakraLink>
                </Link>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem border="none" mt={2}>
            <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
              <Flex align="center" flex="1">
                <Icon as={FaVoteYea} mr={2} color="purple.300" />
                <Text fontWeight="700" fontSize="18px">Voting</Text>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} pl={6}>
              <VStack align="flex-start" width="100%" spacing={3}>
                <Link href={`/docs/hybridVoting`} passHref>
                  <ChakraLink 
                    as="span" 
                    display="block" 
                    width="100%" 
                    p={2} 
                    borderRadius="md"
                    bg={currentPath === '/docs/hybridVoting' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
                    color={currentPath === '/docs/hybridVoting' ? 'white' : 'gray.300'}
                    fontWeight={currentPath === '/docs/hybridVoting' ? '600' : '500'}
                    _hover={{ 
                      bg: 'rgba(255, 255, 255, 0.15)',
                      color: 'white'
                    }}
                  >
                    Hybrid Voting
                  </ChakraLink>
                </Link>
                
                <Link href={`/docs/contributionVoting`} passHref>
                  <ChakraLink 
                    as="span" 
                    display="block" 
                    width="100%" 
                    p={2} 
                    borderRadius="md"
                    bg={currentPath === '/docs/contributionVoting' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
                    color={currentPath === '/docs/contributionVoting' ? 'white' : 'gray.300'}
                    fontWeight={currentPath === '/docs/contributionVoting' ? '600' : '500'}
                    _hover={{ 
                      bg: 'rgba(255, 255, 255, 0.15)',
                      color: 'white'
                    }}
                  >
                    Contribution Based Voting
                  </ChakraLink>
                </Link>
                
                <Link href={`/docs/directDemocracy`} passHref>
                  <ChakraLink 
                    as="span" 
                    display="block" 
                    width="100%" 
                    p={2} 
                    borderRadius="md"
                    bg={currentPath === '/docs/directDemocracy' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
                    color={currentPath === '/docs/directDemocracy' ? 'white' : 'gray.300'}
                    fontWeight={currentPath === '/docs/directDemocracy' ? '600' : '500'}
                    _hover={{ 
                      bg: 'rgba(255, 255, 255, 0.15)',
                      color: 'white'
                    }}
                  >
                    Direct Democracy
                  </ChakraLink>
                </Link>
              </VStack>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem border="none" mt={2}>
            <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
              <Flex align="center" flex="1">
                <Icon as={FaInfoCircle} mr={2} color="blue.300" />
                <Text fontWeight="700" fontSize="18px">Blog</Text>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} pl={6}>
              <VStack align="flex-start" width="100%" spacing={3}>
                <Link href={`/docs/AlphaV1`} passHref>
                  <ChakraLink 
                    as="span" 
                    display="block" 
                    width="100%" 
                    p={2} 
                    borderRadius="md"
                    bg={currentPath === '/docs/AlphaV1' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
                    color={currentPath === '/docs/AlphaV1' ? 'white' : 'gray.300'}
                    fontWeight={currentPath === '/docs/AlphaV1' ? '600' : '500'}
                    _hover={{ 
                      bg: 'rgba(255, 255, 255, 0.15)',
                      color: 'white'
                    }}
                  >
                    Alpha V1
                  </ChakraLink>
                </Link>
                
                <Link href={`/docs/TheGraph`} passHref>
                  <ChakraLink 
                    as="span" 
                    display="block" 
                    width="100%" 
                    p={2} 
                    borderRadius="md"
                    bg={currentPath === '/docs/TheGraph' ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
                    color={currentPath === '/docs/TheGraph' ? 'white' : 'gray.300'}
                    fontWeight={currentPath === '/docs/TheGraph' ? '600' : '500'}
                    _hover={{ 
                      bg: 'rgba(255, 255, 255, 0.15)',
                      color: 'white'
                    }}
                  >
                    The Graph
                  </ChakraLink>
                </Link>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Box>
  );
}

export default SideBar;