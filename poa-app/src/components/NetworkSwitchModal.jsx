import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Portal,
} from "@chakra-ui/react";
import { useChainModal } from "@rainbow-me/rainbowkit";

const NetworkSwitchModal = ({ isOpen, onClose }) => {
  const { openChainModal } = useChainModal();

  const handleNetworkSwitch = async () => {
    openChainModal();
    onClose();
};

  return (
    <Portal>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay zIndex="1400" />
        <ModalContent zIndex="1500">
          <ModalHeader>Wrong Network</ModalHeader>
          <ModalBody>
            <Text>Please switch to the Polygon Amoy network to continue.</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleNetworkSwitch}>
              Switch to Polygon Amoy
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Portal>
  );
};

export default NetworkSwitchModal;
