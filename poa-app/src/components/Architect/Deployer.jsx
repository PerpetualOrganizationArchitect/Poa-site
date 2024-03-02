import React, { useEffect, useState } from "react";
import { main as deployContracts } from "../../../scripts/realDeployment";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Progress,
  useToast,
} from "@chakra-ui/react";

function Deployer({ isOpen, onClose, deploymentDetails }) {
  const [progress, setProgress] = useState(0);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      startDeployment();
    }
  }, [isOpen, deploymentDetails]);

  const startDeployment = async () => {
    try {
      // Assuming deployContracts is an async function that handles the deployment
      // You might want to modify it to accept progress callback
      await deployContracts(
        deploymentDetails.memberTypeNames,
        deploymentDetails.executivePermissionNames,
        deploymentDetails.POname,
        deploymentDetails.quadraticVotingEnabled,
        deploymentDetails.democracyVoteWeight,
        deploymentDetails.participationVoteWeight,
        deploymentDetails.hybridVotingEnabled,
        deploymentDetails.participationVotingEnabled,
        deploymentDetails.logoURL,
        deploymentDetails.votingControlType,
        // Example of a progress callback:
        (currentProgress) => setProgress(currentProgress)
      );
      toast({
        title: "Deployment successful!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose(); // Close the modal
    } catch (error) {
      console.error("Deployment error:", error);
      toast({
        title: "Deployment failed.",
        description: "There was an error deploying your organization.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Deploying Your Organization</ModalHeader>
        <ModalBody>
          <Progress hasStripe value={progress} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default Deployer;
