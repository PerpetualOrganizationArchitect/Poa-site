import React, { useState } from "react";
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
  useDisclosure,
} from "@chakra-ui/react";

const WeightModal = ({ isOpen, onSave, onClose, type }) => {
  // Accept onSave prop

  const [weight, setWeight] = useState("");

  const handleInputChange = (e) => setWeight(e.target.value);

  const handleSave = () => {
    onSave(weight); // Call onSave with the memberTierName
    onClose(); // Close the modal after saving
    setWeight(""); // Reset the input field
  };

  return (
    <>
      {/* Adjusted the button text */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>${type} Weight Specification</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>How much should ($type) be weighted?</FormLabel>
              <Input value={weight} onChange={handleInputChange} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={handleSave}>
              Save
            </Button>{" "}
            {/* Use handleSave when clicking Save */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WeightModal;
