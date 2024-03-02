// web3context 
import React, { createContext, useReducer, useEffect, useContext } from 'react';


const Web3Context = createContext();

export const useWeb3Context = () => {
    return useContext(Web3Context);
    }


export const Web3Provider = ({ children }) => {
    const account ="0x06e6620C67255d308A466293070206176288A67B"

    
    return (
        <Web3Context.Provider value={{account}}>
        {children}
        </Web3Context.Provider>
    );
    };
