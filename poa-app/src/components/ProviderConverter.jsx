import { providers } from 'ethers';
import { useMemo } from 'react';
import { useClient } from 'wagmi';
import { useConnectorClient } from 'wagmi';



export function clientToProvider(client) {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  
  if (transport.type === 'fallback') {
    return new providers.FallbackProvider(
      transport.transports.map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    );
  }
  return new providers.JsonRpcProvider(transport.url, network);
}

/** Hook to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({ chainId } = {}) {
  const client = useClient({ chainId });
  return useMemo(() => clientToProvider(client), [client]);
}


export function clientToSigner(client) {
    const { account, chain, transport } = client;
    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    };
  
    // Create a provider using Web3Provider and the transport network details
    const provider = new providers.Web3Provider(transport, network);
  
    // Return the signer instance associated with the given account
    return provider.getSigner(account.address);
  }
  
  /** Hook to convert a Viem Client to an ethers.js Signer. */
  export function useEthersSigner({ chainId } = {}) {
    // Use the wagmi `useConnectorClient` to get the client data
    const { data: client } = useConnectorClient({ chainId });
  
    // Use the client data to generate a signer if available
    return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
  }
