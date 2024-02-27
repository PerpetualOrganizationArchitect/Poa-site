// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HybridVoting.sol"; // Import the HybridVoting contract

contract HybridVotingFactory {
    
    event HybridVotingCreated(address indexed creator, address hybridVotingAddress);

    
    address[] public allHybridVotings;

    
    function createHybridVoting(
        address _ParticipationToken,
        address _DemocracyToken,
        address _nftMembership,
        string[] memory _allowedRoleNames,
        bool _quadraticVotingEnabled,
        uint256 _democracyVoteWeight,
        uint256 _participationVoteWeight,
        address _treasuryAddress
    ) public {
        HybridVoting newHybridVoting = new HybridVoting(
            _ParticipationToken,
            _DemocracyToken,
            _nftMembership,
            _allowedRoleNames,
            _quadraticVotingEnabled,
            _democracyVoteWeight,
            _participationVoteWeight,
            _treasuryAddress
        );
        allHybridVotings.push(address(newHybridVoting));
        emit HybridVotingCreated(msg.sender, address(newHybridVoting));
    }

    
    function getHybridVotingCount() public view returns (uint256) {
        return allHybridVotings.length;
    }

    
    function getHybridVotingAddress(uint256 index) public view returns (address) {
        require(index < allHybridVotings.length, "Index out of bounds");
        return allHybridVotings[index];
    }
}
