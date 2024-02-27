require('dotenv').config({ path: '../.env.local' }); 
const ethers = require('ethers'); 

/*deployment order
1. membership 
2. dd token
3. pt token
4. treasury
5. pt voting
6. dd voting
7. hybrid voting 
8. task manager
9. set task manager in pt 
10. set voting contract in treasury
11. Registry

*/


const DirectDemocracyTokenFactory = require('../abi/DirectDemocracyTokenFactory.json'); 

const DirectDemocracyVotingFactory = require('../abi/DirectDemocracyVotingFactory.json');

const HybridVotingFactory = require('../abi/HybridVotingFactory.json');

const TaskManagerFactory = require('../abi/TaskManagerFactory.json');

const RegistryFactory = require('../abi/RegistryFactory.json');

const TreasuryFactory = require('../abi/TreasuryFactory.json');

const ParticipationTokenFactory = require('../abi/ParticipationTokenFactory.json');

const ParticipationVotingFactory = require('../abi/ParticipationVotingFactory.json');

const NFTMembershipFactory = require('../abi/NFTMembershipFactory.json');



async function deployDirectDemocracyToken(wallet) {

  const DirectDemocracyTokenFactoryBytecode = DirectDemocracyTokenFactory.bytecode
  const DirectDemocracyTokenFactoryAbi = DirectDemocracyTokenFactory.abi;

  const factory = new ethers.ContractFactory(DirectDemocracyTokenFactoryAbi, DirectDemocracyTokenFactoryBytecode, wallet);


  const contract = await factory.deploy();
  await contract.deployed();

  console.log(`ddtoken factory Contract deployed at address: ${contract.address}`);
  return contract;
  
}

async function deployDirectDemocracyVoting( wallet, ddtokenAddress) {
  
    const DirectDemocracyVotingFactoryBytecode = DirectDemocracyVotingFactory.bytecode
    const DirectDemocracyVotingFactoryAbi = DirectDemocracyVotingFactory.abi;


    const factory = new ethers.ContractFactory(DirectDemocracyVotingFactoryAbi, DirectDemocracyVotingFactoryBytecode, wallet);
    const contract = await factory.deploy();
    await contract.deployed();
    console.log(`ddvoting factory Contract deployed at address: ${contract.address}`);
    return contract;

}


async function deployNFTMembership(wallet) {
  const factory = new ethers.ContractFactory(NFTMembershipFactory.abi, NFTMembershipFactory.bytecode, wallet);
  const contract = await factory.deploy();
  await contract.deployed();
  console.log(`NFT Membership Contract deployed at address: ${contract.address}`);
  return contract;
}

async function deployParticipationToken(wallet) {
  const factory = new ethers.ContractFactory(ParticipationTokenFactory.abi, ParticipationTokenFactory.bytecode, wallet);
  const contract = await factory.deploy();
  await contract.deployed();
  console.log(`Participation Token Contract deployed at address: ${contract.address}`);
  return contract;
}

async function deployTreasury(wallet) {
  const factory = new ethers.ContractFactory(TreasuryFactory.abi, TreasuryFactory.bytecode, wallet);
  const contract = await factory.deploy(); 
  await contract.deployed();
  console.log(`Treasury Contract deployed at address: ${contract.address}`);
  return contract;
}

async function deployParticipationVoting(wallet) {
  const factory = new ethers.ContractFactory(ParticipationVotingFactory.abi, ParticipationVotingFactory.bytecode, wallet);
  const contract = await factory.deploy(); 
  await contract.deployed();
  console.log(`Participation Voting Contract deployed at address: ${contract.address}`);
  return contract;
}

async function deployHybridVoting(wallet) {
  const factory = new ethers.ContractFactory(HybridVotingFactory.abi, HybridVotingFactory.bytecode, wallet);
  const contract = await factory.deploy(); 
  await contract.deployed();
  console.log(`Hybrid Voting Contract deployed at address: ${contract.address}`);
  return contract;
}

async function deployTaskManager(wallet) {
  const factory = new ethers.ContractFactory(TaskManagerFactory.abi, TaskManagerFactory.bytecode, wallet);
  const contract = await factory.deploy();
  await contract.deployed();
  console.log(`Task Manager Contract deployed at address: ${contract.address}`);
  return contract;
}

async function deployRegistry(wallet) {
  const factory = new ethers.ContractFactory(RegistryFactory.abi, RegistryFactory.bytecode, wallet);
  
  const contract = await factory.deploy(); 
  await contract.deployed();
  console.log(`Registry Contract deployed at address: ${contract.address}`);
  return contract;
}

async function makeNFTMembership(nftFactoryContract,memberTypeNames, defaultImageURL ){
  const tx = await nftFactoryContract.createNFTMembership(memberTypeNames, defaultImageURL);
  await tx.wait();

  const deployedContracts = await nftFactoryContract.getDeployedContracts();
  const lastDeployedContractAddress = deployedContracts[deployedContracts.length - 1];

  console.log("NFT Membership contract address: ", lastDeployedContractAddress);


}


async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL);
  const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

  try {
      const nftMembership = await deployNFTMembership(wallet);
      const ddToken = await deployDirectDemocracyToken(wallet);
      const ptToken = await deployParticipationToken(wallet);
      const treasury = await deployTreasury(wallet);
      const ptVoting = await deployParticipationVoting(wallet);
      const ddVoting = await deployDirectDemocracyVoting(wallet);
      const hybridVoting = await deployHybridVoting(wallet);
      const taskManager = await deployTaskManager(wallet);
      const registry = await deployRegistry(wallet);

      const memberTypeNames = ["Gold", "Silver", "Bronze"];
      const defaultImageURL = "http://example.com/default.jpg";

      await makeNFTMembership(nftMembership, memberTypeNames, defaultImageURL);


      
      
      console.log("All contracts deployed and configured successfully.");
  } catch (error) {
      console.error("Deployment error:", error);
      process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });


