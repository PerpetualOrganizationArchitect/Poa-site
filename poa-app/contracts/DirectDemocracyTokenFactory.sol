// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DirectDemocracyToken.sol";

contract DirectDemocracyTokenFactory {
    event TokenCreated(address tokenAddress, string name, string symbol);


    function createDirectDemocracyToken(string memory name, string memory symbol) public {
        DirectDemocracyToken newToken = new DirectDemocracyToken(name, symbol);

        newToken.transferOwnership(msg.sender);
        emit TokenCreated(address(newToken), name, symbol);
    }
}
