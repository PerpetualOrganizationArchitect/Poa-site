import React, { useState } from "react";
import {
  Button,
  Text,
  VStack
} from "@chakra-ui/react";
import { useWeb3Context } from "@/contexts/Web3Context";
import ProjectManagerArtifact from "../../abi/ProjectManager.json";
import ExecNFTArtifiact from "../../abi/KUBIExecutiveNFT.json";
import KUBIXArtifact from "../../abi/KUBIX.json";
import KubixVotingArtifact from "../../abi/KubixVoting.json";
import KubidVotingArtifact from "../../abi/KubidVoting.json";
import directDemocracyTokenArtifact from "../../abi/DirectDemocracyToken.json";
//add in deployed contract adress pop up
const DeployMenu = () => {
  const [showDeployMenu, setShowDeployMenu] = useState(false);
  const [deployedPMContract, setDeployedPMContract] = useState(null);
  const [deployedKUBIContract, setDeployedKUBIContract] = useState(null);
  const [deployedKUBIXContract, setDeployedKUBIXContract] = useState(null);
  const [deployedKubixVotingContract, setDeployedKubixVotingContract] = useState(null);
  const [deployedDirectDemocracyToken, setDeployedDirectDemocracyToken] = useState(null);

  const KUBIXcontractAddress = "0x894158b1f988602b228E39a633C7A2458A82028A"
  const KUBIDcontractAddress = "0x5F9A878411210E1c305cB07d26E50948c84694eA"

  const { web3, account } = useWeb3Context();

  const deployPMContract = async () => {
    if (!web3 || !account) return;
  
    const projectManagerContract = new web3.eth.Contract(ProjectManagerArtifact.abi);
    const deployOptions = {
      data: ProjectManagerArtifact.bytecode,
      arguments: [],
    };
  
    try {
      const instance = await projectManagerContract.deploy(deployOptions).send({ from: account });
      setDeployedPMContract(instance);
      console.log("Contract deployed at address:", instance.options.address);
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  };

  const deployKUBIContract = async () => {
    if (!web3 || !account) return;
  
    const KUBIContract = new web3.eth.Contract(ExecNFTArtifiact.abi);
    const deployOptions = {
      data: ExecNFTArtifiact.bytecode,
      arguments: ["https://ipfs.io/ipfs/QmXrAL39tPc8wWhvuDNNp9rbaWwHPnHhZC28npMGVJvm3N"
    ],
    };
  
    try {
      const instance = await KUBIContract.deploy(deployOptions).send({ from: account });
      setDeployedKUBIContract(instance);
      console.log("Contract deployed at address:", instance.options.address);
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  };

  const deployKUBIXContract = async () => {
    if (!web3 || !account) return;
  
    
    const deployOptions = {
      data: KUBIXArtifact.bytecode,
      arguments: [],
    };
  
    try {
      const instance = await KUBIXcontract.deploy(deployOptions).send({ from: account });
      setDeployedKUBIXContract(instance);
      console.log("Contract deployed at address:", instance.options.address);
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  };

  const deployKubixVotingContract = async () => {
    if (!web3 || !account) return;
  
    const kubixVotingContract = new web3.eth.Contract(KubixVotingArtifact.abi);
    const deployOptions = {
      data: KubixVotingArtifact.bytecode,
      arguments: [KUBIXcontractAddress, account],
    };
  
    try {
      const instance = await kubixVotingContract.deploy(deployOptions).send({ from: account });
      setDeployedKubixVotingContract(instance);
      console.log("Contract deployed at address:", instance.options.address);
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  };

  const deployKubidVotingContract = async () => {
    if (!web3 || !account) return;
  
    const kubidVotingContract = new web3.eth.Contract(KubidVotingArtifact.abi);
    const deployOptions = {
      data: KubidVotingArtifact.bytecode,
      arguments: [KUBIDcontractAddress, account, "0xE5518c6b16F475191489C876Ef9cd85A6EAB3C6C", "0x256C9213d94b90Bf5458079cFA48373dC0000fEb"],
    };
  
    try {
      const instance = await kubidVotingContract.deploy(deployOptions).send({ from: account });
      setDeployedKubixVotingContract(instance);
      console.log("Contract deployed at address:", instance.options.address);
    } catch (error) {
      console.error("Error deploying contract:", error);
    }
  };

  const deployDirectDemocracyToken = async () => {
    if (!web3 || !account) return;

    const directDemocracyTokenContract = new web3.eth.Contract(directDemocracyTokenArtifact.abi);
    const deployOptions = {
      data: directDemocracyTokenArtifact.bytecode,
      arguments: [],
    };

    try {
      const instance = await directDemocracyTokenContract.deploy(deployOptions).send({ from: account });
      setDeployedDirectDemocracyToken(instance);
      console.log("Direct Democracy Token deployed at address:", instance.options.address);
    } catch (error) {
      console.error("Error deploying Direct Democracy Token:", error);
    }
  };
  

  return (
    <VStack spacing={4}>
      <Button  colorScheme="orange" onClick={() => setShowDeployMenu(!showDeployMenu)} _hover={{ bg: "orange.600", boxShadow: "md", transform: "scale(1.05)"}}>
        Deploy Menu
      </Button>
      {showDeployMenu && (
        <>
          <Button colorScheme="teal" onClick={deployPMContract} _hover={{ bg: "teal.600", boxShadow: "md", transform: "scale(1.05)"}}>
            Deploy Project Manager Contract
          </Button>
          <Button colorScheme="teal" onClick={deployKUBIContract} _hover={{ bg: "teal.600", boxShadow: "md", transform: "scale(1.05)"}}>
            Deploy Executive NFT Contract
          </Button>
          <Button  colorScheme="teal" onClick={deployKUBIXContract} _hover={{ bg: "teal.600", boxShadow: "md", transform: "scale(1.05)"}}>
            Deploy KUBIX token Contract
          </Button>
          <Button
            colorScheme="teal"
            onClick={deployKubixVotingContract}
            _hover={{
              bg: "teal.600",
              boxShadow: "md",
              transform: "scale(1.05)",
            }}
          >
            Deploy KubixVoting Contract
          </Button>
          <Button
            colorScheme="teal"
            onClick={deployKubidVotingContract}
            _hover={{
              bg: "teal.600",
              boxShadow: "md",
              transform: "scale(1.05)",
            }}
          >
            Deploy KubidVoting Contract
          </Button>
          <Button
          colorScheme="teal"
          onClick={deployDirectDemocracyToken}
          _hover={{
            bg: "teal.600",
            boxShadow: "md",
            transform: "scale(1.05)",
          }}
        >
          Deploy Direct Democracy Token
        </Button>

        </>
      )}
    </VStack>
  );
};

export default DeployMenu;
