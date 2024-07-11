import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useRouter } from "next/router";

const glassLayerStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(9px)",
  backgroundColor: "rgba(33, 33, 33, 0.97)",
};

const CompletedPollModal = ({ onOpen, isOpen, onClose, selectedPoll }) => {
  const router = useRouter();
  const { userDAO } = router.query;

  const handleModalClose = () => {
    onClose();
    router.push(`/voting/?userDAO=${userDAO}`);
  };

  return (
    <Modal onOpen={onOpen} isOpen={isOpen} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent
        alignItems="center"
        justifyContent="center"
        borderRadius="3xl"
        boxShadow="lg"
        display="flex"
        w="100%"
        maxWidth="40%"
        bg="transparent"
        position="relative"
        p={4}
        zIndex={1}
        mt="10%"
        color="ghostwhite"
      >
        <div className="glass" style={glassLayerStyle} />
        <ModalHeader
          color="rgba(333, 333, 333, 1)"
          fontWeight={"extrabold"}
          fontSize={"2xl"}
        >
          {selectedPoll?.name}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            {/* Description Section */}
            <VStack ml="6" mr="6" spacing={2} alignItems="start">
              <Text color="rgba(333, 333, 333, 1)" fontSize="md">
                {selectedPoll?.description}
              </Text>
            </VStack>

            {/* Results Section */}
            <VStack color="rgba(333, 333, 333, 1)" spacing={4}>
              <Text fontSize="lg" fontWeight="bold">
                Results:
              </Text>
              {selectedPoll?.options?.map((option, index) => (
                <Text key={index}>
                  {option.name}: {ethers.BigNumber.from(option.votes).toNumber()} votes
                </Text>
              ))}
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleModalClose} mr={3}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CompletedPollModal;
