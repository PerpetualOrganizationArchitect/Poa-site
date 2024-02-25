// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Registry {
    address public VotingControlAddress;

    mapping(string => address) public contracts;

    // Ensures that only the ParticipationVoting contract can call the function
    modifier onlyParticipationVoting() {
        require(msg.sender == VotingControlAddress, "Not authorized");
        _;
    }

    constructor(
        address _VotingControlAddress, 
        string[] memory contractNames, 
        address[] memory contractAddresses
    ) {
        require(contractNames.length == contractAddresses.length, "Contract names and addresses must be of the same length");
        VotingControlAddress = _VotingControlAddress;
        for (uint i = 0; i < contractNames.length; i++) {
            contracts[contractNames[i]] = contractAddresses[i];
        }
    }


    function setVotingControlAddress(address _address) external onlyParticipationVoting{
        
        VotingControlAddress = _address;
    }

    function getContractAddress(string memory name) public view returns (address) {
        return contracts[name];
    }

    function addContract(string memory name, address contractAddress) onlyParticipationVoting external {
        
        contracts[name] = contractAddress;
    }

    function upgradeContract(string memory name, address newAddress) external onlyParticipationVoting {
        contracts[name] = newAddress;
    }
}
