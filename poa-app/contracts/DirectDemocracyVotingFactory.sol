// SPDX-License-Identifier: MIT 

pragma solidity ^0.8.20;

import "./DirectDemocracyVoting.sol"; 

contract DirectDemocracyVotingFactory {

    event VotingContractCreated(address indexed votingAddress, address indexed treasuryAddress, string POname, uint256 quorumPercentage);

    function createDirectDemocracyVoting(address _ddToken, address _nftMembership, string[] memory _allowedRoleNames, address _treasuryAddress, string memory POname, uint256 quorumPercentage ) public returns (address){
        DirectDemocracyVoting newVoting = new DirectDemocracyVoting(_ddToken, _nftMembership, _allowedRoleNames, _treasuryAddress, quorumPercentage);
        emit VotingContractCreated(address(newVoting), _treasuryAddress, POname, quorumPercentage);
        return address(newVoting);
    }

}
