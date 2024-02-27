// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./HybridVoting.sol"; // Import the HybridVoting contract

contract HybridVotingFactory {
    // Event to emit when a new HybridVoting contract is created
    event HybridVotingCreated(address indexed creator, address hybridVotingAddress);

    // Array to store addresses of all the HybridVoting contracts created
    address[] public allHybridVotings;

    // Function to create a new HybridVoting contract
    function createHybridVoting(
        address _ParticipationToken,
        address _DemocracyToken,
        address _nftMembership,
        string[] memory _allowedRoleNames,
        bool _quadraticVotingEnabled,
        uint256 _democracyVoteWeight,
        uint256 _participationVoteWeight
    ) public {
        HybridVoting newHybridVoting = new HybridVoting(
            _ParticipationToken,
            _DemocracyToken,
            _nftMembership,
            _allowedRoleNames,
            _quadraticVotingEnabled,
            _democracyVoteWeight,
            _participationVoteWeight
        );
        allHybridVotings.push(address(newHybridVoting));
        emit HybridVotingCreated(msg.sender, address(newHybridVoting));
    }

    // Function to get the total number of HybridVoting contracts created
    function getHybridVotingCount() public view returns (uint256) {
        return allHybridVotings.length;
    }

    // Function to get a specific HybridVoting contract address by index
    function getHybridVotingAddress(uint256 index) public view returns (address) {
        require(index < allHybridVotings.length, "Index out of bounds");
        return allHybridVotings[index];
    }
}
