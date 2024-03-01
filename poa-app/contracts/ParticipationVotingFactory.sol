// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ParticipationVoting.sol";

contract ParticipationVotingFactory {

    ParticipationVoting[] public votingContracts;


    event VotingContractCreated(address indexed votingContractAddress, string POname);

    function createParticipationVoting(address _ParticipationToken, address _nftMembership, string[] memory _allowedRoleNames, bool _quadraticVotingEnabled, address _treasuryAddress, string memory POname) public {
        ParticipationVoting newVotingContract = new ParticipationVoting( _ParticipationToken, _nftMembership, _allowedRoleNames, _quadraticVotingEnabled, _treasuryAddress);
        votingContracts.push(newVotingContract);
        emit VotingContractCreated(address(newVotingContract), POname);
    }

    function getVotingContractsCount() public view returns (uint256) {
        return votingContracts.length;
    }

    function getVotingContractAddress(uint256 index) public view returns (address) {
        require(index < votingContracts.length, "Index out of bounds");
        return address(votingContracts[index]);
    }
}
