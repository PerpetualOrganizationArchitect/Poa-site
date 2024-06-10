import { create } from 'ipfs-http-client';
import { createContext, useContext, useState, useEffect } from 'react';

const IPFScontext = createContext();

export const useIPFScontext = () => {
    return useContext(IPFScontext);
}

export const IPFSprovider = ({children}) => {
    async function addToIpfs(content) {
        try {
            const addedData = await ipfs.add({ content });
            return addedData;
        } catch (error) {
            console.error("An error occurred while adding to IPFS:", error);
            throw error; 
        }
    }

    async function fetchFromIpfs(ipfsHash) {
        let stringData = '';
        for await (const chunk of ipfs.cat(ipfsHash)) {
            stringData += new TextDecoder().decode(chunk);
        }
        try {
            return JSON.parse(stringData);
        } catch (error) {
            console.error("Error parsing JSON from IPFS:", error, "stringData:", stringData);
            throw error;
        }
    }
    
    const ipfs = create({
        host: 'api.thegraph.com',
        port: 443,
        protocol: 'https',
        apiPath: '/ipfs/api/v0' 
    });

    return (
        <IPFScontext.Provider value={{
            ipfs,
            fetchFromIpfs,
            addToIpfs,
        }}>
            {children}
        </IPFScontext.Provider>
    );
}
