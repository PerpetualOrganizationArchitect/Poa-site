require('dotenv').config({ path: '../.env.local' }); 
const ethers = require('ethers'); 


const DirectDemocracyTokenFactory = require('../abi/DirectDemocracyTokenFactory.json'); 

const DirectDemocracyVotingFactory = require('../abi/DirectDemocracyVotingFactory.json');

async function deployDirectDemocracyToken( wallet) {

  const DirectDemocracyTokenFactoryBytecode = DirectDemocracyTokenFactory.bytecode
  const DirectDemocracyTokenFactoryAbi = DirectDemocracyTokenFactory.abi;

  const factory = new ethers.ContractFactory(DirectDemocracyTokenFactoryAbi, DirectDemocracyTokenFactoryBytecode, wallet);


  const contract = await factory.deploy();
  await contract.deployed();

  console.log(`ddtoken factory Contract deployed at address: ${contract.address}`);
  
  const tx = await contract.createDirectDemocracyToken("DirectDemocracyToken", "DDT");
  
  const receipt = await tx.wait();

  const event = receipt.events.find(event => event.event === 'TokenCreated');
  const [tokenAddress] = event.args;

  console.log(`DirectDemocracyToken deployed at address: ${tokenAddress}`);

  return tokenAddress;


  
}

async function deployDirectDemocracyVoting( wallet, ddtokenAddress) {
  
    const DirectDemocracyVotingFactoryBytecode = DirectDemocracyVotingFactory.bytecode
    const DirectDemocracyVotingFactoryAbi = DirectDemocracyVotingFactory.abi;



    const factory = new ethers.ContractFactory(DirectDemocracyVotingFactoryAbi, DirectDemocracyVotingFactoryBytecode, wallet);
    const contract = await factory.deploy();
    await contract.deployed();
    console.log(`ddvoting factory Contract deployed at address: ${contract.address}`);

    const nullDaoAddress = '0x0000000000000000000000000000000000000000';


    const tx = await contract.createDirectDemocracyVoting(ddtokenAddress, nullDaoAddress);
    const receipt = await tx.wait();

    const deployedVotings = await contract.getDeployedVotings();
    const votingAddress = deployedVotings[deployedVotings.length - 1];


    console.log(`DirectDemocracyVoting deployed at address: ${votingAddress}`);

}

async function main() {

  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL);
  const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

  let ddtokenAddress = null;

  try {
   ddtokenAddress = await deployDirectDemocracyToken(wallet); 
  
  }
  catch (error) {
    console.error("dd token error:", error); 
  }

  try {
    await deployDirectDemocracyVoting(wallet, ddtokenAddress); 
  }
  catch (error) {
    console.error("dd voting error:", error); 
  }

}

main()
  .then(() => process.exit(0)) 
  .catch((error) => {
    console.error(error); 
    process.exit(1); 
  });