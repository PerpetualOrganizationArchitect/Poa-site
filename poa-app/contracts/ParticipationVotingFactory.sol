// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ParticipationVoting.sol";

contract ParticipationVotingFactory {



    event VotingContractCreated(address indexed votingContractAddress, string POname);

    function createParticipationVoting(address _ParticipationToken, address _nftMembership, string[] memory _allowedRoleNames, bool _quadraticVotingEnabled, address _treasuryAddress, string memory POname, uint256 _quorumPercentage) public returns (address){
        ParticipationVoting newVotingContract = new ParticipationVoting( _ParticipationToken, _nftMembership, _allowedRoleNames, _quadraticVotingEnabled, _treasuryAddress, _quorumPercentage );
        emit VotingContractCreated(address(newVotingContract), POname);
        return address(newVotingContract);
    }
}
