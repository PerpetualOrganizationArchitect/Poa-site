// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.20;

import "./DirectDemocracyVoting.sol"; 

contract DirectDemocracyVotingFactory {
    address[] public deployedVotings;

    event VotingContractCreated(address indexed votingAddress, address indexed treasuryAddress, string POname);

    function createDirectDemocracyVoting(address _ddToken, address _nftMembership, string[] memory _allowedRoleNames, address _treasuryAddress, string memory POname ) public {
        DirectDemocracyVoting newVoting = new DirectDemocracyVoting(_ddToken, _nftMembership, _allowedRoleNames, _treasuryAddress);
        deployedVotings.push(address(newVoting));
        emit VotingContractCreated(address(newVoting), _treasuryAddress, POname);
    }

    function getDeployedVotings() external view returns (address[] memory) {
        return deployedVotings;
    }
}
