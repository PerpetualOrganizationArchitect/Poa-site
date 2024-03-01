import {useState, useEffect } from 'react';
import { providers, JsonRpcBatchProvider, ethers } from 'ethers';

import DirectDemocracyVoting from "../../abi/DirectDemocracyVoting.json";
import PaticipationVoting from "../../abi/ParticipationVoting.json";
import TaskManager from "../../abi/TaskManager.json";


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

    async function createProposalPtVoting() {
        const contract = new ethers.Contract("0xf88514674946a2a8a970d957708fef4b9be3e410", PaticipationVoting.abi, signer);

        const options = ["Option 1", "Option 2", "Option 3"];
        const tx = await contract.createProposal("Test Proposal", "Test Description", 10, options, 1, "0x8c528f90ab80bd317bc2ddbd447adf7ad99b22a9", 10, true);
        await tx.wait();

        console.log("Proposal created");
    }
    async function createProject(){
        const contract = new ethers.Contract("0xf02852b08c594507A3255d7504FFC4928865ef2b", TaskManager.abi, signer);

        const tx = await contract.createProject("Project1");
        await tx.wait();

        console.log("Project created");
    }

    async function createTask(){
        const contract = new ethers.Contract("0xf02852b08c594507A3255d7504FFC4928865ef2b", TaskManager.abi, signer);

        const tx = await contract.createTask(10, "ipfshash", "Project1");
        await tx.wait();

        console.log("Task created");
    }

    async function claimTask(){
        const contract = new ethers.Contract("0xf02852b08c594507A3255d7504FFC4928865ef2b", TaskManager.abi, signer);

        const tx = await contract.claimTask(1);
        await tx.wait();

        console.log("Task claimed");
    }

    async function completeTask(){
        const contract = new ethers.Contract("0xf02852b08c594507A3255d7504FFC4928865ef2b", TaskManager.abi, signer);

        const tx = await contract.completeTask(0);
        await tx.wait();

        console.log("Task completed");
    }

    async function updateTask(){
        const contract = new ethers.Contract("0xf02852b08c594507A3255d7504FFC4928865ef2b", TaskManager.abi, signer);

        const tx = await contract.updateTask(2, 20, "ipfshash");
        await tx.wait();

        console.log("Task updated");
    }
    

    return (
        <div>
            <button onClick={createProposalDDVoting}>Create Proposal demcoracy</button>
            <button onClick={createProposalPtVoting}>Create Proposal Participatin</button>
            <button onClick={createProject}>Create Project</button>
            <button onClick={createTask}>Create Task</button>
            <button onClick={claimTask}>Claim Task</button>
            <button onClick={completeTask}>Complete Task</button>
            <button onClick={updateTask}>Update Task</button>
        </div>

    )
}

export default web3test;

