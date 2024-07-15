require('dotenv').config({ path: '../.env.local' }); 
const ethers = require('ethers'); 

/*deployment order
1. membership check
2. dd token check 
3. pt token check
4. treasury check
5. pt voting check
6. dd voting check
7. hybrid voting check 
8. task manager check 
9. set task manager in pt 
10. set voting contract in treasury
11. Registry

*/


const DirectDemocracyTokenFactory = require('../abi/DirectDemocracyTokenFactory.json'); 
const DirectDemocracyToken = require('../abi/DirectDemocracyToken.json');

const DirectDemocracyVotingFactory = require('../abi/DirectDemocracyVotingFactory.json');

const HybridVotingFactory = require('../abi/HybridVotingFactory.json');

const TaskManagerFactory = require('../abi/TaskManagerFactory.json');

const RegistryFactory = require('../abi/RegistryFactory.json');

const TreasuryFactory = require('../abi/TreasuryFactory.json');

const ParticipationTokenFactory = require('../abi/ParticipationTokenFactory.json');

const ParticipationVotingFactory = require('../abi/ParticipationVotingFactory.json');

const NFTMembershipFactory = require('../abi/NFTMembershipFactory.json');
const NFTMembership = require('../abi/NFTMembership.json')

const MasterDeployFactory = require('../abi/MasterFactory.json');

const AccountManager = require('../abi/AccountManager.json');



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

async function deployMasterDeployFactory(wallet, directDemocracyTokenFactory, directDemocracyVotingFactory, hybridVotingFactory, participationTokenFactory, participationVotingFactory, treasuryFactory,
  nftMembershipFactory, registryFactory, taskManagerFactory, quickJoinFactory, accountManagerAddress) {
    const factory = new ethers.ContractFactory(MasterDeployFactory.abi, MasterDeployFactory.bytecode, wallet);
    const contract = await factory.deploy(directDemocracyTokenFactory, directDemocracyVotingFactory, hybridVotingFactory, participationTokenFactory, participationVotingFactory, treasuryFactory,
      nftMembershipFactory, registryFactory, taskManagerFactory, quickJoinFactory, accountManagerAddress);
    await contract.deployed();
    console.log(`Master Deploy Factory Contract deployed at address: ${contract.address}`);
    return contract;
  }
  

async function deployRegistry(wallet) {
  const factory = new ethers.ContractFactory(RegistryFactory.abi, RegistryFactory.bytecode, wallet);
  
  const contract = await factory.deploy(); 
  await contract.deployed();
  console.log(`Registry Contract deployed at address: ${contract.address}`);
  return contract;
}

async function deployAccountManager(wallet) {
  const factory = new ethers.ContractFactory(AccountManager.abi, AccountManager.bytecode, wallet);
  const contract = await factory.deploy();
  await contract.deployed();
  console.log(`Account Manager Contract deployed at address: ${contract.address}`);
  return contract;
}

async function deployQuickJoinFactory(wallet) {
  const factory = new ethers.ContractFactory(QuickJoinFactory.abi, QuickJoinFactory.bytecode, wallet);
  const contract = await factory.deploy();
  await contract.deployed();
  console.log(`Quick Join Factory Contract deployed at address: ${contract.address}`);
  return contract;
}


async function makeNFTMembership(nftFactoryContract,memberTypeNames, defaultImageURL, POname ){
    const tx = await nftFactoryContract.createNFTMembership(memberTypeNames, defaultImageURL, POname);
    await tx.wait();
  
    const deployedContracts = await nftFactoryContract.getDeployedContracts();
    const lastDeployedContractAddress = deployedContracts[deployedContracts.length - 1];
  
    console.log("NFT Membership contract address: ", lastDeployedContractAddress);
  

    const nftMembershipContract = new ethers.Contract(lastDeployedContractAddress, NFTMembership.abi, nftFactoryContract.signer);
    const mintTx = await nftMembershipContract.mintDefaultNFT()
    await mintTx.wait();
  
    console.log("NFT minted successfully");
  
    return lastDeployedContractAddress;


}

