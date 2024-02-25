// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ParticipationToken.sol";

contract ParticipationTokenFactory {
    ParticipationToken[] public deployedTokens;

    function createParticipationToken(string memory name, string memory symbol) public {
        ParticipationToken newToken = new ParticipationToken(name, symbol);
        deployedTokens.push(newToken);
    }

    function getDeployedTokens() public view returns (ParticipationToken[] memory) {
        return deployedTokens;
    }
}
