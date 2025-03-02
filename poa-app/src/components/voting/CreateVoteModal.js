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
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a Vote</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack
            as="form"
            spacing={4}
            mt={8}
            w="100%"
          >
            <FormControl>
              <FormLabel>Proposal title</FormLabel>
              <Input
                type="text"
                name="name"
                value={proposal.name}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Proposal Description</FormLabel>
              <Textarea
                name="description"
                value={proposal.description}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl>
              <FormLabel>Time (in Minutes)</FormLabel>
              <Input
                type="number"
                name="time"
                value={proposal.time}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            {proposal.type !== "election" && (
              <FormControl>
                <FormLabel>Options (comma and space separated)</FormLabel>
                <Textarea
                  name="options"
                  value={proposal.options.join(", ")}
                  onChange={handleOptionsChange}
                  placeholder="Option 1, Option 2, Option 3"
                  required
                />
              </FormControl>
            )}
            <FormControl>
              <FormLabel>Proposal Type</FormLabel>
                <Select
                  name="type"
                  value={proposal.type}
                  onChange={handleProposalTypeChange}
                >
                  <option value="normal">Normal</option>
                  <option value="transferFunds">Transfer Funds</option>
                  <option value="election">Election</option>
                </Select>
            </FormControl>

            {proposal.type === "election" && (
              <>
                <FormLabel>Candidates</FormLabel>
                {candidateList.map((candidate, index) => (
                  <HStack key={index} w="100%">
                    <FormControl>
                      <Input
                        placeholder="Candidate Name"
                        value={candidate.name}
                        onChange={(e) => handleCandidateChange(index, 'name', e.target.value)}
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        placeholder="Candidate Address"
                        value={candidate.address}
                        onChange={(e) => handleCandidateChange(index, 'address', e.target.value)}
                        required
                      />
                    </FormControl>
                  </HStack>
                ))}
                <Button
                  leftIcon={<AddIcon />}
                  onClick={addCandidate}
                  mt={2}
                  variant="outline"
                >
                  Add Candidate
                </Button>
              </>
            )}

            {proposal.type === 'transferFunds' && (
              <>
                <FormControl>
                  <FormLabel>Transfer Address</FormLabel>
                  <Input
                    type="text"
                    name="transferAddress"
                    value={proposal.transferAddress}
                    onChange={handleTransferAddressChange}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Transfer Amount</FormLabel>
                  <Input
                    type="number"
                    name="transferAmount"
                    value={proposal.transferAmount}
                    onChange={handleTransferAmountChange}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Transfer Option</FormLabel>
                  <Input
                    type="number"
                    name="transferOption"
                    value={proposal.transferOption}
                    onChange={handleTransferOptionChange}
                    required
                  />
                </FormControl>
              </>
            )}
            <Text fontSize="md" color="gray.500">Create votes to control treasury and create tasks or projects Coming Soon</Text>
          </VStack>
        </ModalBody>
        
        <ModalFooter>
          <Button
            type="submit"
            colorScheme="teal"
            onClick={handlePollCreated}
            isLoading={loadingSubmit}
            loadingText="Handling Process"
          >
            Submit Poll
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateVoteModal; 