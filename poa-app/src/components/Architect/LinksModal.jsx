// LinksModal.js
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const LinksModal = ({ isOpen, onClose, onSave }) => {
  const [links, setLinks] = useState([{ name: "", url: "" }]);

  const handleAddLink = () => {
    setLinks([...links, { name: "", url: "" }]);
  };

  const handleDeleteLink = (index) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const handleSave = () => {
    onSave(links.filter(link => link.name && link.url));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Links</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {links.map((link, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <Input
                placeholder="Link Name"
                value={link.name}
                onChange={(e) => handleLinkChange(index, "name", e.target.value)}
                mr={2}
              />
              <Input
                placeholder="Link URL"
                value={link.url}
                onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                mr={2}
              />
              <IconButton
                icon={<DeleteIcon />}
                onClick={() => handleDeleteLink(index)}
              />
            </Box>
          ))}
          <Button leftIcon={<AddIcon />} onClick={handleAddLink}>
            Add Link
          </Button>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LinksModal;
