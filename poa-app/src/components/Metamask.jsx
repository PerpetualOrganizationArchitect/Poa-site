// import { useEffect, useState } from 'react';
// import { MetaMaskSDK } from "@metamask/sdk";
// import { ethers } from 'ethers';
// import { useGraphContext } from '@/context/graphContext';
// import { useWeb3Context } from '@/context/web3Context';

// export const useMetaMask = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [metaMaskProvider, setMetaMaskProvider] = useState(null);
//   const [wallet, setWallet] = useState(null);
//   const { setAccountGraph } = useGraphContext();
//   const { setSigner, setAccount } = useWeb3Context();
//   const [checked, setChecked] = useState(true);
//   const [force, setForce] = useState(false);


//   const init = async () => {


//     if (!window.ethereum) {
//       if(checked && !force) {
//         console.log("No accounts found. Please ensure you are connected to a wallet.");
//         return;
//       }




//       console.log("MetaMask not detected. Please install MetaMask.");
//       const MMSDK1 = new MetaMaskSDK({
//         dappMetadata: {
//           name: "Perpetual Organization Architect",
//           url: "https://poa.on-fleek.app",
//         },
//       });

  
//       console.log("got here 2")
//       await MMSDK1.init();
//       console.log("got here 3")
//       const ethereum = MMSDK1.getProvider();
//       console.log("got here 4")
//       setMetaMaskProvider(ethereum);




//       const ethersProvider = new ethers.providers.Web3Provider(ethereum);
      
//      ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
//       console.log("eth_accounts resolved:", accounts);
//       if(accounts && accounts.length > 0) {
//         handleAccountsChanged(accounts, ethersProvider);
//       } else {
//         console.log("No accounts found. Please ensure you are connected to a wallet.");
     
//       }
//     })
//     .catch(error => {
//       console.error("eth_accounts error:", error);
      
//     });

//     console.log("got here 7")
  
//   ethereum.on('accountsChanged', (accounts) => {
//     console.log("accountsChanged event triggered:", accounts);
//     if(accounts && accounts.length > 0) {
//       handleAccountsChanged(accounts, ethersProvider);
//     } else {
//       console.log("The account has been disconnected. Please reconnect your wallet.");
//       // Handle the scenario of an account disconnecting, if necessary.
//     }
//   });

      
//     }

//     // start 

//     // Directly create the Ethers provider here, not in state


//     const accounts = await window.ethereum.request({ method: 'eth_accounts' });

//     if(checked && accounts.length == 0 && !force) {
//       console.log("No accounts found. Please ensure you are connected to a wallet.");
//       return;
//     }

    




//     const MMSDK = new MetaMaskSDK({
//       dappMetadata: {
//         name: "Perpetual Organization Architect",
//         url: "https://poa.on-fleek.app",
//       },
//     });

//     try{

//     console.log("got here 2")
//     await MMSDK.init();
//     console.log("got here 3")
//     const ethereum = MMSDK.getProvider();
//     console.log("got here 4")
//     setMetaMaskProvider(ethereum);
//     console.log("got here 5")

//     const ethersProvider = new ethers.providers.Web3Provider(ethereum);
//     console.log("got here 6")

//     ethereum.request({ method: 'eth_requestAccounts' })
//     .then(accounts => {
//       console.log("eth_accounts resolved:", accounts);
//       if(accounts && accounts.length > 0) {
//         handleAccountsChanged(accounts, ethersProvider);
//       } else {
//         console.log("No accounts found. Please ensure you are connected to a wallet.");
     
//       }
//     })
//     .catch(error => {
//       console.error("aaaeth_accounts error:", error);
//       return;
      
//     });

//     console.log("got here 7")
  
//   ethereum.on('accountsChanged', (accounts) => {
//     console.log("accountsChanged event triggered:", accounts);
//     if(accounts && accounts.length > 0) {
//       handleAccountsChanged(accounts, ethersProvider);
//     } else {
//       console.log("The account has been disconnected. Please reconnect your wallet.");
//       // Handle the scenario of an account disconnecting, if necessary.
//     }
//   });
  



//     console.log("got here 8")}
//     catch(e){
//       console.log("error init",e)
//     }
//   };

//   useEffect(() => {
//     console.log("MetaMask hook initialized");
    

//     init();

//     return () => {
//       if (metaMaskProvider) {
//         console.log("Removing MetaMask event listeners");
//         metaMaskProvider.removeListener('accountsChanged', handleAccountsChanged);
//       }
//     };
//   }, [checked]);

//   const handleAccountsChanged = (accounts, ethersProvider) => {
//     console.log("got here 9.5")
//     console.log("Accounts changed:", accounts);
//     if (accounts.length > 0) {
//       setAccount(accounts[0]);
//       setAccounts(accounts);
//       setAccountGraph(accounts[0]);

//       // Use the provided ethersProvider directly
//       console.log("got here 9")
//       const signer = ethersProvider.getSigner(accounts[0]);
//       console.log("got here 10")
//       setSigner(signer); // Store the ethers signer as the "wallet"
//       console.log("Connected to MetaMask with account:", accounts[0]);
//       setChecked(true);
//     } else {
//       console.log("Disconnected from MetaMask");
//       setAccount("0x00");
//       setAccountGraph(null);
//       setAccounts([]);
//       setWallet(null);
//       setSigner(null);
//     }
//   };

//   const connectWallet = async () => {
//     console.log("Connecting to MetaMask...");


//     try {
//       // create metamask provider
//       const MMSDK = new MetaMaskSDK({
//         dappMetadata: {
//           name: "Perpetual Organization Architect",
//           url: "https://poa.on-fleek.app",
//         },
//       });

//       console.log("got here 1")
//       await MMSDK.init();
//       console.log("got here 2")
//       const metaMaskProvider = MMSDK.getProvider();
//       console.log("got here 3")

//       console.log("got here 11")
//       const accounts = await metaMaskProvider.request({ method: 'eth_requestAccounts' });
//       console.log("got here 12")
//       handleAccountsChanged(accounts, ethersProvider);
//       console.log("got here 13")
//     } catch (error) {
      
//       console.error("Error connecting to MetaMask:", error);
//     }
//   };

//   return {setForce, setChecked, connectWallet, accounts, wallet };
// };
