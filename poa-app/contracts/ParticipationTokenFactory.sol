// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ParticipationToken.sol";

contract ParticipationTokenFactory {
    ParticipationToken[] public deployedTokens;

    function createParticipationToken(string memory name, string memory symbol, address _nftMembership, string[] memory _allowedRoleNames) public {
        ParticipationToken newToken = new ParticipationToken(name,  symbol, _nftMembership, _allowedRoleNames);
        deployedTokens.push(newToken);
    }

    function getDeployedTokens() public view returns (ParticipationToken[] memory) {
        return deployedTokens;
    }
}
