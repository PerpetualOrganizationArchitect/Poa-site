// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.20;

import "./DirectDemocracyVoting.sol"; 

contract DirectDemocracyVotingFactory {
    address[] public deployedVotings;

    event VotingCreated(address indexed votingAddress, address indexed treasuryAddress);

    function createDirectDemocracyVoting(address _ddToken, address _nftMembership, string[] memory _allowedRoleNames, address _treasuryAddress ) public {
        DirectDemocracyVoting newVoting = new DirectDemocracyVoting(_ddToken, _nftMembership, _allowedRoleNames, _treasuryAddress);
        deployedVotings.push(address(newVoting));
        emit VotingCreated(address(newVoting), _treasuryAddress);
    }

    function getDeployedVotings() external view returns (address[] memory) {
        return deployedVotings;
    }
}
