import React, { useState, useEffect, use } from "react";
import { useWeb3Context } from "@/context/web3Context";
import { usePOContext } from "@/context/POContext";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from 'next/router';
import {
  VStack,
  Text,
  Button,
  Input,
  Box,
  Flex,
} from "@chakra-ui/react";
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useMagic } from "@/context/MagicContext";

const User = () => {
  const { hasMemberNFT, graphUsername } = useUserContext();
 
  const {quickJoinContractAddress} = usePOContext();
  const { quickJoinNoUser, quickJoinWithUser, address } = useWeb3Context();
  const router = useRouter();
  const { userDAO } = router.query;

  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [dispaly, setDispaly] = useState(true);
  const [isSSR, setIsSSR] = useState(true);
  const { magic } = useMagic();

  useEffect(() => {
    setIsSSR(false);
  }, [userDAO]);

  useEffect(() => {
    if (hasMemberNFT) {
      router.push(`/profileHub/?userDAO=${userDAO}`);
    }
  }, [hasMemberNFT, address]);

  const handleMagicLogin = async () => {
   
    try {
      magic.wallet.connectWithUI();
      
    } catch (error) {
      console.error(error);
    }
  };

  const handleMagicLogin2 = async () => {
    try {
      magic.wallet.showUI();
    } catch (error) {
      console.error(error);
    }
  }


  const setDispalyHandle = async () => {
    setLoading(true);
    try {
      await quickJoinWithUser(quickJoinContractAddress);
    } catch (error) {
      console.error(error);
    }
    router.push(`/profileHub/?userDAO=${userDAO}`);
    setLoading(false);
  };

  const setDispalyHandleNew = async () => {
    setLoading(true);
    try {
      await quickJoinNoUser(quickJoinContractAddress, newUsername);
    } catch (error) {
      console.error(error);
    }
    router.push(`/profileHub/?userDAO=${userDAO}`);
    setLoading(false);
  };

  if (isSSR) {
    return null;
  }

  return (
    <>
      <Navbar />
      {address ? (
        <>
          <Box position="relative">
            <Flex justify="flex-end" p="4">
              <ConnectButton showBalance={false} chainStatus="icon" />
              <Button onClick={handleMagicLogin2} size="lg" ml={4} bg="blue.500" color="white" _hover={{ bg: "blue.600", boxShadow: "md", transform: "scale(1.05)" }}> Login with Magic </Button>
            </Flex>
          </Box>
          {dispaly && graphUsername ? (
            <VStack mt="8" spacing="6">
              <Text align={"center"} fontWeight="bold" maxW="60%" fontSize="2xl" textColor="black">
                Join to become a Member of {userDAO} and access the Profile Hub.
              </Text>
              <Text align={"center"} fontWeight="bold" maxW="60%" fontSize="2xl" textColor="black">
                Please wait for the transaction; it could take some time.
              </Text>
              <Button isLoading={loading} loadingText="Joining..." onClick={setDispalyHandle} size="lg" mt={4} bg="green.300" _hover={{ bg: "green.400", boxShadow: "md", transform: "scale(1.05)" }}>
                Join Now
              </Button>
            </VStack>
          ) : (
            <VStack mt="8" spacing="6">
              <Text align={"center"} fontWeight="bold" maxW="60%" fontSize="2xl" textColor="black">
                Join to become a Member of {userDAO} and access the Profile Hub.
              </Text>
              <Text align={"center"} fontWeight="bold" maxW="60%" fontSize="2xl" textColor="black">
                Please wait for the transaction; it could take some time.
              </Text>
              <Input 
                placeholder="Enter your username" 
                value={newUsername} 
                onChange={(e) => setNewUsername(e.target.value)}
                size="lg"
                maxW={"50%"}
                mt={4}
              />
              <Button 
                isLoading={loading} 
                loadingText="Joining..." 
                onClick={setDispalyHandleNew} 
                size="lg" 
                mt={4} 
                bg="green.300" 
                _hover={{ bg: "green.400", boxShadow: "md", transform: "scale(1.05)" }}
                isDisabled={!newUsername}  
              >
                Join Now and Create Account
              </Button>
            </VStack>
          )}
        </>
      ) : (
        <VStack mt="8" spacing="6">
          <Text fontWeight="bold" ml="15%" mr="15%" fontSize="2xl" textColor="black">
            Connect wallet to Join and Access the Profile Hub.
          </Text>
          <Text fontWeight="bold" ml="15%" mr="15%" fontSize="xl" textColor="black">
            Already a member? Access by Connecting Wallet.
          </Text>
          <Button
            onClick={handleMagicLogin}
            size="lg"
            mt={4}
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600", boxShadow: "md", transform: "scale(1.05)" }}
          >
            Login with Magic
          </Button>
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
        </VStack>
      )}
    </>
  );
};

export default User;
