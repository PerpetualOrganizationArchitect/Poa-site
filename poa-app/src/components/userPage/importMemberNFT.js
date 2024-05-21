import React, { useState, useEffect } from "react";
import Web3 from "web3";
import erc721ABI from "@/abi/KUBIMembershipNFT" // Import the ABI of your NFT contract
import { Button } from "@chakra-ui/react";

const NFTButton = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [nftToken, setNftToken] = useState(null);

  const NFT_ADDRESS = "0x9F15cEf6E7bc4B6a290435A598a759DbE72b41b5"; // Replace with your NFT contract address



  const importNFTToken = async () => {
    const tokenAddress = '0x9F15cEf6E7bc4B6a290435A598a759DbE72b41b5';
    
    try {
      // 'wasAdded' is a boolean. Like any RPC method, an error can be thrown.
      const wasAdded = await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC721',
          options: {
            address: tokenAddress, // The address of the token.
            tokenId: '1', 
          },
        },
      });
    
      if (wasAdded) {
        console.log('User successfully added the token!');
      } else {
        console.log('User did not add the token.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button colorScheme="purple" onClick={importNFTToken} disabled={!web3 || !account} _hover={{ bg: "purple.600", boxShadow: "md", transform: "scale(1.05)"}}>
      Import MyNFT Token
    </Button>
  );
};

export default NFTButton;
