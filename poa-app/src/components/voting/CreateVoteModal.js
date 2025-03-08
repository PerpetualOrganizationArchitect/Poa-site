import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  HStack,
  Text,
  Box,
  Divider,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const glassLayerStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(20px)",
  backgroundColor: "rgba(0, 0, 0, .9)",
  boxShadow: "inset 0 0 15px rgba(148, 115, 220, 0.15)",
  border: "1px solid rgba(148, 115, 220, 0.2)",
};

const CreateVoteModal = ({
  isOpen,
  onClose,
  proposal,
  handleInputChange,
  handleOptionsChange,
  handleProposalTypeChange,
  handleTransferAddressChange,
  handleTransferAmountChange,
  handleTransferOptionChange,
  handleCandidateChange,
  addCandidate,
  handlePollCreated,
  loadingSubmit,
  candidateList
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(10px)" />
      <ModalContent
        bg="transparent"
        borderRadius="xl"
        position="relative"
        boxShadow="dark-lg"
      >
        <Box 
          className="glass" 
          style={glassLayerStyle} 
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          borderRadius="inherit"
          zIndex={-1}
        />
        
        <ModalHeader color="white" fontSize="2xl" fontWeight="bold">
          Create a Vote
        </ModalHeader>
        <ModalCloseButton color="white" />
        
        <Divider borderColor="rgba(148, 115, 220, 0.3)" />
        
        <ModalBody py={6}>
          <VStack spacing={5} align="stretch">
            <FormControl>
              <FormLabel color="white" fontWeight="medium">Vote Title</FormLabel>
              <Input
                placeholder="Enter title"
                name="name"
                value={proposal.name}
                onChange={handleInputChange}
                bg="whiteAlpha.100"
                border="1px solid rgba(148, 115, 220, 0.3)"
                color="white"
                _hover={{ borderColor: "purple.400" }}
                _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px rgba(148, 115, 220, 0.6)" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="white" fontWeight="medium">Description</FormLabel>
              <Textarea
                placeholder="Enter description"
                name="description"
                value={proposal.description}
                onChange={handleInputChange}
                bg="whiteAlpha.100"
                border="1px solid rgba(148, 115, 220, 0.3)"
                color="white"
                h="120px"
                _hover={{ borderColor: "purple.400" }}
                _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px rgba(148, 115, 220, 0.6)" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="white" fontWeight="medium">Vote Duration (minutes)</FormLabel>
              <Input
                placeholder="Enter time in minutes"
                name="time"
                type="number"
                value={proposal.time}
                onChange={handleInputChange}
                bg="whiteAlpha.100"
                border="1px solid rgba(148, 115, 220, 0.3)"
                color="white"
                _hover={{ borderColor: "purple.400" }}
                _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px rgba(148, 115, 220, 0.6)" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="white" fontWeight="medium">Vote Type</FormLabel>
              <Select
                placeholder="Select vote type"
                name="type"
                value={proposal.type}
                onChange={handleProposalTypeChange}
                bg="whiteAlpha.100"
                border="1px solid rgba(148, 115, 220, 0.3)"
                color="white"
                _hover={{ borderColor: "purple.400" }}
                _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px rgba(148, 115, 220, 0.6)" }}
              >
                <option value="normal">Normal</option>
                <option value="transferFunds">Transfer Funds</option>
                <option value="election">Election</option>
              </Select>
            </FormControl>

            {proposal.type === "normal" && (
              <FormControl>
                <FormLabel color="white" fontWeight="medium">Options (comma separated)</FormLabel>
                <Input
                  placeholder="e.g. Yes, No, Abstain"
                  value={proposal.options.join(", ")}
                  onChange={handleOptionsChange}
                  bg="whiteAlpha.100"
                  border="1px solid rgba(148, 115, 220, 0.3)"
                  color="white"
                  _hover={{ borderColor: "purple.400" }}
                  _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px rgba(148, 115, 220, 0.6)" }}
                />
              </FormControl>
            )}

            {proposal.type === "transferFunds" && (
              <>
                <FormControl>
                  <FormLabel color="white" fontWeight="medium">Transfer Address</FormLabel>
                  <Input
                    placeholder="Enter transfer address"
                    value={proposal.transferAddress}
                    onChange={handleTransferAddressChange}
                    bg="whiteAlpha.100"
                    border="1px solid rgba(148, 115, 220, 0.3)"
                    color="white"
                    _hover={{ borderColor: "purple.400" }}
                    _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px rgba(148, 115, 220, 0.6)" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="white" fontWeight="medium">Transfer Amount</FormLabel>
                  <Input
                    placeholder="Enter amount"
                    value={proposal.transferAmount}
                    onChange={handleTransferAmountChange}
                    bg="whiteAlpha.100"
                    border="1px solid rgba(148, 115, 220, 0.3)"
                    color="white"
                    _hover={{ borderColor: "purple.400" }}
                    _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px rgba(148, 115, 220, 0.6)" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="white" fontWeight="medium">Transfer Option</FormLabel>
                  <Input
                    placeholder="Should the amount be transferred? (Yes/No)"
                    value={proposal.transferOption}
                    onChange={handleTransferOptionChange}
                    bg="whiteAlpha.100"
                    border="1px solid rgba(148, 115, 220, 0.3)"
                    color="white"
                    _hover={{ borderColor: "purple.400" }}
                    _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px rgba(148, 115, 220, 0.6)" }}
                  />
                </FormControl>
              </>
            )}

            {proposal.type === "election" && (
              <>
                <FormControl>
                  <FormLabel color="white" fontWeight="medium">Candidates</FormLabel>
                  <VStack spacing={3} align="stretch">
                    {candidateList.map((candidate, index) => (
                      <HStack key={index} spacing={3}>
                        <Input
                          placeholder="Candidate Name"
                          value={candidate.name}
                          onChange={(e) => handleCandidateChange(index, "name", e.target.value)}
                          bg="whiteAlpha.100"
                          border="1px solid rgba(148, 115, 220, 0.3)"
                          color="white"
                          _hover={{ borderColor: "purple.400" }}
                          _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px rgba(148, 115, 220, 0.6)" }}
                        />
                        <Input
                          placeholder="Wallet Address"
                          value={candidate.address}
                          onChange={(e) => handleCandidateChange(index, "address", e.target.value)}
                          bg="whiteAlpha.100"
                          border="1px solid rgba(148, 115, 220, 0.3)"
                          color="white"
                          _hover={{ borderColor: "purple.400" }}
                          _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px rgba(148, 115, 220, 0.6)" }}
                        />
                      </HStack>
                    ))}
                  </VStack>
                  <Button 
                    leftIcon={<AddIcon />} 
                    onClick={addCandidate} 
                    mt={3} 
                    size="sm"
                    colorScheme="purple"
                    variant="outline"
                  >
                    Add Candidate
                  </Button>
                </FormControl>
              </>
            )}
          </VStack>
        </ModalBody>
        
        <Divider borderColor="rgba(148, 115, 220, 0.3)" />
        
        <ModalFooter>
          <Button 
            variant="outline" 
            mr={3} 
            onClick={onClose}
            color="white"
            borderColor="rgba(255, 255, 255, 0.3)"
            _hover={{ bg: "whiteAlpha.200" }}
          >
            Cancel
          </Button>
          <Button 
            colorScheme="purple" 
            onClick={handlePollCreated} 
            isLoading={loadingSubmit}
            loadingText="Creating..."
          >
            Create Vote
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateVoteModal; 