const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

// Connect to a local Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

// Function to get the contract ABI
const getContractABI = () => {
  const certificationJsonPath = path.join(__dirname, '../build/contracts/Certification.json');

  try {
    const certificationData = JSON.parse(fs.readFileSync(certificationJsonPath, 'utf8'));
    return certificationData.abi || [];
  } catch (error) {
    console.error(`Error: ${certificationJsonPath} not found or invalid.`);
    return [];
  }
};

// Get the contract ABI
const contractABI = getContractABI();

// Read contract address from deployment config
const deploymentConfigPath = path.join(__dirname, '../deployment_config.json');
let contractAddress = '';

try {
  const addressData = JSON.parse(fs.readFileSync(deploymentConfigPath, 'utf8'));
  contractAddress = addressData.Certification;
} catch (error) {
  console.error(`Error: ${deploymentConfigPath} not found or invalid.`);
}

// Interact with the smart contract
const contract = new web3.eth.Contract(contractABI, contractAddress);

module.exports = { web3, contract };
