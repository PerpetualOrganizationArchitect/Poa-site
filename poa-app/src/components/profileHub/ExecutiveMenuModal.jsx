import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Input,
  Text,
  useToast
} from '@chakra-ui/react';

import { useWeb3Context } from "@/context/web3Context";
import { usePOContext } from '@/context/POContext';

const ExecutiveMenuModal = ({ isOpen, onClose }) => {
  const [addressToMint, setAddressToMint] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateNFT } = useWeb3Context();
  const toast = useToast();

    const {nftMembershipContractAddress} = usePOContext();

  const handleMintNFT = async () => {
    if (!addressToMint) {
      toast({
        title: "Address required",
        description: "Please enter a valid address",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      
      const membershipType = "Executive"; 
      await updateNFT(nftMembershipContractAddress, addressToMint, membershipType);
      toast({
        title: "Success",
        description: `NFT minted for ${addressToMint}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast({
        title: "Error",
        description: "Failed to mint NFT. See console for details.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setAddressToMint(''); 
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Executive Menu</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {/* Input for address */}
            <Input
              placeholder="Enter Address to Mint Executive NFT"
              value={addressToMint}
              onChange={(e) => setAddressToMint(e.target.value)}
              isDisabled={loading}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleMintNFT}
            isLoading={loading}
          >
            Mint Executive NFT
          </Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExecutiveMenuModal;