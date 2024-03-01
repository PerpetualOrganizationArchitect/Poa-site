import {useState, useEffect } from 'react';
import { providers, JsonRpcBatchProvider, ethers } from 'ethers';

import DirectDemocracyVoting from "../../abi/DirectDemocracyVoting.json";


const web3test = () => {

    const [account, setAccount] = useState("");
    

    const [providerUniversal, setProviderUniversal] = useState(new providers.StaticJsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL));
    const [signer, setSigner] = useState(new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, providerUniversal));

    async function createProposalDDVoting() {
        const contract = new ethers.Contract("0x8c528f90ab80bd317bc2ddbd447adf7ad99b22a9", DirectDemocracyVoting.abi, signer);

        // option names
        const options = ["Option 1", "Option 2", "Option 3"];
        const tx = await contract.createProposal("Test Proposal", "Test Description", 10, options, 1, "0x8c528f90ab80bd317bc2ddbd447adf7ad99b22a9", 10, true);
        await tx.wait();

        console.log("Proposal created");

    }

    return (
        <div>
            <button onClick={createProposalDDVoting}>Create Proposal</button>
        </div>
    )
}

export default web3test;

