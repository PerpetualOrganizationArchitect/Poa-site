import React, { useState } from 'react';
import { Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, RadioGroup, Radio, Stack } from '@chakra-ui/react';

const mockQuiz = {
    id: 1,
    question: "What is the capital of France?",
    choices: ["Berlin", "Madrid", "Paris", "Rome"]
};

const QuizModal = ({ quizId }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedAnswer, setSelectedAnswer] = useState('');

    return (
        <>
            <Button size={"sm"}  onClick={onOpen}>Take Quiz</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Quiz {quizId}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box mb={4}>{mockQuiz.question}</Box>
                        <RadioGroup onChange={setSelectedAnswer} value={selectedAnswer}>
                            <Stack direction="column">
                                {mockQuiz.choices.map((choice, index) => (
                                    <Radio key={index} value={choice}>
                                        {choice}
                                    </Radio>
                                ))}
                            </Stack>
                        </RadioGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Submit
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default QuizModal;