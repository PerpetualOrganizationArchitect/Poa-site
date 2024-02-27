require('dotenv').config({ path: '../.env.local' }); 
const ethers = require('ethers'); 

/*deployment order
1. membership check
2. dd token check 
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

  return lastDeployedContractAddress;


}

async function makeDDToken(ddTokenFactoryContract, name, symbol, nftMembershipAddress, allowedRoleNames) {
  // Ensure all parameters are provided and valid, especially the contract addresses
  if (!ddTokenFactoryContract || !name || !symbol || !nftMembershipAddress || !allowedRoleNames.length) {
    console.error("Invalid parameters provided to makeDDToken function");
    return;
  }

  // Call the createDirectDemocracyToken function on the factory contract
  const tx = await ddTokenFactoryContract.createDirectDemocracyToken(name, symbol, nftMembershipAddress, allowedRoleNames);
  await tx.wait();

  /
  const receipt = await tx.wait();
  const tokenCreatedEvent = receipt.events?.filter((x) => x.event === "TokenCreated")[0];
  if (tokenCreatedEvent) {
    const ddTokenAddress = tokenCreatedEvent.args.tokenAddress;
    console.log(`DD Token created at address: ${ddTokenAddress}`);
    return ddTokenAddress;
  } else {
    console.error("DD Token address not found from the transaction receipt");
  }

}

async function makePTToken(ptTokenFactoryContract, name, symbol) {
  
  if (!ptTokenFactoryContract || !name || !symbol) {
    console.error("Invalid parameters provided to makePTToken function");
    return;
  }

  
  const tx = await ptTokenFactoryContract.createParticipationToken(name, symbol);
  await tx.wait();

  
  
  const deployedTokens = await ptTokenFactoryContract.getDeployedTokens();
  const lastDeployedToken = deployedTokens[deployedTokens.length - 1]; 

  console.log(`PT Token created at address: ${lastDeployedToken.address}`); 
  return lastDeployedToken.address;
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

      const nftAddress = await makeNFTMembership(nftMembership, memberTypeNames, defaultImageURL);
      const ddTokenAddress = await makeDDToken(ddToken, "DirectDemocracyToken", "DDT", nftAddress, memberTypeNames);
      const ptTokenAddress = await makePTToken(ptToken, "ParticipationToken", "PT");



      
      
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


