import {useState, useEffect } from 'react';
import { providers, JsonRpcBatchProvider, ethers } from 'ethers';
import {Button, tokenToCSSVar} from "@chakra-ui/react";

import DirectDemocracyVoting from "../../abi/DirectDemocracyVoting.json";
import ParticipationVoting from "../../abi/ParticipationVoting.json";
import HybridVoting from "../../abi/HybridVoting.json";

import TaskManager from "../../abi/TaskManager.json";
import NFTMembership from "../../abi/NFTMembership.json";
import Treasury from "../../abi/Treasury.json";
import DirectDemocracyToken from '../../abi/DirectDemocracyToken.json';

import { useIPFScontext } from '@/context/ipfsContext';
import { task } from 'hardhat/config';




const web3test = () => {

    const { addToIpfs, fetchFromIpfs } = useIPFScontext();

    const [account, setAccount] = useState("");
    

    const [providerUniversal, setProviderUniversal] = useState(new providers.StaticJsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL));
    const [signer, setSigner] = useState(new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, providerUniversal));

    const ddVotingAddress = "0xe193ef132bc89b004cf7557493d83abcd218ad10";
    const ptVotingAddress = "0x10f1677c1c66a9b4bb46ffdad8decc8778368305";
    const taskManagerAddress = "0xf02852b08c594507A3255d7504FFC4928865ef2b";
    const hybridVotingAddress = "0x8c528f90ab80bd317bc2ddbd447adf7ad99b22a9";


    const getContractInstance = (contractAddress, contractABI) => {
        return new ethers.Contract(contractAddress, contractABI, signer);
    };

    // Hybrid Voting

    async function createProposalHybridVoting(contractAddress, proposalName, proposalDescription, proposalDuration, options, recieverAddress, triggerSpendIndex, amount, canSend) {
        const contract = getContractInstance(contractAddress, HybridVoting.abi);
        const tx = await contract.createProposal(proposalName, proposalDescription, proposalDuration, options, recieverAddress, triggerSpendIndex, amount, canSend);
        await tx.wait();
        console.log("Proposal created");
    }

    async function hybridVote(contractAddress, proposalID, voterAddress, optionIndex) {
        const contract = getContractInstance(contractAddress, HybridVoting.abi);
        const tx = await contract.vote(proposalID, voterAddress, optionIndex);
        await tx.wait();
        console.log("Voted");
    }


    // DD Voting
    async function createProposalDDVoting(contractAddress, proposalName, proposalDescription, proposalDuration, options, triggerSpendIndex, recieverAddress, amount, canSend) {
        const contract = getContractInstance(contractAddress, DirectDemocracyVoting.abi);
        const tx = await contract.createProposal(proposalName, proposalDescription, proposalDuration, options, triggerSpendIndex, recieverAddress, amount, canSend);
        await tx.wait();
        console.log("Proposal created");
    }

    async function ddVote(contractAddress,proposalID, voterAddress, optionIndex) {
        const contract = getContractInstance(contractAddress, DirectDemocracyVoting.abi);
        const tx = await contract.vote(proposalID, voterAddress, optionIndex);
        await tx.wait();
        console.log("Voted");
    }

    // PT Voting
    async function createProposalPtVoting(contractAddress, proposalName, proposalDescription, proposalDuration, options, triggerSpend, recieverAddress, amount, canSend) {
        const contract = getContractInstance(contractAddress, ParticipationVoting.abi);
        const tx = await contract.createProposal(proposalName, proposalDescription, proposalDuration, options, triggerSpend, recieverAddress, amount, canSend);
        await tx.wait();
        console.log("Proposal created");
    }

    async function PtVote(contractAddress, proposalID, voterAddress, optionIndex) {
        const contract = getContractInstance(contractAddress, ParticipationVoting.abi);
        const tx = await contract.vote(proposalID, voterAddress, optionIndex);
        await tx.wait();
        console.log("Voted");
    }

    // Task Manager
    async function createProject(contractAddress, projectName) {
        const contract = getContractInstance(contractAddress, TaskManager.abi);
        const tx = await contract.createProject(projectName);
        await tx.wait();
        console.log("Project created");
    }

    async function createTask(contractAddress,payout, ipfsHash, projectName) {
        const contract = getContractInstance(contractAddress, TaskManager.abi);
        const tx = await contract.createTask(payout, ipfsHash, projectName);
        await tx.wait();
        console.log("Task created");
    }

    async function claimTask(contractAddress, taskID) {
        const contract = getContractInstance(contractAddress, TaskManager.abi);
        const tx = await contract.claimTask(taskID);
        await tx.wait();
        console.log("Task claimed");
    }

    async function completeTask(contractAddress, taskID) {
        const contract = getContractInstance(contractAddress, TaskManager.abi);
        const tx = await contract.completeTask(taskID);
        await tx.wait();
        console.log("Task completed");
    }

    async function updateTask(contractAddress, taskID, payout, ipfsHash) {
        const contract = getContractInstance(contractAddress, TaskManager.abi);
        const tx = await contract.updateTask(taskID, payout, ipfsHash);
        await tx.wait();
        console.log("Task updated");
    }

    // NFT Membership
    async function mintNFT(contractAddress, toAddress, membershipType) {
        const contract = getContractInstance(contractAddress, NFTMembership.abi);
        const tx = await contract.mintNFT(toAddress, membershipType);
        await tx.wait();
        console.log("NFT minted");
    }

    async function mintDefaultNFT(contractAddress,) {
        const contract = getContractInstance(contractAddress, NFTMembership.abi);
        const tx = await contract.mintDefaultNFT();
        await tx.wait();
        console.log("Default NFT minted");
    }

    async function updateNFT(contractAddress, userAddress, membershipType) {
        const contract = getContractInstance(contractAddress, NFTMembership.abi);
        const tx = await contract.changeMembershipType(userAddress, membershipType);
        await tx.wait();
        console.log("NFT updated");
    }

    async function setImageURL(contractAddress,memberTypeName, imageURL) {
        const contract = getContractInstance(contractAddress, NFTMembership.abi);
        const tx = await contract.setMemberTypeImage(memberTypeName, imageURL);
        await tx.wait();
        console.log("Image URL updated");
    }

    // Treasury 
    async function transferFunds(contractAddress, tokenAddress, amount) {
        const contract = getContractInstance(contractAddress, Treasury.abi);
        const tx = await contract.recieveTokens(tokenAddress, amount);
        await tx.wait();
        console.log("Funds transferred");
    }

    // dd token 
    async function mintDDtokens(contractAddress) {
        const contract = getContractInstance(contractAddress, DirectDemocracyToken.abi);
        const tx = await contract.mint();
        await tx.wait();
        console.log("Tokens minted");
    }

    async function ipfsAddTest() {
        const data = "Hello World";
        const ipfsHash = await addToIpfs(data);
        console.log("IPFS hash:", ipfsHash);
    }

    async function ipfsAddTask(taskName, taskDescription, taskLocation) {
        const data = {
            name: taskName,
            description: taskDescription,
            location: taskLocation
        };
        const json = JSON.stringify(data);
        const ipfsHash = await addToIpfs(json);
        console.log("IPFS hash:", ipfsHash);
    }

    return (
        <div>
            <Button onClick={ipfsAddTest}>IPFS add test</Button>
            <Button onClick={ipfsAddTask}>IPFS add task</Button>
        </div>
    )



}

export default web3test;

