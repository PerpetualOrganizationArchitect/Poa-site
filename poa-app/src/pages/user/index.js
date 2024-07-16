import React, { useState, useEffect } from "react";
import { useWeb3Context } from "@/context/web3Context";
import { useGraphContext } from "@/context/graphContext";
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

const User = () => {
  const { address, hasMemberNFT, setLoaded, graphUsername, quickJoinContractAddress } = useGraphContext();
  const { quickJoinNoUser, quickJoinWithUser } = useWeb3Context();
  const router = useRouter();
  const { userDAO } = router.query;

  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [dispaly, setDispaly] = useState(true);
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setLoaded(userDAO);
    setIsSSR(false);
  }, [userDAO]);

  useEffect(() => {
    if (hasMemberNFT) {
      router.push(`/profileHub/?userDAO=${userDAO}`);
    }
  }, [hasMemberNFT, address]);

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
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
        </VStack>
      )}
    </>
  );
};

export default User;
