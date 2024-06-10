import { create } from 'ipfs-http-client';
import { createContext, useContext } from 'react';

const IPFScontext = createContext();

export const useIPFScontext = () => {
    return useContext(IPFScontext);
}

export const IPFSprovider = ({children}) => {
    // Setup Infura IPFS client for fetch operations
    const auth = 'Basic ' + Buffer.from(process.env.NEXT_PUBLIC_INFURA_PROJECTID + ':' + process.env.NEXT_PUBLIC_INFURA_IPFS).toString('base64');
    const fetchIpfs = create({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        apiPath: '/api/v0',
        headers: {
            authorization: auth,
        },
    });

    // Setup The Graph IPFS client for add operations
    const addIpfs = create({
        host: 'api.thegraph.com',
        port: 443,
        protocol: 'https',
        apiPath: '/ipfs/api/v0'
    });

    async function addToIpfs(content) {
        try {
            const addedData = await addIpfs.add({ content });
            return addedData;
        } catch (error) {
            console.error("An error occurred while adding to IPFS via The Graph:", error);
            throw error; 
        }
    }

    async function fetchFromIpfs(ipfsHash) {
        let stringData = '';
        for await (const chunk of fetchIpfs.cat(ipfsHash)) {
            stringData += new TextDecoder().decode(chunk);
        }
        try {
            return JSON.parse(stringData);
        } catch (error) {
            console.error("Error parsing JSON from IPFS via Infura:", error, "stringData:", stringData);
            throw error;
        }
    }

    async function fetchImageFromIpfs(ipfsHash) {
        console.log("fetching image from IPFS", ipfsHash);
        let binaryData = [];
        for await (const chunk of fetchIpfs.cat(ipfsHash)) {
            binaryData.push(chunk);
        }
        try {
            const blob = new Blob(binaryData, { type: 'image/png' });  // Adjust MIME type as needed
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error("Error creating blob from IPFS data:", error);
            throw error;
        }
    }

    return (
        <IPFScontext.Provider value={{
            fetchFromIpfs,
            fetchImageFromIpfs,
            addToIpfs,
        }}>
            {children}
        </IPFScontext.Provider>
    );
}
