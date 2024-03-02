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

  const [memberRoleName, setMemberRoleName] = useState("");

  const handleInputChange = (e) => setMemberRoleName(e.target.value);

  const handleSave = () => {
    onSave(memberRoleName); // Call onSave with the memberRoleName
    onClose(); // Close the modal after saving
    setMemberRoleName(""); // Reset the input field
  };

  return (
    <>
      {/* Adjusted the button text */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Role</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Name of new role</FormLabel>
              <Input value={memberRoleName} onChange={handleInputChange} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost" onClick={handleSave}>
              Add Role
            </Button>{" "}
            {/* Use handleSave when clicking Save */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MemberSpecificationModal;
