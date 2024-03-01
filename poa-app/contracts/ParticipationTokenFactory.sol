// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ParticipationToken.sol";

contract ParticipationTokenFactory {
    ParticipationToken[] public deployedTokens;

    event TokenCreated(address tokenAddress, string name, string symbol, string POname);

    function createParticipationToken(string memory name, string memory symbol, string memory POname) public {
        ParticipationToken newToken = new ParticipationToken(name, symbol);
        deployedTokens.push(newToken);
        emit TokenCreated(address(newToken), name, symbol, POname);
    }

    function getDeployedTokens() public view returns (ParticipationToken[] memory) {
        return deployedTokens;
    }
}
