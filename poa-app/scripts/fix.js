// this script is used to fix the nonce issue in the polygon testnet
// if transactions show pending 
// did it 
const Web3 = require('web3');

// Connect to the Mumbai testnet
const web3 = new Web3('');

// Replace with your account address
const accountAddress = '0x06e6620C67255d308A466293070206176288A67B';
const privateKey = '';



async function bumpPendingTransactions() {
    const confirmedNonce = await web3.eth.getTransactionCount(accountAddress);
    const pendingNonce = await web3.eth.getTransactionCount(accountAddress, 'pending');
  
    console.log(`Confirmed Nonce: ${confirmedNonce}`);
    console.log(`Pending Nonce: ${pendingNonce}`);
  
    if (confirmedNonce >= pendingNonce) {
      console.log(`No transactions to bump.`);
      return;
    }
  
    const gasPrice = await web3.eth.getGasPrice();
    const bumpedGasPrice = web3.utils.toBN(gasPrice).mul(web3.utils.toBN(120)).div(web3.utils.toBN(100)).toString(); // increased by 20%
  
    for (let nonce = confirmedNonce; nonce < pendingNonce; nonce++) {
      try {
        console.log(`Attempting to bump transaction with nonce ${nonce}`);
        
        const transaction = {
          to: accountAddress,
          value: '0',
          gas: 21000,
          gasPrice: bumpedGasPrice,
          nonce: nonce,
        };
        
        const signedTransaction = await web3.eth.accounts.signTransaction(transaction, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
        
        console.log(`Transaction with nonce ${nonce} bumped successfully!`, receipt);
      } catch (error) {
        if (error.message.includes("nonce too low")) {
          console.log(`Transaction with nonce ${nonce} already confirmed, skipping...`);
        } else if (error.message.includes("replacement transaction underpriced")) {
          console.error(`Gas price too low for nonce ${nonce}, you may want to increase the gas price.`);
        } else {
          console.error(`Error bumping transaction with nonce ${nonce}:`, error);
        }
      }
    }
  }
  
  bumpPendingTransactions();