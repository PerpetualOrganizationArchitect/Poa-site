// pages/executive.js

import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Input,
  Button,
  Heading,
  useToast,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { usePOContext } from '@/context/POContext';
import { useWeb3Context } from '@/context/web3Context';

const ExecutivePage = () => {
  const {
    leaderboardData,
    loading,
    error,
    poContextLoading,
    nftMembershipContractAddress,
  } = usePOContext();
  const [executives, setExecutives] = useState([]);
  const [loadingExecs, setLoadingExecs] = useState(true);
  const [addressToMint, setAddressToMint] = useState('');
  const [mintLoading, setMintLoading] = useState(false);
  const toast = useToast();
  const { updateNFT } = useWeb3Context();

  useEffect(() => {
    // Fetch list of executives
    const fetchExecutives = async () => {
      try {
        setLoadingExecs(true);
        
        
        
        if (leaderboardData) {
            
          const execs = leaderboardData.filter((user) => {
            
            
            return (
              user.type &&
              user.type === 'Executive'
            );
          }).map((user) => ({
            id: user.id,
            address: user.id,
            name: user.name || 'Unknown',
          }));
          setExecutives(execs);
        } else {
          setExecutives([]);
        }
      } catch (err) {
        console.error('Error fetching executives:', err);
      } finally {
        setLoadingExecs(false);
      }
    };

    if (leaderboardData && !loading) {
        
      fetchExecutives();
    }
  }, [leaderboardData, loading]);

  const handleMintNFT = async () => {
    if (!addressToMint) {
      toast({
        title: 'Address required',
        description: 'Please enter a valid address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setMintLoading(true);
    try {
      const membershipType = 'Executive';
      await updateNFT(nftMembershipContractAddress, addressToMint, membershipType);
      toast({
        title: 'Success',
        description: `Executive NFT minted for ${addressToMint}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setAddressToMint('');
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast({
        title: 'Error',
        description: 'Failed to mint NFT. See console for details.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setMintLoading(false);
    }
  };

  if (loading || poContextLoading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return <Text>Error loading data: {error.message}</Text>;
  }

  return (
    <VStack spacing={8} align="stretch" maxW="1000px" mx="auto" mt={8}>
      {/* Header Box */}
      <Box
        bg="rgba(0, 0, 0, 0.6)"
        borderRadius="md"
        p={8}
        backdropFilter="blur(10px)"
      >
        <Heading as="h2" size="xl" color="white" textAlign="center">
          Executive Dashboard
        </Heading>
      </Box>

      {/* List of Executives Box */}
      <Box
        bg="rgba(0, 0, 0, 0.6)"
        borderRadius="md"
        p={8}
        backdropFilter="blur(10px)"
      >
        <Heading as="h3" size="lg" mb={4} color="white">
          List of Executives
        </Heading>
        {loadingExecs ? (
          <Spinner />
        ) : executives.length > 0 ? (
          executives.map((exec) => (
            <Box
              key={exec.id}
              bg="rgba(255, 255, 255, 0.1)"
              p={4}
              borderRadius="md"
              mb={2}
            >
              <Text color="white">
                {exec.name} - {exec.address}
              </Text>
            </Box>
          ))
        ) : (
          <Text color="white">No executives found.</Text>
        )}
      </Box>

      {/* Executive Control Menu Box */}
      <Box
        bg="rgba(0, 0, 0, 0.6)"
        borderRadius="md"
        p={8}
        backdropFilter="blur(10px)"
      >
        <Heading as="h3" size="lg" mb={4} color="white">
          Executive Control Menu
        </Heading>
        <VStack spacing={4} align="stretch">
          <Input
            placeholder="Enter Address to Mint Executive NFT"
            value={addressToMint}
            onChange={(e) => setAddressToMint(e.target.value)}
            isDisabled={mintLoading}
            bg="white"
            color="black"
          />
          <Button
            colorScheme="blue"
            onClick={handleMintNFT}
            isLoading={mintLoading}
          >
            Mint Executive NFT
          </Button>
        </VStack>
      </Box>
    </VStack>
  );
};

export default ExecutivePage;
