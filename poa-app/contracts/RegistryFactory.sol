// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Registry.sol";

contract RegistryFactory {
    

    event RegistryCreated(address newRegistryAddress, string POname, string logoURL, address VotingControlAddress, string[] contractNames, address[] contractAddresses, string POinfoHash);

    function createRegistry(
        address _VotingControlAddress,
        string[] memory contractNames,
        address[] memory contractAddresses, 
        string memory POname, 
        string memory logoURL, 
        string memory POinfoHash
    ) public returns (address) {
        Registry newRegistry = new Registry(_VotingControlAddress, contractNames, contractAddresses, POinfoHash, POname);
        emit RegistryCreated(address(newRegistry), POname, logoURL, _VotingControlAddress, contractNames, contractAddresses, POinfoHash);
        return address(newRegistry);
    }
}
