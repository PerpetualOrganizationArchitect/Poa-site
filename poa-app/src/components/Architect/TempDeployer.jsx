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

import {main} from "../../../scripts/newDeployment";
import { is } from "@react-spring/shared";

function Deployer({ isOpen, onClose, deploymentDetails, signer}) {
  const [isDeployed, setIsDeployed] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
  const deploy = async (deploymentDetails) => {
    console.log("Deploying...");

    console.log(deploymentDetails);
    try {
      await main(
        deploymentDetails.membershipTypeNames,
        deploymentDetails.membershipTypeNames,
        deploymentDetails.POname,
        deploymentDetails.quadraticVotingEnabled,
        deploymentDetails.democracyVoteWeight,
        deploymentDetails.participationVoteWeight,
        deploymentDetails.hybridVotingEnabled,
        deploymentDetails.participationVotingEnabled,
        deploymentDetails.logoURL,
        deploymentDetails.votingControlType, 
        signer
       );
    } catch (error) {
      toast({
        title: "Deployment failed.",
        description: "There was an error during the deployment process.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  async function run(){
    await deploy(deploymentDetails);


    setIsDeployed(true);
  }


  if (isOpen) {
    run();
  }
  }, [isOpen]);

  const handleAccessOrganization = () => {
    const formattedOrgName = encodeURIComponent(
      deploymentDetails.POname.trim().toLowerCase().replace(/\s+/g, "-")
    );
    router.push(`/user/?userDAO=${formattedOrgName}`);
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
          {isDeployed? (
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
