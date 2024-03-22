import React, { useState, useEffect } from "react";
import Web3 from "web3";
import erc20ABI from "@/abi/KUBIX.json";
import { Button } from "@chakra-ui/react";

const KubixButton = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [kubixToken, setKubixToken] = useState(null);

  const KUBIX_ADDRESS = "0x894158b1f988602b228E39a633C7A2458A82028A";
  const DECIMALS = 18;

  useEffect(() => {
    
    (async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        const tokenInstance = new web3Instance.eth.Contract(erc20ABI.abi, KUBIX_ADDRESS);
        setKubixToken(tokenInstance);
      } else {
        alert("Please install MetaMask to use this feature.");
      }
    })();
  }, []);

  const importKubixToken = async () => {
    if (kubixToken && account) {
      try {
        await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: KUBIX_ADDRESS,
              symbol: "KUBIX",
              decimals: DECIMALS,
              image: "https://kublockchain.com/wp-content/uploads/2021/07/KUBC-logo-CMYK-150.png",
            },
          },
        });
      } catch (error) {
        console.error("Error importing KUBIX token:", error);
        alert("Error importing KUBIX token. Please try again.");
      }
    } else {
      alert("Please connect to MetaMask to use this feature.");
    }
  };

  return (
    <Button colorScheme = "green" onClick={importKubixToken} disabled={!web3 || !account} _hover={{ bg: "green.600", boxShadow: "md", transform: "scale(1.05)"}}>
      Import KUBIX Token
    </Button>
  );
};

export default KubixButton;
