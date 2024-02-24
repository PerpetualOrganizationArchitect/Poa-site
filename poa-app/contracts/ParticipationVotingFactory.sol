// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ParticipationVoting.sol";

contract ParticipationVotingFactory {

    ParticipationVoting[] public votingContracts;


    event VotingContractCreated(address indexed votingContractAddress, address indexed creator);

    function createParticipationVoting(address _ParticipationToken, address _dao) public {
        ParticipationVoting newVotingContract = new ParticipationVoting(_ParticipationToken, _dao);
        votingContracts.push(newVotingContract);
        emit VotingContractCreated(address(newVotingContract), msg.sender);
    }

    function getVotingContractsCount() public view returns (uint256) {
        return votingContracts.length;
    }

    function getVotingContractAddress(uint256 index) public view returns (address) {
        require(index < votingContracts.length, "Index out of bounds");
        return address(votingContracts[index]);
    }
}
