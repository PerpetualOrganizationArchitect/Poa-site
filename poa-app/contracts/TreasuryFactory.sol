// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Treasury.sol";

contract TreasuryFactory {
    event TreasuryCreated(address indexed treasuryAddress, address indexed votingContract);

    // Function to create a new Treasury contract
    function createTreasury(address _votingContract) public returns (address) {
        require(_votingContract != address(0), "Invalid voting contract address");
        Treasury newTreasury = new Treasury(_votingContract);
        emit TreasuryCreated(address(newTreasury), _votingContract);
        return address(newTreasury);
    }
}
