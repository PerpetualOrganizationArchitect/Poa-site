// useWeb3.js
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useMagic } from './MagicContext'; // Magic context hook
import { useEthersProvider, useEthersSigner } from '@/components/ProviderConverter'; // Wagmi hooks
import { useAccount } from 'wagmi'; // Get the Wagmi account

const useWeb3 = () => {
  const { magic } = useMagic(); // Access Magic SDK instance
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null); // Address of the connected account
  const [chainId, setChainId] = useState(null); // Chain ID of the connected network
  const ethersProvider = useEthersProvider(); // Provider from Wagmi
  const ethersSigner = useEthersSigner(); // Signer from Wagmi
  const { address: wagmiAddress } = useAccount(); // Wagmi account

  useEffect(() => {
    const initializeProvider = async () => {
      if (magic) {
        const isLoggedIn = await magic.user.isLoggedIn(); // Check if Magic is logged in
        if (isLoggedIn) {
          const magicProvider = new ethers.providers.Web3Provider(magic.rpcProvider);
          setProvider(magicProvider); // Set provider to Magic
          setSigner(magicProvider.getSigner()); // Set signer to Magic

          // Retrieve the Magic account and set the address
          const metadata = await magic.user.getMetadata();
          setAddress(metadata.publicAddress); // Set the Magic account
          
          // Retrieve the network and chainId from the provider
          const network = await magicProvider.getNetwork();
          setChainId(network.chainId); // Set the Magic chainId
        } else {
          // If Magic is not logged in, use Wagmi
          setProvider(ethersProvider);
          setSigner(ethersSigner);
          setAddress(wagmiAddress); // Use the Wagmi account

          // Retrieve the network and chainId from Wagmi provider
          if (ethersProvider) {
            const network = await ethersProvider.getNetwork();
            setChainId(network.chainId); // Set the Wagmi chainId
          }
        }
      } else {
        // If Magic is not available, fallback to Wagmi
        setProvider(ethersProvider);
        setSigner(ethersSigner);
        setAddress(wagmiAddress); // Use the Wagmi account

        // Retrieve the network and chainId from Wagmi provider
        if (ethersProvider) {
          const network = await ethersProvider.getNetwork();
          setChainId(network.chainId); // Set the Wagmi chainId
        }
      }
    };

    initializeProvider();
  }, [magic, ethersProvider, ethersSigner, wagmiAddress]);

  return { provider, signer, address, chainId }; // Return provider, signer, address, and chainId
};

export default useWeb3;
