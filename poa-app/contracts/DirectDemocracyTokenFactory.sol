// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DirectDemocracyToken.sol";

contract DirectDemocracyTokenFactory {
    event TokenCreated(address tokenAddress, string name, string symbol, string[] allowedRoleNames, string POname);


    function createDirectDemocracyToken(string memory name, string memory symbol, address _nftMembership, string[] memory _allowedRoleNames, string memory _POname) public returns (address){
        DirectDemocracyToken newToken = new DirectDemocracyToken(name,  symbol, _nftMembership, _allowedRoleNames);

        newToken.transferOwnership(msg.sender);
        emit TokenCreated(address(newToken), name, symbol, _allowedRoleNames, _POname);

        return address(newToken);
    }
}