async function makeDDToken(ddTokenFactoryContract, name, symbol, nftMembershipAddress, allowedRoleNames, POname) {
  
  if (!ddTokenFactoryContract || !name || !symbol || !nftMembershipAddress || !allowedRoleNames.length) {
    console.error("Invalid parameters provided to makeDDToken function");
    return;
  }

  // Call the createDirectDemocracyToken function on the factory contract
  const tx = await ddTokenFactoryContract.createDirectDemocracyToken(name, symbol, nftMembershipAddress, allowedRoleNames,POname);
  await tx.wait();

  let ddTokenAddress;
  const receipt = await tx.wait();
  const tokenCreatedEvent = receipt.events?.filter((x) => x.event === "TokenCreated")[0];
  if (tokenCreatedEvent) {
    ddTokenAddress = tokenCreatedEvent.args.tokenAddress;
    console.log(`DD Token created at address: ${ddTokenAddress}`);
    
  } else {
    console.error("DD Token address not found from the transaction receipt");
  }

  //call mint function on dd token
  const ddTokenContract = new ethers.Contract(ddTokenAddress, DirectDemocracyToken.abi, ddTokenFactoryContract.signer);
  const mintTx = await ddTokenContract.mint();
  await mintTx.wait();
  console.log("DD Token minted successfully");

  return ddTokenAddress;
}




async function makePTToken(ptTokenFactoryContract, name, symbol, POname) {
  
  if (!ptTokenFactoryContract || !name || !symbol) {
    console.error("Invalid parameters provided to makePTToken function");
    return;
  }

  
  const tx = await ptTokenFactoryContract.createParticipationToken(name, symbol, POname);
  await tx.wait();

  // find the tokenCreated event from the transaction receipt
  const receipt = await tx.wait();
  const tokenCreatedEvent = receipt.events?.filter((x) => x.event === "TokenCreated")[0];
  const ptTokenAddress = tokenCreatedEvent.args.tokenAddress;

  console.log(`PT Token created at address: ${ptTokenAddress}`);
  return ptTokenAddress;


}

async function makeTreasury(treasuryFactoryContract, POname) {

  if (!treasuryFactoryContract) {
    console.error("Invalid parameters provided to makeTreasury function");
    return;
  }

  try {
   
    const txResponse = await treasuryFactoryContract.createTreasury(POname);
    const txReceipt = await txResponse.wait();

   
    const treasuryCreatedEvent = txReceipt.events?.find(event => event.event === "TreasuryCreated");
    const treasuryAddress = treasuryCreatedEvent.args.treasuryAddress;

    console.log(`Treasury Contract deployed at address: ${treasuryAddress}`);

    
    return treasuryAddress;
  } catch (error) {
    console.error("Failed to create Treasury:", error);
    throw error; 
  }
}

async function makeParticipationVoting(
  participationVotingFactoryContract, 
  participationTokenAddress, 
  nftMembershipAddress, 
  allowedRoleNames, 
  quadraticVotingEnabled, 
  treasuryAddress, POname
) {
  
  if (!participationVotingFactoryContract || !ethers.utils.isAddress(participationTokenAddress) || !ethers.utils.isAddress(nftMembershipAddress) || !ethers.utils.isAddress(treasuryAddress)) {
    console.error("Invalid parameters provided to createParticipationVoting function");
    return;
  }

  try {
   
    const txResponse = await participationVotingFactoryContract.createParticipationVoting(
      participationTokenAddress, 
      nftMembershipAddress, 
      allowedRoleNames, 
      quadraticVotingEnabled, 
      treasuryAddress, 
      POname
    );
    const txReceipt = await txResponse.wait();

    
    const votingContractCreatedEvent = txReceipt.events?.find(event => event.event === "VotingContractCreated");
    const votingContractAddress = votingContractCreatedEvent.args.votingContractAddress;

    console.log(`Participation Voting Contract deployed at address: ${votingContractAddress}`);

    
    return votingContractAddress;
  } catch (error) {
    console.error("Failed to create Participation Voting contract:", error);
    throw error; 
  }
}

async function makeHybridVoting(
  hybridVotingFactoryContract,
  participationTokenAddress,
  democracyTokenAddress,
  nftMembershipAddress,
  allowedRoleNames,
  quadraticVotingEnabled,
  democracyVoteWeight,
  participationVoteWeight,
  treasuryAddress,
  POname
) {
  
  if (!hybridVotingFactoryContract || !ethers.utils.isAddress(participationTokenAddress) || !ethers.utils.isAddress(democracyTokenAddress)) {
    console.error("Invalid parameters provided to createHybridVoting function");
    return;
  }

  try {
    
    const txResponse = await hybridVotingFactoryContract.createHybridVoting(
      participationTokenAddress,
      democracyTokenAddress,
      nftMembershipAddress,
      allowedRoleNames,
      quadraticVotingEnabled,
      democracyVoteWeight,
      participationVoteWeight,
      treasuryAddress,
      POname
    );
    const txReceipt = await txResponse.wait();

    
    const hybridVotingCreatedEvent = txReceipt.events?.find(event => event.event === "HybridVotingContractCreated");
    const newHybridVotingAddress = hybridVotingCreatedEvent.args.hybridVotingAddress;

    console.log(`Hybrid Voting contract created at address: ${newHybridVotingAddress}`);

    
    return newHybridVotingAddress;
  } catch (error) {
    console.error("Failed to create Hybrid Voting contract:", error);
    throw error; 
  }
}

