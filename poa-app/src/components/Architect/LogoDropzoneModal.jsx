// LogoDropzoneModal.jsx
import React from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

const LogoDropzoneModal = ({ isOpen, onClose }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/gif": [],
      "image/webp": [],
    },
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
      // Here you might handle the file, e.g., by uploading to a server or processing it
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Image</ModalHeader>
        <ModalBody>
          <Box
            {...getRootProps()}
            borderWidth="2px"
            borderStyle="dashed"
            rounded="md"
            p={5}
            cursor="pointer"
          >
            <input {...getInputProps()} />
            <VStack spacing={2}>
              <Text>
                Drag 'n' drop some files here, or click to select files
              </Text>
              <Text fontSize="sm" color="gray.500">
                Supports PNG, JPEG, GIF, and WebP formats
              </Text>
            </VStack>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LogoDropzoneModal;
