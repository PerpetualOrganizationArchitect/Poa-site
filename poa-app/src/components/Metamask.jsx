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

      console.log("got here 1")

      const MMSDK = new MetaMaskSDK({
        dappMetadata: {
          name: "Perpetual Organization Architect",
          url: window.location.href,
        },
      });

      try{

      console.log("got here 2")
      await MMSDK.init();
      console.log("got here 3")
      const ethereum = MMSDK.getProvider();
      console.log("got here 4")
      setMetaMaskProvider(ethereum);
      console.log("got here 5")

      // Directly create the Ethers provider here, not in state
      const ethersProvider = new ethers.providers.Web3Provider(ethereum);
      console.log("got here 6")

      ethereum.request({ method: 'eth_accounts' })
        .then(accounts => handleAccountsChanged(accounts, ethersProvider))
        .catch(console.error);

      console.log("got here 7")

      ethereum.on('accountsChanged', (accounts) => handleAccountsChanged(accounts, ethersProvider));
      console.log("got here 8")}
      catch(e){
        console.log("error init",e)
      }
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
    console.log("got here 9.5")
    console.log("Accounts changed:", accounts);
    if (accounts.length > 0) {
      setAccounts(accounts);
      setAccountGraph(accounts[0]);

      // Use the provided ethersProvider directly
      console.log("got here 9")
      const signer = ethersProvider.getSigner(accounts[0]);
      console.log("got here 10")
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
      console.log("got here 11")
      const accounts = await metaMaskProvider.request({ method: 'eth_requestAccounts' });
      console.log("got here 12")
      handleAccountsChanged(accounts, ethersProvider);
      console.log("got here 13")
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  return { connectWallet, accounts, wallet };
};
