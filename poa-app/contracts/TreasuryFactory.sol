// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Treasury.sol";

contract TreasuryFactory {
    event TreasuryCreated(address indexed treasuryAddress);

    // Function to create a new Treasury contract
    function createTreasury() public returns (address) {
        Treasury newTreasury = new Treasury();
        emit TreasuryCreated(address(newTreasury));
        return address(newTreasury);
    }
}