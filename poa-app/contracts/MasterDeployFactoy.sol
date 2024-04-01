// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


//import all factories 
import "./DirectDemocracyVotingFactory.sol";
import "./DirectDemocracyTokenFactory.sol";
import "./HybridVotingFactory.sol";
import "./ParticipationTokenFactory.sol";
import "./ParticipationVotingFactory.sol";
import "./TreasuryFactory.sol";
import "./MembershipNFTFactory.sol";
import "./RegistryFactory.sol";
import "./TaskManagerFactory.sol";




contract MasterFactory {
    function deployAll(
    ) public returns (address[] memory) {

        return new address[](/* array of all deployed contract addresses */);
    }
}
