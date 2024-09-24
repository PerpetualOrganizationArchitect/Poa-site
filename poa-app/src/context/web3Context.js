// web3context.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
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

import { useAccount } from "wagmi";
import { useEthersProvider, useEthersSigner } from '@/components/ProviderConverter';

const Web3Context = createContext();

export const useWeb3Context = () => {
    return useContext(Web3Context);
}

export const Web3Provider = ({ children }) => {
    const [isNetworkModalOpen, setNetworkModalOpen] = useState(false);
    const [account, setAccount] = useState("0x00");

    const { address, chainId } = useAccount();
    const provider = useEthersProvider();
    const signer = useEthersSigner();

    // Define a uniform gas price of 40 Gwei
    const GAS_PRICE = ethers.utils.parseUnits('40', 'gwei');

    useEffect(() => {
        console.log("provider: ", provider);
        console.log("address1: ", address);

        setAccount(address);
    }, [address]);

    const { addToIpfs, fetchFromIpfs } = useIPFScontext();

    const AccountManagerAddress = "0x2347046e7D8Bde6B6dCF1C493F0c0AC2406be93f";

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

    // Helper function to estimate gas and return gas options
    const getGasOptions = async (contractMethod, args = []) => {
        try {
            const gasEstimate = await contractMethod(...args).then(tx => tx.estimateGas());
            const gasLimit = gasEstimate.mul(120).div(100); // Add 20% buffer
            return {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };
        } catch (error) {
            console.error("Gas estimation failed:", error);
            // Set a default gas limit if estimation fails
            return {
                gasLimit: ethers.utils.hexlify(800000), // Default gas limit
                gasPrice: GAS_PRICE,
            };
        }
    };

    // Corrected function with proper gas estimation
    async function createNewUser(username) {
        if (!checkNetwork()) {
            return;
        }
        const address = AccountManagerAddress;
        const contract = getContractInstance(address, AccountManager.abi);

        try {
            // Estimate gas
            const gasEstimate = await contract.estimateGas.registerAccount(username);
            const gasLimit = gasEstimate.mul(120).div(100); // Add 20% buffer
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.registerAccount(username, gasOptions);
            await tx.wait();
            console.log("User registered");
        } catch (error) {
            console.error("Error creating new user:", error);
        }
    }

    async function changeUsername(username) {
        if (!checkNetwork()) {
            return;
        }
        const address = AccountManagerAddress;
        const contract = getContractInstance(address, AccountManager.abi);

        try {
            // Estimate gas
            const gasEstimate = await contract.estimateGas.changeUsername(username);
            const gasLimit = gasEstimate.mul(120).div(100); // Add 20% buffer
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.changeUsername(username, gasOptions);
            await tx.wait();
            console.log("Username changed");
        } catch (error) {
            console.error("Error changing username:", error);
        }
    }

    // Hybrid Voting
    async function createProposalHybridVoting(contractAddress, proposalName, proposalDescription, proposalDuration, options, receiverAddress, triggerSpendIndex, amount, canSend) {
        const contract = getContractInstance(contractAddress, HybridVoting.abi);

        try {
            // Estimate gas
            const gasEstimate = await contract.estimateGas.createProposal(
                proposalName,
                proposalDescription,
                proposalDuration,
                options,
                receiverAddress,
                triggerSpendIndex,
                amount,
                canSend
            );
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.createProposal(
                proposalName,
                proposalDescription,
                proposalDuration,
                options,
                receiverAddress,
                triggerSpendIndex,
                amount,
                canSend,
                gasOptions
            );
            await tx.wait();
            console.log("Hybrid proposal created");
        } catch (error) {
            console.error("Error creating hybrid proposal:", error);
        }
    }

    async function hybridVote(contractAddress, proposalID, voterAddress, optionIndex) {
        const contract = getContractInstance(contractAddress, HybridVoting.abi);

        try {
            const gasEstimate = await contract.estimateGas.vote(proposalID, voterAddress, optionIndex);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.vote(proposalID, voterAddress, optionIndex, gasOptions);
            await tx.wait();
            console.log("Voted in hybrid voting");
        } catch (error) {
            console.error("Error voting in hybrid voting:", error);
        }
    }

    // DD Voting
    async function createProposalDDVoting(contractAddress, proposalName, proposalDescription, proposalDuration, options, triggerSpendIndex, receiverAddress, amount, canSend, electionEnabled = false,
        candidateAddresses = [],
        candidateNames = []) {
        console.log("contractAddress:", contractAddress);
        console.log("proposalName:", proposalName);
        if (!checkNetwork()) {
            return;
        }

        let tokenAddress = "0x0000000000000000000000000000000000001010";
        let amountConverted = ethers.utils.parseUnits(amount, 18);
        const contract = getContractInstance(contractAddress, DirectDemocracyVoting.abi);
        console.log("contract:", contract);


        

        try {
            const gasEstimate = await contract.estimateGas.createProposal(
                proposalName,
                proposalDescription,
                proposalDuration,
                options,
                triggerSpendIndex,
                receiverAddress,
                amountConverted,
                canSend,
                tokenAddress,
                electionEnabled,
                candidateAddresses,
                candidateNames
            );
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.createProposal(
                proposalName,
                proposalDescription,
                proposalDuration,
                options,
                triggerSpendIndex,
                receiverAddress,
                amountConverted,
                canSend,
                tokenAddress,
                electionEnabled,
                candidateAddresses,
                candidateNames,
                gasOptions
            );
            await tx.wait();
            console.log("DD proposal created");
        } catch (error) {
            console.error("Error creating DD proposal:", error);
        }
    }

    async function ddVote(contractAddress, proposalID, optionIndex) {
        if (!checkNetwork()) {
            return;
        }
        const voterAddress = account;
        const contract = getContractInstance(contractAddress, DirectDemocracyVoting.abi);

        try {
            const gasEstimate = await contract.estimateGas.vote(proposalID, voterAddress, optionIndex);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.vote(proposalID, voterAddress, optionIndex, gasOptions);
            await tx.wait();
            console.log("Voted in DD voting");
        } catch (error) {
            console.error("Error voting in DD voting:", error);
        }
    }

    async function getWinnerDDVoting(contractAddress, proposalID) {
        if (!checkNetwork()) {
            return;
        }
        const contract = getContractInstance(contractAddress, DirectDemocracyVoting.abi);

        try {
            const gasEstimate = await contract.estimateGas.announceWinner(proposalID);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.announceWinner(proposalID, gasOptions);
            await tx.wait();
            console.log("Winner announced");
        } catch (error) {
            console.error("Error announcing winner:", error);
        }
    }

    // Participation Voting
    async function createProposalPtVoting(contractAddress, proposalName, proposalDescription, proposalDuration, options, triggerSpend, receiverAddress, amount, canSend) {
        const contract = getContractInstance(contractAddress, ParticipationVoting.abi);

        try {
            const gasEstimate = await contract.estimateGas.createProposal(
                proposalName,
                proposalDescription,
                proposalDuration,
                options,
                triggerSpend,
                receiverAddress,
                amount,
                canSend
            );
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.createProposal(
                proposalName,
                proposalDescription,
                proposalDuration,
                options,
                triggerSpend,
                receiverAddress,
                amount,
                canSend,
                gasOptions
            );
            await tx.wait();
            console.log("Participation proposal created");
        } catch (error) {
            console.error("Error creating participation proposal:", error);
        }
    }

    async function PtVote(contractAddress, proposalID, voterAddress, optionIndex) {
        const contract = getContractInstance(contractAddress, ParticipationVoting.abi);

        try {
            const gasEstimate = await contract.estimateGas.vote(proposalID, voterAddress, optionIndex);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.vote(proposalID, voterAddress, optionIndex, gasOptions);
            await tx.wait();
            console.log("Voted in participation voting");
        } catch (error) {
            console.error("Error voting in participation voting:", error);
        }
    }

    // Task Manager
    async function createProject(contractAddress, projectName) {
        if (!checkNetwork()) {
            return;
        }
        const contract = getContractInstance(contractAddress, TaskManager.abi);

        try {
            const gasEstimate = await contract.estimateGas.createProject(projectName);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.createProject(projectName, gasOptions);
            await tx.wait();
            console.log("Project created");
        } catch (error) {
            console.error("Error creating project:", error);
        }
    }

    async function createTask(contractAddress, payout, taskDescription, projectName, estHours, difficulty, taskLocation, taskName) {
        if (!checkNetwork()) {
            return;
        }
        let ipfsHash = await ipfsAddTask(taskName, taskDescription, taskLocation, difficulty, estHours, "");
        let ipfsHashString = ipfsHash.path;
        const contract = getContractInstance(contractAddress, TaskManager.abi);

        try {
            const gasEstimate = await contract.estimateGas.createTask(payout, ipfsHashString, projectName);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.createTask(payout, ipfsHashString, projectName, gasOptions);
            await tx.wait();
            console.log("Task created");
        } catch (error) {
            console.error("Error creating task:", error);
        }
    }

    async function claimTask(contractAddress, taskID) {
        if (!checkNetwork()) {
            return;
        }
        const contract = getContractInstance(contractAddress, TaskManager.abi);
        const newTaskID = taskID.split("-")[0];

        try {
            const gasEstimate = await contract.estimateGas.claimTask(newTaskID);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.claimTask(newTaskID, gasOptions);
            await tx.wait();
            console.log("Task claimed");
        } catch (error) {
            console.error("Error claiming task:", error);
        }
    }

    async function completeTask(contractAddress, taskID) {
        if (!checkNetwork()) {
            return;
        }
        const contract = getContractInstance(contractAddress, TaskManager.abi);
        const newTaskID = taskID.split("-")[0];

        try {
            const gasEstimate = await contract.estimateGas.completeTask(newTaskID);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.completeTask(newTaskID, gasOptions);
            await tx.wait();
            console.log("Task completed");
        } catch (error) {
            console.error("Error completing task:", error);
        }
    }

    async function updateTask(contractAddress, taskID, payout, ipfsHash) {
        if (!checkNetwork()) {
            return;
        }
        const contract = getContractInstance(contractAddress, TaskManager.abi);
        const newTaskID = taskID.split("-")[0];

        try {
            const gasEstimate = await contract.estimateGas.updateTask(newTaskID, payout, ipfsHash);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.updateTask(newTaskID, payout, ipfsHash, gasOptions);
            await tx.wait();
            console.log("Task updated");
        } catch (error) {
            console.error("Error updating task:", error);
        }
    }

    async function submitTask(contractAddress, taskID, ipfsHash) {
        if (!checkNetwork()) {
            return;
        }
        const contract = getContractInstance(contractAddress, TaskManager.abi);
        const newTaskID = taskID.split("-")[0];

        try {
            const gasEstimate = await contract.estimateGas.submitTask(newTaskID, ipfsHash);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.submitTask(newTaskID, ipfsHash, gasOptions);
            await tx.wait();
            console.log("Task submitted");
        } catch (error) {
            console.error("Error submitting task:", error);
        }
    }

    async function editTaskWeb3(contractAddress, payout, taskDescription, projectName, estHours, difficulty, taskLocation, taskName, taskID) {
        if (!checkNetwork()) {
            return;
        }
        let ipfsHash = await ipfsAddTask(taskName, taskDescription, taskLocation, difficulty, estHours, "");
        let ipfsHashString = ipfsHash.path;
        const contract = getContractInstance(contractAddress, TaskManager.abi);
        let newTaskID = taskID.split("-")[0];

        try {
            const gasEstimate = await contract.estimateGas.updateTask(newTaskID, payout, ipfsHashString);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.updateTask(newTaskID, payout, ipfsHashString, gasOptions);
            await tx.wait();
            console.log("Task edited");
        } catch (error) {
            console.error("Error editing task:", error);
        }
    }

    // NFT Membership
    async function checkIsExecutive(contractAddress, userAddress) {
        if (!checkNetwork()) {
            return;
        }
        const contract = getContractInstance(contractAddress, NFTMembership.abi);
        try {
            const isExec = await contract.checkIsExecutive(userAddress);
            console.log(`Is ${userAddress} an executive?`, isExec);
            return isExec;
        } catch (error) {
            console.error("Error checking executive status:", error);
            return false;
        }
    }

    async function mintNFT(contractAddress, membershipType) {
        if (!checkNetwork()) {
            return;
        }
        const contract = getContractInstance(contractAddress, NFTMembership.abi);
        try {
            const gasEstimate = await contract.estimateGas.mintNFT(account, membershipType);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.mintNFT(account, membershipType, gasOptions);
            await tx.wait();
            console.log("NFT minted");
        } catch (error) {
            console.error("Error minting NFT:", error);
        }
    }

    async function mintDefaultNFT(contractAddress) {
        if (!checkNetwork()) {
            return;
        }
        const contract = getContractInstance(contractAddress, NFTMembership.abi);
        try {
            const gasEstimate = await contract.estimateGas.mintDefaultNFT();
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.mintDefaultNFT(gasOptions);
            await tx.wait();
            console.log("Default NFT minted");
        } catch (error) {
            console.error("Error minting default NFT:", error);
        }
    }

    async function updateNFT(contractAddress, userAddress, membershipType) {
        const contract = getContractInstance(contractAddress, NFTMembership.abi);
        try {
            const gasEstimate = await contract.estimateGas.changeMembershipType(userAddress, membershipType);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.changeMembershipType(userAddress, membershipType, gasOptions);
            await tx.wait();
            console.log("NFT updated");
        } catch (error) {
            console.error("Error updating NFT:", error);
        }
    }

    async function setImageURL(contractAddress, memberTypeName, imageURL) {
        const contract = getContractInstance(contractAddress, NFTMembership.abi);
        try {
            const gasEstimate = await contract.estimateGas.setMemberTypeImage(memberTypeName, imageURL);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.setMemberTypeImage(memberTypeName, imageURL, gasOptions);
            await tx.wait();
            console.log("Image URL updated");
        } catch (error) {
            console.error("Error setting image URL:", error);
        }
    }

    // Treasury
    async function transferFunds(contractAddress, tokenAddress, amount) {
        const contract = getContractInstance(contractAddress, Treasury.abi);
        try {
            const gasEstimate = await contract.estimateGas.receiveTokens(tokenAddress, amount);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.receiveTokens(tokenAddress, amount, gasOptions);
            await tx.wait();
            console.log("Funds transferred");
        } catch (error) {
            console.error("Error transferring funds:", error);
        }
    }

    // Direct Democracy Token
    async function mintDDtokens(contractAddress) {
        if (!checkNetwork()) {
            return;
        }
        const contract = getContractInstance(contractAddress, DirectDemocracyToken.abi);
        try {
            const gasEstimate = await contract.estimateGas.mint();
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.mint(gasOptions);
            await tx.wait();
            console.log("Tokens minted");
        } catch (error) {
            console.error("Error minting tokens:", error);
        }
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

    // Treasury
    async function sendToTreasury(contractAddress, tokenAddress, amount) {
        try {
            const contract = getContractInstance(contractAddress, Treasury.abi);

            const gasEstimate = await contract.estimateGas.receiveTokens(tokenAddress, account, amount);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: ethers.utils.hexlify(20000000), // Adjust the gas limit as needed
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.receiveTokens(tokenAddress, account, amount, gasOptions);
            await tx.wait();
            console.log("Tokens sent to treasury");
        } catch (error) {
            console.error("Error sending tokens to treasury:", error);
        }
    }

    // Quick Join
    async function quickJoinNoUser(contractAddress, username) {
        console.log("Username being passed:", username);
        console.log("Contract address:", contractAddress);

        if (!checkNetwork()) {
            return;
        }

        try {
            const contract = getContractInstance(contractAddress, QuickJoin.abi);

            const gasEstimate = await contract.estimateGas.quickJoinNoUser(username);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.quickJoinNoUser(username, gasOptions);

            console.log("Transaction sent:", tx.hash);

            const receipt = await tx.wait();

            console.log("Transaction mined:", receipt.transactionHash);
            console.log("User joined successfully with username:", username);
        } catch (error) {
            console.error("Error during quickJoinNoUser:", error);

            if (error.reason) {
                console.error("Revert reason:", error.reason);
            } else if (error.error && error.error.reason) {
                console.error("Revert reason:", error.error.reason);
            } else if (error.data) {
                const iface = new ethers.utils.Interface(QuickJoin.abi);
                try {
                    const decodedError = iface.parseError(error.data);
                    console.error("Decoded error:", decodedError);
                } catch (parseError) {
                    console.error("Error parsing revert reason:", parseError);
                }
            } else {
                console.error("Error message:", error.message);
            }
        }
    }

    async function quickJoinWithUser(contractAddress) {
        if (!checkNetwork()) {
            return;
        }

        try {
            const contract = getContractInstance(contractAddress, QuickJoin.abi);

            const gasEstimate = await contract.estimateGas.quickJoinWithUser();
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.quickJoinWithUser(gasOptions);
            await tx.wait();
            console.log("User joined with existing username");
        } catch (error) {
            console.error("Error joining with existing username:", error);
        }
    }

    // Education Hub
    async function createEduModule(contractAddress, moduleTitle, moduleDescription, payout, answers, correctAnswer) {
        if (!checkNetwork()) {
            return;
        }

        const contract = getContractInstance(contractAddress, EducationHub.abi);

        const data = {
            title: moduleTitle,
            description: moduleDescription,
            answers: answers,
        };

        const ipfsHash = await addToIpfs(JSON.stringify(data));

        let correctAnswerIndex = answers.indexOf(correctAnswer);

        try {
            const gasEstimate = await contract.estimateGas.createModule(
                moduleTitle,
                ipfsHash.path,
                payout,
                correctAnswerIndex
            );
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.createModule(
                moduleTitle,
                ipfsHash.path,
                payout,
                correctAnswerIndex,
                gasOptions
            );
            await tx.wait();
            console.log("Module created");
        } catch (error) {
            console.error("Error creating education module:", error);
        }
    }

    async function submitEduModule(contractAddress, moduleID, answer) {
        if (!checkNetwork()) {
            return;
        }
        const contract = getContractInstance(contractAddress, EducationHub.abi);

        try {
            const gasEstimate = await contract.estimateGas.completeModule(moduleID, answer);
            const gasLimit = gasEstimate.mul(120).div(100);
            const gasOptions = {
                gasLimit: gasLimit,
                gasPrice: GAS_PRICE,
            };

            const tx = await contract.completeModule(moduleID, answer, gasOptions);
            await tx.wait();
            console.log("Module submitted");
        } catch (error) {
            console.error("Error submitting education module:", error);
        }
    }

    return (
        <Web3Context.Provider value={{
            address,
            chainId,
            quickJoinNoUser,
            quickJoinWithUser,
            sendToTreasury,
            changeUsername,
            submitTask,
            editTaskWeb3,
            signer,
            isNetworkModalOpen,
            closeNetworkModal,
            mintDDtokens,
            mintDefaultNFT,
            mintNFT,
            setAccount,
            ddVote,
            getWinnerDDVoting,
            completeTask,
            ipfsAddTask,
            createTask,
            createProject,
            claimTask,
            updateTask,
            createProposalDDVoting,
            createNewUser,
            createEduModule,
            checkIsExecutive,
            updateNFT
        }}>
            {children}
        </Web3Context.Provider>
    );
};
