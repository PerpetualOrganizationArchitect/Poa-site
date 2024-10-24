import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Magic } from 'magic-sdk'; 

const MagicContext = createContext({
  magic: null, 
});

// Custom hook to use Magic
export const useMagic = () => useContext(MagicContext);

export const MagicProvider = ({ children }) => {
  const [magic, setMagic] = useState(null);

  useEffect(() => {
    // Initialize Magic only if API key is present
    if (process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
      const magicInstance = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY, {
        network: {
          rpcUrl: 'https://rpc2.sepolia.org/', 
          chainId: 11155111, 
        },
      });

      setMagic(magicInstance);
    }
  }, []);

  // Memoize the context value to avoid unnecessary re-renders
  const value = useMemo(() => {
    return { magic };
  }, [magic]);

  
  return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>;
};


