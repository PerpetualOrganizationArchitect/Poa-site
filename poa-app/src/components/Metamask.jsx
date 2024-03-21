import { useEffect, useState } from 'react';
import { MetaMaskSDK } from "@metamask/sdk";
import { useGraphContext } from '@/context/graphContext';

export const useMetaMask = () => {
  const [accounts, setAccounts] = useState([]);
  const [ethereum, setEthereum] = useState(null);
  const { setAccountGraph } = useGraphContext();

  useEffect(() => {
    const init = async () => {
      const MMSDK = new MetaMaskSDK({
        dappMetadata: {
          name: "Example Next.js Dapp",
          url: window.location.href,
        },
      });

      await MMSDK.init();
      const ethereum = MMSDK.getProvider();
      setEthereum(ethereum);

      // Request initially available accounts
      ethereum.request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch(console.error);

      // Event listener for account changes
      ethereum.on('accountsChanged', handleAccountsChanged);

      // Event listener for chain changes (re-initialize if needed)
      ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      });
    };

    init();

    // Cleanup function to remove event listeners
    return () => {
      if (ethereum) {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', () => window.location.reload());
      }
    };
  }, []);

  // Handler for accounts change
  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      setAccounts(accounts);
      setAccountGraph(accounts[0]);
      console.log("Account", accounts[0]);
    } else {
      // Handle case where user has locked/disconnected their MetaMask
      setAccounts([]);
      setAccountGraph(null); // Adjust according to your app's logic
    }
  };

  const connectWallet = async () => {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      handleAccountsChanged(accounts);
    } catch (error) {
      console.error(error);
    }
  };

  return { connectWallet, accounts };
};
