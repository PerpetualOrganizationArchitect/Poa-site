// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Treasury.sol";

contract TreasuryFactory {
    event TreasuryCreated(address indexed treasuryAddress, string POname);

    // Function to create a new Treasury contract
    function createTreasury(string memory POname) public returns (address) {
        Treasury newTreasury = new Treasury();
        emit TreasuryCreated(address(newTreasury), POname);
        return address(newTreasury);
    }
}
