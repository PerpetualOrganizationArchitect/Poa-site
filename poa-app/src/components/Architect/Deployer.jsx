import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";


function Deployer({ isOpen, onClose, deploymentDetails }) {
  const [isDeployed, setIsDeployed] = useState(false);
  const toast = useToast();
  const router = useRouter();



  const handleAccessOrganization = () => {
    const formattedOrgName = encodeURIComponent(
      deploymentDetails.POname.trim().toLowerCase().replace(/\s+/g, "-")
    );
    router.push(`/${formattedOrgName}/home`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Deploying Your Organization</ModalHeader>
        <ModalBody>
          {isDeployed ? (
            <p>Deployment successful! You can now access your organization.</p>
          ) : (
            <Spinner size="xl" />
          )}
        </ModalBody>
        <ModalFooter>
          {isDeployed ? (
            <Button colorScheme="blue" onClick={handleAccessOrganization}>
              Access Organization
            </Button>
          ) : null}
          <Button colorScheme="gray" ml={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default Deployer;
