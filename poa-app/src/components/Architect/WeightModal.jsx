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
  const [participationWeight, setParticipationWeight] = useState("");
  const [democracyWeight, setDemocracyWeight] = useState(100);

  const handleSave = () => {
    const weight =
      participationWeight === "" ? 0 : parseInt(participationWeight, 10);
    onSave({ participationWeight: weight, democracyWeight: 100 - weight }); // Pass both weights back to the parent component
    onClose(); // Close the modal after saving
  };

  // When participationWeight changes and is not an empty string, adjust democracyWeight
  useEffect(() => {
    if (participationWeight !== "") {
      const weight = Math.max(
        0,
        Math.min(100, parseInt(participationWeight, 10))
      );
      setDemocracyWeight(100 - weight);
    }
  }, [participationWeight]);

  const handleParticipationChange = (e) => {
    setParticipationWeight(e.target.value);
  };

  const handleParticipationBlur = () => {
    if (participationWeight === "") {
      setParticipationWeight(100 - democracyWeight);
    } else {
      const weight = Math.max(
        0,
        Math.min(100, parseInt(participationWeight, 10))
      );
      setParticipationWeight(weight); // Correct the value if out of bounds
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
              onBlur={handleParticipationBlur}
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