async function makeTaskManager(taskManagerFactoryContract, tokenAddress, nftMembershipAddress, allowedRoleNames, POname) {
  
  if (!taskManagerFactoryContract || !tokenAddress || !nftMembershipAddress || !allowedRoleNames.length) {
    console.error("Invalid parameters provided to createTaskManager function");
    return;
  }

  // Call the createTaskManager function on the factory contract
  const tx = await taskManagerFactoryContract.createTaskManager(tokenAddress, nftMembershipAddress, allowedRoleNames, POname);
  await tx.wait(); 

  // Fetch the transaction receipt to extract the event details
  const receipt = await tx.wait();
  const taskManagerCreatedEvent = receipt.events?.filter((x) => x.event === "TaskManagerCreated")[0];
  if (taskManagerCreatedEvent) {
    const taskManagerAddress = taskManagerCreatedEvent.args.TaskManager;
    console.log(`Task Manager created at address: ${taskManagerAddress}`);
    return taskManagerAddress;
  } else {
    console.error("Task Manager address not found from the transaction receipt");
  }
}

async function makeDirectDemocracyVoting(ddVotingFactoryContract, ddTokenAddress, nftMembershipAddress, allowedRoleNames, treasuryAddress, POname) {
  
  if (!ddVotingFactoryContract || !ddTokenAddress || !nftMembershipAddress || !allowedRoleNames.length || !treasuryAddress) {
    console.error("Invalid parameters provided to createDirectDemocracyVoting function");
    return;
  }

  
  const tx = await ddVotingFactoryContract.createDirectDemocracyVoting(ddTokenAddress, nftMembershipAddress, allowedRoleNames, treasuryAddress, POname);
  

  const receipt = await tx.wait();

  
  const votingCreatedEvent = receipt.events?.filter((event) => event.event === "VotingContractCreated")[0];
  if (votingCreatedEvent) {
    
    const votingAddress = votingCreatedEvent.args.votingAddress;
    console.log(`Direct Democracy Voting created at address: ${votingAddress}`);
    return votingAddress;
  } else {
    console.error("Direct Democracy Voting address not found from the transaction receipt");
  }
}

const makeRegistry = async (votingControlAddress, registryFactoryContract, contractNames, contractAddresses, POname, logoURL) => {
  if (!registryFactoryContract || !contractNames.length || !contractAddresses.length) {
    console.error("Invalid parameters provided to createRegistry function");
    return;
  }

  try {
    const txResponse = await registryFactoryContract.createRegistry(votingControlAddress, contractNames, contractAddresses, POname, logoURL);
    const txReceipt = await txResponse.wait();

    const registryCreatedEvent = txReceipt.events?.find(event => event.event === "RegistryCreated");
    const registryAddress = registryCreatedEvent.args.newRegistryAddress;

    console.log(`Registry Contract deployed at address: ${registryAddress}`);

    return registryAddress;
  } catch (error) {
    console.error("Failed to create Registry:", error);
    throw error; 
  }
}





async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL);
  const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

  try {
    console.log("Starting deployment");
    
    const accountManager = await deployAccountManager(wallet);
    const nftMembership = await deployNFTMembership(wallet);
    const ddToken = await deployDirectDemocracyToken(wallet);
    const ptToken = await deployParticipationToken(wallet);
    const treasury = await deployTreasury(wallet);
    const ptVoting = await deployParticipationVoting(wallet);
    const ddVoting = await deployDirectDemocracyVoting(wallet);
    const hybridVoting = await deployHybridVoting(wallet);
    const taskManager = await deployTaskManager(wallet);
    const registry = await deployRegistry(wallet);
    const quickJoinFactory = await deployQuickJoinFactory(wallet);

    const masterDeployFactory = await deployMasterDeployFactory(
      wallet,
      ddToken.address,
      ddVoting.address,
      hybridVoting.address,
      ptToken.address,
      ptVoting.address,
      treasury.address,
      nftMembership.address,
      registry.address,
      taskManager.address,
      quickJoinFactory.address,
      accountManager.address
    );

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



