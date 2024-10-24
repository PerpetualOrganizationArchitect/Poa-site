// useWeb3.js
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useMagic } from './magicContext'; // Magic context hook
import { useEthersProvider, useEthersSigner } from '@/components/ProviderConverter'; // Wagmi hooks

const useWeb3 = () => {
  const { magic } = useMagic(); // Access Magic SDK instance
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const ethersProvider = useEthersProvider(); // Provider from Wagmi
  const ethersSigner = useEthersSigner(); // Signer from Wagmi

  useEffect(() => {
    const initializeProvider = async () => {
      if (magic) {
        const isLoggedIn = await magic.user.isLoggedIn(); // Check if Magic is logged in
        if (isLoggedIn) {
          const magicProvider = new ethers.providers.Web3Provider(magic.rpcProvider);
          setProvider(magicProvider); // Set provider to Magic
          setSigner(magicProvider.getSigner()); // Set signer to Magic
        } else {
          // Fallback to Wagmi if Magic is not logged in
          setProvider(ethersProvider);
          setSigner(ethersSigner);
        }
      } else {
        // Fallback to Wagmi if Magic is not available
        setProvider(ethersProvider);
        setSigner(ethersSigner);
      }
    };

    initializeProvider();
  }, [magic, ethersProvider, ethersSigner]);

  return { provider, signer };
};

export default useWeb3;
