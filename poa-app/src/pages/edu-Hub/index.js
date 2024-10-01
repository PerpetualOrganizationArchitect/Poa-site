import React, { useState, useEffect } from 'react';
import {
  Box,
  Spinner,
  Center,
  Grid,
  GridItem,
  Heading,
  Text,
  Link as ChakraLink,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useDisclosure,
  useToast,
  Progress, 
  Icon, 
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons'; 
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";
import { usePOContext } from '@/context/POContext';
import { useWeb3Context } from '@/context/web3Context';
import { useUserContext } from '@/context/UserContext';
import QuizModal from '@/components/eduHub/QuizModal';

const EducationHub = () => {
  const { poContextLoading, educationModules, nftMembershipContractAddress, educationHubAddress } = usePOContext();
  const { completedModules } = useUserContext();
  const { createEduModule, checkIsExecutive, address } = useWeb3Context();
  const [isExecutive, setIsExecutive] = useState(false);
  const [isLoadingExecCheck, setIsLoadingExecCheck] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form state
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [moduleLink, setModuleLink] = useState(''); 
  const [moduleQuestion, setModuleQuestion] = useState(''); 
  const [payout, setPayout] = useState(0);
  const [answers, setAnswers] = useState(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if the user is an executive
  useEffect(() => {
    const checkExecutiveStatus = async () => {
      if (nftMembershipContractAddress && address) {
        const execStatus = await checkIsExecutive(nftMembershipContractAddress, address);
        setIsExecutive(execStatus);
      }
      setIsLoadingExecCheck(false);
    };
    checkExecutiveStatus();
  }, [nftMembershipContractAddress, address]);

  const handleAddModule = async () => {
    setIsSubmitting(true);
    try {
      const selectedAnswer = answers[correctAnswerIndex];
      await createEduModule(
        educationHubAddress,
        moduleTitle,
        moduleDescription,
        moduleLink, 
        moduleQuestion,
        payout,
        answers,
        selectedAnswer
      );
      toast({
        title: "Module Created",
        description: "Your module has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Reset form
      setModuleTitle('');
      setModuleDescription('');
      setModuleLink('');
      setModuleQuestion('');
      setPayout(0);
      setAnswers(['', '', '', '']);
      setCorrectAnswerIndex(null);
      onClose();
    } catch (error) {
      console.error("Error creating module:", error);
      toast({
        title: "Error",
        description: "There was an error creating the module.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const totalModules = educationModules.length;
  const completedModuleIds = completedModules?.map((module) => module.id) || [];
  const modulesCompletedCount = completedModules?.length || 0;
  const progressPercentage = totalModules ? (modulesCompletedCount / totalModules) * 100 : 0;

  // Sort modules: uncompleted first
  const sortedModules = [...educationModules].sort((a, b) => {
    const aCompleted = completedModuleIds.includes(a.id);
    const bCompleted = completedModuleIds.includes(b.id);
    if (aCompleted && !bCompleted) {
      return 1; 
    } else if (!aCompleted && bCompleted) {
      return -1; 
    } else {
      return 0; 
    }
  });

  return (
    <>
      <Navbar />
      {poContextLoading || isLoadingExecCheck ? (
        <Center height="90vh">
          <Spinner size="xl" />
        </Center>
      ) : (
        <Box position="relative">
          {/* Main Box */}
          <Box
            p={5}
            sx={{
              backdropFilter: 'blur(20px)',
              backgroundColor: 'rgba(0, 0, 0, 0.73)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            borderRadius="lg"
            mx="auto"
            mt={6}
            maxWidth="800px"
            textAlign="center"
          >
            <Heading as="h2" size="lg" color="white" mb={3}>
              Education Hub
            </Heading>
            <Text fontSize="lg" color="gray.100">
              Learn and take short quizzes to earn tokens
            </Text>

            {/* Progress Bar */}
            <Box mt={6} display="flex" flexDirection="column" alignItems="center">
              <Progress
                value={progressPercentage}
                size="lg"
                colorScheme="green"
                borderRadius="md"
                w="50%" 
              />
              <Text color="gray.200" mt={2} fontSize="sm">
                {modulesCompletedCount} of {totalModules} modules completed
              </Text>
            </Box>


            {isExecutive && (
              <Button
                onClick={onOpen}
                colorScheme="blue"
                position="absolute"
                top="13px"
                right="13px"
                width="40px"
                height="40px"
                size="lg"
                p="0"
                borderRadius="full"
                boxShadow="xl"
                _hover={{ transform: 'scale(1.1)' }}
              >
                <Box as="span" fontSize="4xl">+</Box>
              </Button>
            )}
          </Box>

          {/* Add Module Modal */}
          <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add New Module</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {/* Module Form */}
                <FormControl isRequired mb={4}>
                  <FormLabel>Module Title</FormLabel>
                  <Input
                    placeholder="Enter module title"
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired mb={4}>
                  <FormLabel>Module Description</FormLabel>
                  <Textarea
                    placeholder="Enter module description"
                    value={moduleDescription}
                    onChange={(e) => setModuleDescription(e.target.value)}
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Module Link</FormLabel>
                  <Input
                    placeholder="Enter module link (optional)"
                    value={moduleLink}
                    onChange={(e) => setModuleLink(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired mb={4}>
                  <FormLabel>Quiz Question</FormLabel>
                  <Input
                    placeholder="Enter quiz question"
                    value={moduleQuestion}
                    onChange={(e) => setModuleQuestion(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired mb={4}>
                  <FormLabel>Payout (Tokens)</FormLabel>
                  <NumberInput min={0} value={payout} onChange={(valueString) => setPayout(Number(valueString))}>
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl isRequired mb={4}>
                  <FormLabel>Answers</FormLabel>
                  {answers.map((answer, index) => (
                    <Input
                      key={index}
                      placeholder={`Answer ${index + 1}`}
                      value={answer}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[index] = e.target.value;
                        setAnswers(newAnswers);
                      }}
                      mt={index > 0 ? 2 : 0}
                    />
                  ))}
                </FormControl>
                <FormControl isRequired mb={4}>
                  <FormLabel>Correct Answer</FormLabel>
                  <NumberInput
                    min={1}
                    max={answers.length}
                    value={correctAnswerIndex !== null ? correctAnswerIndex + 1 : ''}
                    onChange={(valueString) => setCorrectAnswerIndex(Number(valueString) - 1)}
                  >
                    <NumberInputField placeholder="Enter the number of the correct answer" />
                  </NumberInput>
                  <FormErrorMessage>Please select the correct answer index.</FormErrorMessage>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="teal"
                  mr={3}
                  onClick={handleAddModule}
                  isLoading={isSubmitting}
                  isDisabled={
                    !moduleTitle ||
                    !moduleDescription ||
                    !moduleQuestion || 
                    payout <= 0 ||
                    answers.some((ans) => !ans) ||
                    correctAnswerIndex === null
                  }
                >
                  Create Module
                </Button>
                <Button variant="ghost" onClick={onClose} isDisabled={isSubmitting}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Box p={6} bg="transparent" borderRadius="lg" mx="auto" mt={2} maxWidth="1200px">
            <Grid
              templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
              gap={8}
            >
              {sortedModules.map((module) => {
                const isCompleted = completedModuleIds.includes(module.id);
                return (
                  <GridItem
                    key={module.id}
                    borderRadius="md"
                    p={6}
                    position="relative" // To position the check mark
                    sx={{
                      backdropFilter: 'blur(20px)',
                      backgroundColor: 'rgba(0, 0, 0, 0.73)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                    transition="all 0.3s ease"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    {/* Check Mark for Completed Modules */}
                    {isCompleted && (
                      <Box
                        position="absolute"
                        top="10px"
                        right="10px"
                        color="green.400"
                      >
                        <Icon as={CheckIcon} w={6} h={6} />
                      </Box>
                    )}
                    <Box mb={6}>
                      <Heading as="h3" fontSize="27" mb={6} color="white">
                        {module.name}
                      </Heading>
                      <Text fontSize="16" color="gray.200">
                        {module.info?.description}
                      </Text>
                    </Box>
                    <Box mt="auto">
                      <Text mb={2} fontSize="lg" fontWeight="bold" color="white">
                        Reward: {module.payout} Tokens
                      </Text>
                      <Flex justifyContent="space-between" alignItems="center" mt={4}>
                        {module.info?.link ? (
                          <ChakraLink href={module.info.link} isExternal>
                            <Button
                              _hover={{ transform: 'scale(1.07)', boxShadow: 'xl' }}
                              size="lg"
                              colorScheme="green"
                            >
                              Learn
                            </Button>
                          </ChakraLink>
                        ) : (
                          <ChakraLink href={`https://ipfs.io/ipfs/${module.ipfsHash}`} isExternal>
                            <Button
                              _hover={{ transform: 'scale(1.07)', boxShadow: 'xl' }}
                              size="lg"
                              colorScheme="green"
                            >
                              Learn
                            </Button>
                          </ChakraLink>
                        )}
                        <QuizModal module={module} />
                      </Flex>
                    </Box>
                  </GridItem>
                );
              })}
            </Grid>
          </Box>
        </Box>
      )}
    </>
  );
};

export default EducationHub;
