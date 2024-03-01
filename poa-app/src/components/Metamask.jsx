// hooks/useMetaMask.js
import { useEffect, useState } from 'react';
import { MetaMaskSDK } from "@metamask/sdk";

export const useMetaMask = () => {
  const [accounts, setAccounts] = useState([]);
  const [ethereum, setEthereum] = useState(null);

  useEffect(() => {
    const init = async () => {
        const MMSDK = new MetaMaskSDK({
        dappMetadata: {
            name: "Example Next.js Dapp",
            url: window.location.href,
        },
        });

        await MMSDK.init()

        const ethereum = MMSDK.getProvider();
        setEthereum(ethereum);

        ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
            if (accounts.length > 0) {
            setAccounts(accounts);
            }
        })
        .catch(error => console.error(error));
    }

    init();
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setAccounts(accounts);
    } catch (error) {
      console.error(error);
    }
  };

  return { connectWallet, accounts };
};
