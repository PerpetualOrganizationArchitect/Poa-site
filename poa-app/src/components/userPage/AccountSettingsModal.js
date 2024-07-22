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
// import { useDataBaseContext } from '@/contexts/DataBaseContext';
import { useWeb3Context } from '@/context/web3Context';
import { useUserContext } from '@/context/UserContext';
import { useRouter } from 'next/router';


const AccountSettingsModal = ({ isOpen, onClose }) => {
    
    const {address, graphUsername, setGraphUsername, fetchUserDetails} = useUserContext();
    const {changeUsername} = useWeb3Context();

    const router = useRouter();
    const { userDAO } = router.query;

    useEffect(() => {
        if (userDAO) {
            fetchUserDetails();
        }
    } , [userDAO])

    const [username, setUsername] = useState('');
    // const [email, setEmail] = useState('');
  
    useEffect(() => {
      if (graphUsername) {
       
        setUsername(graphUsername);
      }
    }, [graphUsername]);

  // Handle input changes
  
  const handleUsernameChange = (event) => setUsername(event.target.value);
  

  const handleSave = async () => {

    if (graphUsername !== username) {
      try{
        await changeUsername(username);
        setGraphUsername(username);
      } catch (error) {
        console.error(error);
        toast({
          title: 'Error Updating Username',
          description: 'An error occurred. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      
    }
    else {
      toast({
        title: 'Username Unchanged',
        description: 'New username is the same as the old one. No changes made.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    }
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
           
            <FormLabel>Username</FormLabel>
            <Input value={username} onChange={handleUsernameChange} />
        
         
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

