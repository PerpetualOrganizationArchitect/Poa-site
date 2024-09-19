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
import QuickJoin from '../../abi/QuickJoin.json';
import EducationHub from '../../abi/EducationHub.json';

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

    const gasOptions = {
        gasLimit: 100000, // Example gas limit
        gasPrice: ethers.utils.parseUnits('51', 'gwei'), 
    };

    useEffect(() => {
        console.log("provider: ", provider )
        console.log("address1: ", address)
    
        setAccount(address);
    }, [address]);

    
    const { addToIpfs, fetchFromIpfs } = useIPFScontext();

    const AccountManagerAddress = "0x695f1FfB4A4Fc1BAEB322943DcEf3349fA47f748";

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


    

    async function createNewUser(username) {
        if (!checkNetwork()) {
            return;
          }
        const address = AccountManagerAddress;
        const contract = getContractInstance(address, AccountManager.abi);
        const tx = await contract.registerAccount(username, gasOptions);
    }

    async function changeUsername(username) {
        if (!checkNetwork()) {
            return;
          }
        const address = AccountManagerAddress;
        const contract = getContractInstance(address, AccountManager.abi);
        const tx = await contract.changeUsername(username, gasOptions);
    }


    // Hybrid Voting

    async function createProposalHybridVoting(contractAddress, proposalName, proposalDescription, proposalDuration, options, recieverAddress, triggerSpendIndex, amount, canSend) {
        const contract = getContractInstance(contractAddress, HybridVoting.abi);
        const tx = await contract.createProposal(proposalName, proposalDescription, proposalDuration, options, recieverAddress, triggerSpendIndex, amount, canSend, gasOptions);
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
    
        let tokenAddress = "0x0000000000000000000000000000000000001010";
        
    
        // convert amount to wei
        let amountConverted = ethers.utils.parseUnits(amount, 18);
        
        // log the converted amount
        console.log("amountConverted: ", amountConverted, "Type: ", typeof amountConverted);
        
        const contract = getContractInstance(contractAddress, DirectDemocracyVoting.abi);
        const tx = await contract.createProposal(
            proposalName,
            proposalDescription,
            proposalDuration,
            options,
            triggerSpendIndex,
            recieverAddress,
            amountConverted,
            canSend,
            tokenAddress,
            gasOptions
        );
        await tx.wait();
        console.log("Proposal created");
    }
    

    async function ddVote(contractAddress,proposalID, optionIndex) {
        if (!checkNetwork()) {
            return;
          }
        const voterAddress = account;
        const contract = getContractInstance(contractAddress, DirectDemocracyVoting.abi);
        const tx = await contract.vote(proposalID, voterAddress, optionIndex, gasOptions);
        await tx.wait();
        console.log("Voted");
    }

    async function getWinnerDDVoting(contractAddress, proposalID) {
        if (!checkNetwork()) {
            return;
          }
        const contract = getContractInstance(contractAddress, DirectDemocracyVoting.abi);
        const winner = await contract.announceWinner(proposalID, gasOptions);
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
        const tx = await contract.createProject(projectName, gasOptions);
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
        const tx = await contract.createTask(payout,ipfsHashString, projectName, gasOptions);
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



        const tx = await contract.claimTask(newTaskID, gasOptions);
        await tx.wait();
        console.log("Task claimed");
    }

    async function completeTask(contractAddress, taskID) {
        if (!checkNetwork()) {
            return;
          }
        const contract = getContractInstance(contractAddress, TaskManager.abi);
        const newTaskID = taskID.split("-")[0];
        const tx = await contract.completeTask(newTaskID, gasOptions);
        await tx.wait();
        console.log("Task completed");
    }

    async function updateTask(contractAddress, taskID, payout, ipfsHash) {
        if (!checkNetwork()) {
            return;
          }
        const contract = getContractInstance(contractAddress, TaskManager.abi);

        const newTaskID = taskID.split("-")[0];
        const tx = await contract.updateTask(newTaskID, payout, ipfsHash, gasOptions);
        await tx.wait();
        console.log("Task updated");
    }
    
    async function submitTask(contractAddress, taskID, ipfsHash) {
        if (!checkNetwork()) {
            return;
          }
        const contract = getContractInstance(contractAddress, TaskManager.abi);
        const newTaskID = taskID.split("-")[0];
        const tx = await contract.submitTask(newTaskID, ipfsHash, gasOptions);
        await tx.wait();
        console.log("Task submitted");
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


        const tx = await contract.updateTask(newTaskID, payout,ipfsHashString, gasOptions);
        await tx.wait();
    }


    // NFT Membership

    async function checkIsExecutive(contractAddress, userAddress) {
        if (!checkNetwork()) {
            return;
        }

        console.log("contract address", contractAddress);
    
        const contract = getContractInstance(contractAddress, NFTMembership.abi);
        try {
            const isExec = await contract.checkIsExecutive(userAddress, gasOptions);
            console.log(`Is ${userAddress} an executive?`, isExec);
            return isExec;
        } catch (error) {
            console.error("Error checking executive status:", error);
            return false; // default return value if there's an error
        }
    }
    

    async function mintNFT(contractAddress, membershipType) {
        if (!checkNetwork()) {
            return;
          }
        const contract = getContractInstance(contractAddress, NFTMembership.abi);
        
        const tx = await contract.mintNFT(account, membershipType, gasOptions);
        await tx.wait();
        console.log("NFT minted");
    }

    async function mintDefaultNFT(contractAddress,) {
        if (!checkNetwork()) {
            return;
          }
        const contract = getContractInstance(contractAddress, NFTMembership.abi);
        const tx = await contract.mintDefaultNFT(gasOptions);
        await tx.wait();
        console.log("Default NFT minted");
    }

    async function updateNFT(contractAddress, userAddress, membershipType) {
        const contract = getContractInstance(contractAddress, NFTMembership.abi);
        const tx = await contract.changeMembershipType(userAddress, membershipType, gasOptions);
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
        const tx = await contract.mint(gasOptions);
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

    // treasury

    async function sendToTreasury(contractAddress, tokenAddress, amount) {
        try {

            const contract = getContractInstance(contractAddress, Treasury.abi);
            
    
            const tx = await contract.receiveTokens(tokenAddress, account, amount, {
                gasLimit: ethers.utils.hexlify(20000000) // Adjust the gas limit as needed
            });
            await tx.wait();
            console.log("Tokens sent to treasury");
        } catch (error) {
            console.error("Error sending tokens to treasury:", error);
        }
    }

    // quick join

    async function quickJoinNoUser(contractAddress, username) {
        console.log("username: ", username);
        console.log("contractAddress: ", contractAddress);
        if (!checkNetwork()) {
            return;
          }

        try {
            const contract = getContractInstance(contractAddress, QuickJoin.abi);
            const tx= await contract.quickJoinNoUser(username, gasOptions);
            await tx.wait();
            console.log("User joined with new username ");
        }
        catch (error) {
            console.error("Error joining with new username:", error);
        }

    }

    async function quickJoinWithUser(contractAddress) {
        if (!checkNetwork()) {
            return;
          }

        try {
            const contract = getContractInstance(contractAddress, QuickJoin.abi);
            const tx= await contract.quickJoinWithUser(gasOptions);
            await tx.wait();
            console.log("User joined with existing username ");
        }
        catch (error) {
            console.error("Error joining with existing username:", error);
        }

    }

    // education hub 


    async function createEduModule(contractAddress, moduleTitle, moduleDescription, payout, answers, correctAnswer) {

        if (!checkNetwork()) {
            return;
          }
        
        const contract = getContractInstance(contractAddress, EducationHub.abi);

        const data =({
            title: moduleTitle,
            description: moduleDescription,
            answers: answers,

        });

        const ipfsHash = await addToIpfs(JSON.stringify(data));



        //find correct answer index

        let correctAnswerIndex = answers.indexOf(correctAnswer);

        // log all deployment params 
        console.log("moduleTitle: ", moduleTitle);
        console.log("ipfsHash: ", ipfsHash.path);
        console.log("payout: ", payout);
        console.log("correctAnswerIndex: ", correctAnswerIndex);

        const nftMembershipAddress = await contract.nftMembership();
        console.log("NFT Membership Address:", nftMembershipAddress);

        try {
            const tx = await contract.createModule(moduleTitle, ipfsHash.path, payout, correctAnswerIndex, {gasLimit: ethers.utils.hexlify(8000000),
                gasPrice: ethers.utils.parseUnits("51", "gwei")
            });
            await tx.wait();
          } catch (error) {
            if (error.error && error.error.message) {
              console.log("Revert reason:", error.error.message);
            } else {
              console.log("Error:", error);
            }
          }
          
        console.log("Module created");
    }

    async function submitEduModule(contractAddress, moduleID, answer) {
        if (!checkNetwork()) {
            return;
          }
        const contract = getContractInstance(contractAddress, EducationHub.abi);
        const tx = await contract.completeModule(moduleID, answer, gasOptions);
        await tx.wait();
        console.log("Module submitted");
    }
    

    
    return (
        <Web3Context.Provider value={{address, chainId,quickJoinNoUser, quickJoinWithUser, sendToTreasury,changeUsername, submitTask, editTaskWeb3, signer, isNetworkModalOpen,
            closeNetworkModal, mintDDtokens, mintDefaultNFT, mintNFT, setAccount, ddVote,  getWinnerDDVoting, completeTask, ipfsAddTask, createTask, createProject, claimTask, ipfsAddTask, updateTask, createProposalDDVoting, createNewUser, createEduModule, checkIsExecutive}}>
        {children}
        </Web3Context.Provider>
    );
    };
