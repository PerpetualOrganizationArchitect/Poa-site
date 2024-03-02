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

const MemberSpecificationModal = ({ isOpen, onSave, onClose }) => {
  // Accept onSave prop

  const [memberTierName, setMemberTierName] = useState("");

  const handleInputChange = (e) => setMemberTierName(e.target.value);

  const handleSave = () => {
    onSave(memberTierName); // Call onSave with the memberTierName
    onClose(); // Close the modal after saving
    setMemberTierName(""); // Reset the input field
  };

  return (
    <>
      {/* Adjusted the button text */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Member Tier Specification</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name of new tier</FormLabel>
              <Input value={memberTierName} onChange={handleInputChange} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={handleSave}>
              Add Tier
            </Button>{" "}
            {/* Use handleSave when clicking Save */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MemberSpecificationModal;
