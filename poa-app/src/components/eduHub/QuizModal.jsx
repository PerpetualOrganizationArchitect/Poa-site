import React, { useState} from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  RadioGroup,
  Radio,
  Stack,
  Text,
  useToast,
  useDisclosure
} from '@chakra-ui/react';

import { useSigner } from 'wagmi';
import { usePOContext } from '@/context/POContext';
import { useWeb3Context } from '@/context/web3Context';

const QuizModal = ({ module }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { educationHubAddress } = usePOContext();
  const { completeModule } = useWeb3Context();
  const toast = useToast();

  const handleSubmit = async () => {
    if (selectedAnswerIndex === '') return;
    setIsSubmitting(true);

    try {
      const success = await completeModule(
        educationHubAddress,
        module.id,
        parseInt(selectedAnswerIndex)
      );
      if (success) {
        toast({
          title: "Quiz Completed",
          description: "You have successfully completed the module.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Incorrect Answer",
          description: "Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your answer.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <>
      <Button size="sm" onClick={onOpen}>Take Quiz</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{module.name} Quiz</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>{module.info?.question}</Text>
            <RadioGroup onChange={setSelectedAnswerIndex} value={selectedAnswerIndex}>
              <Stack direction="column">
                {module.info?.answers?.map((answerObj) => (
                  <Radio key={answerObj.index} value={`${answerObj.index}`}>
                    {answerObj.answer}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleSubmit}
              isLoading={isSubmitting}
              isDisabled={selectedAnswerIndex === ''}
            >
              Submit
            </Button>
            <Button variant="ghost" onClick={onClose} isDisabled={isSubmitting}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default QuizModal;
