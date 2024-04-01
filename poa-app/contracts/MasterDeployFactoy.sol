// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import all factories
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
    DirectDemocracyVotingFactory directDemocracyVotingFactory;
    DirectDemocracyTokenFactory directDemocracyTokenFactory;
    HybridVotingFactory hybridVotingFactory;
    ParticipationTokenFactory participationTokenFactory;
    ParticipationVotingFactory participationVotingFactory;
    TreasuryFactory treasuryFactory;
    NFTMembershipFactory nftMembershipFactory;
    RegistryFactory registryFactory;
    TaskManagerFactory taskManagerFactory;

    struct DeployParams {
        string[] memberTypeNames;
        string[] executivePermissionNames;
        string POname;
        bool quadraticVotingEnabled;
        uint256 democracyVoteWeight;
        uint256 participationVoteWeight;
        bool hybridVotingEnabled;
        bool participationVotingEnabled;
        string logoURL;
        string votingControlType;
        string[] contractNames;
    }


    constructor(
        address _directDemocracyTokenFactory,
        address _directDemocracyVotingFactory,
        address _hybridVotingFactory,
        address _participationTokenFactory,
        address _participationVotingFactory,
        address _treasuryFactory,
        address _nftMembershipFactory,
        address _registryFactory,
        address _taskManagerFactory
    ) {
        directDemocracyTokenFactory = DirectDemocracyTokenFactory(_directDemocracyTokenFactory);
        directDemocracyVotingFactory = DirectDemocracyVotingFactory(_directDemocracyVotingFactory);
        hybridVotingFactory = HybridVotingFactory(_hybridVotingFactory);
        participationTokenFactory = ParticipationTokenFactory(_participationTokenFactory);
        participationVotingFactory = ParticipationVotingFactory(_participationVotingFactory);
        treasuryFactory = TreasuryFactory(_treasuryFactory);
        nftMembershipFactory = NFTMembershipFactory(_nftMembershipFactory);
        registryFactory = RegistryFactory(_registryFactory);
        taskManagerFactory = TaskManagerFactory(_taskManagerFactory);
    }

    function deployAll(DeployParams memory params) public {
        address[] memory contractAddresses = new address[](8);

        deployStandardContracts(contractAddresses, params.memberTypeNames, params.executivePermissionNames, params.logoURL, params.POname);

        deployConditionalContracts(contractAddresses, params.quadraticVotingEnabled, params.democracyVoteWeight, params.participationVoteWeight, params.hybridVotingEnabled, params.participationVotingEnabled, params.POname);
        
        address votingControlAddress = determineVotingControlAddress(params.votingControlType, contractAddresses);

         // 9. Set TaskManager in particpation token contract
        IParticipationToken token = IParticipationToken(contractAddresses[2]);
        token.setTaskManagerAddress(contractAddresses[7]);
        // 10. Set Voting Contract in Treasury
        ITreasury treasury = ITreasury(contractAddresses[3]);
        treasury.setVotingContractAddress(votingControlAddress);

        
        registryFactory.createRegistry(votingControlAddress, params.contractNames, contractAddresses, params.POname, params.logoURL);
    }


    // Splitting deployment functions for clarity and reducing stack depth
    function deployNFTMembership(
        string[] memory memberTypeNames,
        string[] memory executivePermissionNames,
        string memory logoURL,
        string memory POname
    ) internal returns (address) {
        return nftMembershipFactory.createNFTMembership(memberTypeNames, executivePermissionNames, logoURL, POname);
    }

    function deployDirectDemocracyToken(
        address nftAddress,
        string[] memory executivePermissionNames,
        string memory POname
    ) internal returns (address) {
        return directDemocracyTokenFactory.createDirectDemocracyToken("DirectDemocracyToken", "DDT", nftAddress, executivePermissionNames, POname);
    }

    function deployParticipationToken(string memory POname) internal returns (address) {
        return participationTokenFactory.createParticipationToken("ParticipationToken", "PT", POname);
    }

    function deployTreasury(string memory POname) internal returns (address) {
        return treasuryFactory.createTreasury(POname);
    }

    function deployStandardContracts(
        address[] memory contractAddresses,
        string[] memory memberTypeNames,
        string[] memory executivePermissionNames,
        string memory logoURL,
        string memory POname
    ) internal {
        contractAddresses[0] = deployNFTMembership(memberTypeNames, executivePermissionNames, logoURL, POname);
        contractAddresses[1] = deployDirectDemocracyToken(contractAddresses[0], executivePermissionNames, POname);
        contractAddresses[2] = deployParticipationToken(POname);
        contractAddresses[3] = deployTreasury(POname);
    }
    

    function deployConditionalContracts(
        address[] memory contractAddresses,
        bool quadraticVotingEnabled,
        uint256 democracyVoteWeight,
        uint256 participationVoteWeight,
        bool hybridVotingEnabled,
        bool participationVotingEnabled,
        string memory POname
    ) internal {
        contractAddresses[4] = participationVotingEnabled 
            ? participationVotingFactory.createParticipationVoting(contractAddresses[2], contractAddresses[0], new string[](0), quadraticVotingEnabled, contractAddresses[3], POname) 
            : address(0);
        contractAddresses[5] = directDemocracyVotingFactory.createDirectDemocracyVoting(contractAddresses[1], contractAddresses[0], new string[](0), contractAddresses[3], POname);
        contractAddresses[6] = hybridVotingEnabled 
            ? hybridVotingFactory.createHybridVoting(contractAddresses[2], contractAddresses[1], contractAddresses[0], new string[](0), quadraticVotingEnabled, democracyVoteWeight, participationVoteWeight, contractAddresses[3], POname) 
            : address(0);
        contractAddresses[7] = taskManagerFactory.createTaskManager(contractAddresses[2], contractAddresses[0], new string[](0), POname);
    }

    function determineVotingControlAddress(
        string memory votingControlType, 
        address[] memory contractAddresses
    ) internal pure returns (address) {
        if (keccak256(abi.encodePacked(votingControlType)) == keccak256(abi.encodePacked("Hybrid"))) {
            return contractAddresses[6];
        } else if (keccak256(abi.encodePacked(votingControlType)) == keccak256(abi.encodePacked("DirectDemocracy"))) {
            return contractAddresses[5];
        } else if (keccak256(abi.encodePacked(votingControlType)) == keccak256(abi.encodePacked("Participation"))) {
            return contractAddresses[4];
        } else {
            revert("Invalid voting control type");
        }
    }
}