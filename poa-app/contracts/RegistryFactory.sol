// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Registry.sol";

contract RegistryFactory {
    

    event RegistryCreated(address newRegistryAddress);

    function createRegistry(
        address _VotingControlAddress,
        string[] memory contractNames,
        address[] memory contractAddresses
    ) public returns (address) {
        Registry newRegistry = new Registry(_VotingControlAddress, contractNames, contractAddresses);
        emit RegistryCreated(address(newRegistry));
        return address(newRegistry);
    }
}
