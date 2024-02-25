require('dotenv').config({ path: '../.env.local' }); // Loading environment variables
const ethers = require('ethers'); // Importing ethers.js library

console.log(process.env.NEXT_PUBLIC_INFURA_URL)

const DirectDemocracyTokenFactory = require('../abi/DirectDemocracyTokenFactory.json'); 

async function main() {
  // Extracting ABI and bytecode from imported JSON.
  const DirectDemocracyTokenFactoryBytecode = DirectDemocracyTokenFactory.bytecode
  const DirectDemocracyTokenFactoryAbi = DirectDemocracyTokenFactory.abi;

  // Creating provider and wallet instances.
  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_INFURA_URL);
  const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);

  // Creating a ContractFactory instance to deploy the contract.
  const factory = new ethers.ContractFactory(DirectDemocracyTokenFactoryAbi, DirectDemocracyTokenFactoryBytecode, wallet);

  // Deploying the contract.
  const contract = await factory.deploy();
  await contract.deployed(); 
  console.log(contract) 

  // Logging the address at which the contract is deployed.
  console.log(`Contract deployed at address: ${contract.address}`);
}

main()
  .then(() => process.exit(0)) 
  .catch((error) => {
    console.error(error); // Logging any errors occurred during the deployment.
    process.exit(1); // Exiting the process with a non-zero status code.
  });