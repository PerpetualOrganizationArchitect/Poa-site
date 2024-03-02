import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

const WeightModal = ({ isOpen, onSave, onClose }) => {
  const [participationWeight, setParticipationWeight] = useState(0);
  const [democracyWeight, setDemocracyWeight] = useState(100);

  const handleSave = () => {
    // Ensure weights are integers and sum to 100
    const weight = parseInt(participationWeight, 10) || 0;
    onSave({ participationWeight: weight, democracyWeight: 100 - weight });
    onClose(); // Close the modal after saving
  };

  // Adjusted for direct control over democracyWeight based on participationWeight changes
  useEffect(() => {
    const weight = parseInt(participationWeight, 10) || 0;
    setDemocracyWeight(100 - weight);
  }, [participationWeight]);

  const handleParticipationChange = (e) => {
    // Prevent weights from exceeding 100 or going below 0
    const newWeight = Math.max(0, Math.min(100, parseInt(e.target.value, 10)));
    setParticipationWeight(newWeight);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isClosable={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Weight Specification</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Participation Vote Weight</FormLabel>
            <Input
              type="number"
              value={participationWeight}
              onChange={handleParticipationChange}
              // Removed onBlur as we now directly control input
              max={100}
              min={0}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Democracy Vote Weight</FormLabel>
            <Input
              type="number"
              value={democracyWeight}
              isReadOnly // This field is always disabled
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WeightModal;
