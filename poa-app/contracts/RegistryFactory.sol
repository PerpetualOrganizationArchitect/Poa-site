// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Registry.sol";

contract RegistryFactory {
    

    event RegistryCreated(address newRegistryAddress, string POname, string logoURL);

    function createRegistry(
        address _VotingControlAddress,
        string[] memory contractNames,
        address[] memory contractAddresses, 
        string memory POname, 
        string memory logoURL
    ) public returns (address) {
        Registry newRegistry = new Registry(_VotingControlAddress, contractNames, contractAddresses);
        emit RegistryCreated(address(newRegistry), POname, logoURL);
        return address(newRegistry);
    }
}
