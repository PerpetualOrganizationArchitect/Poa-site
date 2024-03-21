import React from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import {Button} from "@chakra-ui/react"

const AddMumbaiNetworkButton = () => {
  const addMumbaiNetwork = async () => {
    const provider = await detectEthereumProvider();

    if (provider) {
      const chainId = '0x13881'; 
      const network = {
        chainId,
        chainName: 'Mumbai',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
      };

      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [network],
        });
      } catch (error) {
        console.error('Error adding Mumbai Testnet:', error);
      }
    } else {
      console.error('MetaMask not found. Please install the browser extension.');
    }
  };

  return (
    <Button colorScheme= "purple" onClick={addMumbaiNetwork} _hover={{ bg: "purple.600", boxShadow: "md", transform: "scale(1.05)"}}>
      Add Mumbai Testnet
    </Button>
  );
};

export default AddMumbaiNetworkButton;
