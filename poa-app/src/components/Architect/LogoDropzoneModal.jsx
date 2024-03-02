import React, { useState } from "react";
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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

const LogoDropzoneModal = ({ isOpen, onSave, onClose }) => {
  const [uploadStatus, setUploadStatus] = useState(null); // null, 'success', or 'error'

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/gif": [],
      "image/webp": [],
    },
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
      // Simulate file upload process
      const file = acceptedFiles[0]; // Assuming single file upload
      if (file) {
        // Simulate a successful upload
        setUploadStatus("success");
        // If there was an error during the upload process, you might set it to 'error' instead
        // setUploadStatus('error');
      }
    },
  });

  const resetUploadStatus = () => {
    setUploadStatus(null);
    if (typeof onClose === "function") {
      onClose(); // Close the modal
    } // Close the modal
  };

  return (
    <Modal isOpen={isOpen} onClose={resetUploadStatus}>
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
          {uploadStatus === "success" && (
            <Alert status="success" mt={4}>
              <AlertIcon />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>Your file has been uploaded.</AlertDescription>
            </Alert>
          )}
          {uploadStatus === "error" && (
            <Alert status="error" mt={4}>
              <AlertIcon />
              <AlertTitle>Error!</AlertTitle>
              <AlertDescription>
                There was an issue with the file upload.
              </AlertDescription>
            </Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={resetUploadStatus}>
            {uploadStatus ? "Close" : "Cancel"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LogoDropzoneModal;
