import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
} from "@chakra-ui/react";

const steps = [
  {
    id: "greeting",
    title: "Welcome to the Architect Tool!",
    content: "This is a quick tour to get you started.",
  },
  {
    id: "practice-speaking",
    title: "Practice Speaking",
    content: "Try saying something to the system.",
    // You might include a component here for voice input, etc.
  },
  {
    id: "practice-choosing",
    title: "Practice Choosing",
    content: "Let’s practice making a selection.",
    // Include components or UI elements for the user to interact with.
  },
];

const Tutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const skipTutorial = () => {
    // Close the tutorial and potentially mark it as completed.
    // This should also handle any cleanup or state resetting
  };

  const currentContent = steps[currentStep];

  return (
    <Modal isOpen={true} onClose={skipTutorial}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{currentContent.title}</ModalHeader>
        <ModalBody>
          <Text>{currentContent.content}</Text>
          {/* If the current step requires a component, render it here */}
        </ModalBody>
        <ModalFooter>
          <Button onClick={skipTutorial}>Skip Tutorial</Button>
          <Button
            variant="outline"
            mr={3}
            onClick={prevStep}
            isDisabled={currentStep === 0}
          >
            Back
          </Button>
          <Button
            colorScheme="blue"
            onClick={currentStep < steps.length - 1 ? nextStep : skipTutorial}
          >
            {currentStep < steps.length - 1 ? "Next" : "Finish"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Tutorial;
