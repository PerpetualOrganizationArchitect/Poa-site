// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HybridVoting.sol"; 

contract HybridVotingFactory {
    
    event HybridVotingContractCreated(address indexed creator, address hybridVotingAddress, string POname, uint256 quorumPercentage);


    
    function createHybridVoting(
        address _ParticipationToken,
        address _DemocracyToken,
        address _nftMembership,
        string[] memory _allowedRoleNames,
        bool _quadraticVotingEnabled,
        uint256 _democracyVoteWeight,
        uint256 _participationVoteWeight,
        address _treasuryAddress,
        string memory POname,
        uint256 _quorumPercentage
    ) public  returns (address){
        HybridVoting newHybridVoting = new HybridVoting(
            _ParticipationToken,
            _DemocracyToken,
            _nftMembership,
            _allowedRoleNames,
            _quadraticVotingEnabled,
            _democracyVoteWeight,
            _participationVoteWeight,
            _treasuryAddress,
            _quorumPercentage
        );
        emit HybridVotingContractCreated(msg.sender, address(newHybridVoting), POname, _quorumPercentage);
        return address(newHybridVoting);
    }

    
}
