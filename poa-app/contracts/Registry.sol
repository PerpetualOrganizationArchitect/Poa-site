// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// need to add ability for executives to easily update org info

contract Registry {
    address public VotingControlAddress;

    mapping(string => address) public contracts;
    string public POname;
    string public infoHash;
    string public logoURL;

    event ContractAdded(string name, address contractAddress);
    event ContractUpgraded(string name, address newAddress);
    event VotingControlAddressSet(address newAddress);
    event Initialized(address VotingControlAddress, string[] contractNames, address[] contractAddresses);


    modifier onlyVoting() {
        require(msg.sender == VotingControlAddress, "Not authorized");
        _;
    }

    constructor(
        address _VotingControlAddress, 
        string[] memory contractNames, 
        address[] memory contractAddresses,
        string memory name,
        string memory logo,
        string memory hashInfo
    ) {
        POname = name;
        infoHash = hashInfo;
        logoURL = logo;
        require(contractNames.length == contractAddresses.length, "Contract names and addresses must be of the same length");
        VotingControlAddress = _VotingControlAddress;
        for (uint i = 0; i < contractNames.length; i++) {
            contracts[contractNames[i]] = contractAddresses[i];
        }

    }

    function setVotingControlAddress(address _address) external onlyVoting{
        
        VotingControlAddress = _address;
        emit VotingControlAddressSet(_address);
    }

    function getContractAddress(string memory name) public view returns (address) {
        return contracts[name];
    }

    function addContract(string memory name, address contractAddress) onlyVoting external {
        
        contracts[name] = contractAddress;
        emit ContractAdded(name, contractAddress);
    }

    function upgradeContract(string memory name, address newAddress) external onlyVoting {
        contracts[name] = newAddress;
        emit ContractUpgraded(name, newAddress);
    }




}
