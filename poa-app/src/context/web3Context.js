// web3context 
import React, { createContext, useState, useReducer, useEffect, useContext, use } from 'react';

import { ethers, providers } from 'ethers';
import { useIPFScontext } from './ipfsContext';

import DirectDemocracyVoting from "../../abi/DirectDemocracyVoting.json";
import ParticipationVoting from "../../abi/ParticipationVoting.json";
import HybridVoting from "../../abi/HybridVoting.json";

import TaskManager from "../../abi/TaskManager.json";
import NFTMembership from "../../abi/NFTMembership.json";
import Treasury from "../../abi/Treasury.json";
import DirectDemocracyToken from '../../abi/DirectDemocracyToken.json';
import AccountManager from '../../abi/AccountManager.json';
import { useMetaMask } from '@/components/Metamask';
import NetworkSwitchModal from '@/components/NetworkSwitchModal';

import {
    useAccount
  } from "wagmi";
  
import { useEthersProvider, useEthersSigner } from '@/components/ProviderConverter';



const Web3Context = createContext();



export const useWeb3Context = () => {
    return useContext(Web3Context);
    }


export const Web3Provider = ({ children }) => {
    const [isNetworkModalOpen, setNetworkModalOpen] = useState(false);

    const [account, setAccount] = useState("0x00");

    const {address, chainId}= useAccount();
    const provider = useEthersProvider();
    const signer = useEthersSigner();

    useEffect(() => {
        console.log("provider: ", provider )
        console.log("address1: ", address)
    
        setAccount(address);
    }, [address]);

    
    const { addToIpfs, fetchFromIpfs } = useIPFScontext();
    

    
    const AccountManagerAddress = "0x66Ff0EF18bB3c0cAcB8be2B33fbb6553fF26B6F3";



    const getContractInstance = (contractAddress, contractABI) => {
        return new ethers.Contract(contractAddress, contractABI, signer);
    };

    const checkNetwork = () => {
        if (chainId !== 80002) {
          setNetworkModalOpen(true);
          return false;
        }
        return true;
      };

    const closeNetworkModal = () => {
        setNetworkModalOpen(false);
    };


    // Hybrid Voting

    async function createNewUser(username) {
        if (!checkNetwork()) {
            return;
          }
        const address = AccountManagerAddress;
        const contract = getContractInstance(address, AccountManager.abi);
        const tx = await contract.registerAccount(username);
    }

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
        if (!checkNetwork()) {
            return;
          }
        const contract = getContractInstance(contractAddress, DirectDemocracyVoting.abi);
        const tx = await contract.createProposal(proposalName, proposalDescription, proposalDuration, options, triggerSpendIndex, recieverAddress, amount, canSend);
        await tx.wait();
        console.log("Proposal created");
    }

    async function ddVote(contractAddress,proposalID, optionIndex) {
        if (!checkNetwork()) {
            return;
          }
        const voterAddress = account;
        const contract = getContractInstance(contractAddress, DirectDemocracyVoting.abi);
        const tx = await contract.vote(proposalID, voterAddress, optionIndex);
        await tx.wait();
        console.log("Voted");
    }

    async function getWinnerDDVoting(contractAddress, proposalID) {
        if (!checkNetwork()) {
            return;
          }
        const contract = getContractInstance(contractAddress, DirectDemocracyVoting.abi);
        const winner = await contract.announceWinner(proposalID);
        console.log("Winner: ", winner);
        return winner;
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
        if (!checkNetwork()) {
            return;
          }
        const contract = getContractInstance(contractAddress, TaskManager.abi);
        const tx = await contract.createProject(projectName);
        await tx.wait();
        console.log("Project created");
    }

    async function createTask(contractAddress,payout, taskDescription, projectName, estHours, difficulty, taskLocation, taskName) {
        if (!checkNetwork()) {
            return;
          }
        console.log("all params: ", payout, taskDescription, projectName, estHours, difficulty, taskLocation, taskName)
        let ipfsHash= await ipfsAddTask( taskName, taskDescription, taskLocation, difficulty, estHours, "");
        let ipfsHashString = ipfsHash.path;
        const contract = getContractInstance(contractAddress, TaskManager.abi);
        console.log("creating task")
        const tx = await contract.createTask(payout,ipfsHashString, projectName);
        await tx.wait();
        console.log("Task created");
    }
    

    async function claimTask(contractAddress, taskID) {
        if (!checkNetwork()) {
            return;
          }
        const contract = getContractInstance(contractAddress, TaskManager.abi);
        //taskid in formar of 0x0-0xaddress need to get before dash id
        const newTaskID = taskID.split("-")[0];
        console.log("newTaskID: ", newTaskID);



        const tx = await contract.claimTask(newTaskID);
        await tx.wait();
        console.log("Task claimed");
    }

    async function completeTask(contractAddress, taskID) {
        if (!checkNetwork()) {
            return;
          }
        const contract = getContractInstance(contractAddress, TaskManager.abi);
        const newTaskID = taskID.split("-")[0];
        const tx = await contract.completeTask(newTaskID);
        await tx.wait();
        console.log("Task completed");
    }

    async function updateTask(contractAddress, taskID, payout, ipfsHash) {
        if (!checkNetwork()) {
            return;
          }
        const contract = getContractInstance(contractAddress, TaskManager.abi);

        const newTaskID = taskID.split("-")[0];
        const tx = await contract.updateTask(newTaskID, payout, ipfsHash);
        await tx.wait();
        console.log("Task updated");
    }

    async function editTaskWeb3(contractAddress,payout, taskDescription, projectName, estHours, difficulty, taskLocation, taskName, taskID) {
        if (!checkNetwork()) {
            return;
          }
        console.log("all params: ", payout, taskDescription, projectName, estHours, difficulty, taskLocation, taskName)
        let ipfsHash= await ipfsAddTask( taskName, taskDescription, taskLocation, difficulty, estHours, "");
        let ipfsHashString = ipfsHash.path;

        const contract = getContractInstance(contractAddress, TaskManager.abi);

        let newTaskID = taskID.split("-")[0];


        const tx = await contract.updateTask(newTaskID, payout,ipfsHashString);
        await tx.wait();
    }


    // NFT Membership
    async function mintNFT(contractAddress, membershipType) {
        if (!checkNetwork()) {
            return;
          }
        const contract = getContractInstance(contractAddress, NFTMembership.abi);
        
        const tx = await contract.mintNFT(account, membershipType);
        await tx.wait();
        console.log("NFT minted");
    }

    async function mintDefaultNFT(contractAddress,) {
        if (!checkNetwork()) {
            return;
          }
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
        if (!checkNetwork()) {
            return;
          }
        const contract = getContractInstance(contractAddress, DirectDemocracyToken.abi);
        const tx = await contract.mint();
        await tx.wait();
        console.log("Tokens minted");
    }

    async function ipfsAddTask(taskName, taskDescription, taskLocation, difficulty, estHours, submission) {
        const data = {
            name: taskName,
            description: taskDescription,
            location: taskLocation,
            difficulty: difficulty,
            estHours: estHours,
            submission: submission,
        };
        const json = JSON.stringify(data);
        const ipfsHash = await addToIpfs(json);

        return ipfsHash;
    }

    
    return (
        <Web3Context.Provider value={{editTaskWeb3, signer, isNetworkModalOpen,
            closeNetworkModal, mintDDtokens, mintDefaultNFT, mintNFT, setAccount, ddVote,  getWinnerDDVoting, completeTask, ipfsAddTask, createTask, createProject, claimTask, ipfsAddTask, updateTask, createProposalDDVoting, createNewUser}}>
        {children}
        </Web3Context.Provider>
    );
    };
