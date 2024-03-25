import { useEffect, useState } from 'react';
import { MetaMaskSDK } from "@metamask/sdk";
import { ethers } from 'ethers';
import { useGraphContext } from '@/context/graphContext';

export const useMetaMask = () => {
  const [accounts, setAccounts] = useState([]);
  const [metaMaskProvider, setMetaMaskProvider] = useState(null);
  const [wallet, setWallet] = useState(null);
  const { setAccountGraph } = useGraphContext();

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        console.log("MetaMask not detected");
        return;
      }
      const MMSDK = new MetaMaskSDK({
        dappMetadata: {
          name: "Example Next.js Dapp",
          url: window.location.href,
        },
      });

      await MMSDK.init();
      const ethereum = MMSDK.getProvider();
      setMetaMaskProvider(ethereum);

      // Directly create the Ethers provider here, not in state
      const ethersProvider = new ethers.providers.Web3Provider(ethereum);

      ethereum.request({ method: 'eth_accounts' })
        .then(accounts => handleAccountsChanged(accounts, ethersProvider))
        .catch(console.error);

      ethereum.on('accountsChanged', (accounts) => handleAccountsChanged(accounts, ethersProvider));
    };

    init();

    return () => {
      if (metaMaskProvider) {
        console.log("Removing MetaMask event listeners");
        metaMaskProvider.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts, ethersProvider) => {
    console.log("Accounts changed:", accounts);
    if (accounts.length > 0) {
      setAccounts(accounts);
      setAccountGraph(accounts[0]);

      // Use the provided ethersProvider directly
      const signer = ethersProvider.getSigner(accounts[0]);
      setWallet(signer); // Store the ethers signer as the "wallet"
      console.log("Connected to MetaMask with account:", accounts[0]);
    } else {
      console.log("Disconnected from MetaMask");
      setAccounts([]);
      setAccountGraph(null);
      setWallet(null);
    }
  };

  const connectWallet = async () => {
    if (!metaMaskProvider) return;

    try {
      // Directly create an ethersProvider to use here
      const ethersProvider = new ethers.providers.Web3Provider(metaMaskProvider);
      const accounts = await metaMaskProvider.request({ method: 'eth_requestAccounts' });
      handleAccountsChanged(accounts, ethersProvider);
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  return { connectWallet, accounts, wallet };
};
