import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react';
import { useDataBaseContext } from '@/contexts/DataBaseContext';
import { useWeb3Context } from '@/contexts/Web3Context';



const AccountSettingsModal = ({ isOpen, onClose }) => {

    const { userDetails,updateUserData } = useDataBaseContext();
    const {account} = useWeb3Context();

    // State for input fields
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
  
    useEffect(() => {
      if (userDetails) {
        setName(userDetails.name || '');
        setUsername(userDetails.username || '');
        setEmail(userDetails.email || '');
      }
    }, [userDetails]);

  // Handle input changes
  const handleNameChange = (event) => setName(event.target.value);
  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);

  const handleSave = async () => {
    
    let usernameChange = false;
    if (userDetails.username !== username) {
      usernameChange = true;
    }

    await updateUserData(account, name, username, email, usernameChange);
    onClose(); 
  };

    

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> Update Account Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={handleNameChange} />
            <FormLabel>Username</FormLabel>
            <Input value={username} onChange={handleUsernameChange} />
            <FormLabel>Email</FormLabel>
          <Input value={email} onChange={handleEmailChange} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};


export default AccountSettingsModal;

