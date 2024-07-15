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
import "./QuickJoinFactory.sol";

contract MasterFactory {

    event DeployParamsLog(
        string[] memberTypeNames,
        string[] executivePermissionNames,
        string POname,
        bool quadraticVotingEnabled,
        uint256 democracyVoteWeight,
        uint256 participationVoteWeight,
        bool hybridVotingEnabled,
        bool participationVotingEnabled,
        string logoURL,
        string votingControlType,
        string[] contractNames
    );

    DirectDemocracyVotingFactory directDemocracyVotingFactory;
    DirectDemocracyTokenFactory directDemocracyTokenFactory;
    HybridVotingFactory hybridVotingFactory;
    ParticipationTokenFactory participationTokenFactory;
    ParticipationVotingFactory participationVotingFactory;
    TreasuryFactory treasuryFactory;
    NFTMembershipFactory nftMembershipFactory;
    RegistryFactory registryFactory;
    TaskManagerFactory taskManagerFactory;
    QuickJoinFactory quickJoinFactory;
    address accountManagerAddress;

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
        string infoIPFSHash;
        string votingControlType;
        string[] contractNames;
        uint256 quorumPercentageDD;
        uint256 quorumPercentagePV;
        string username;
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
        address _taskManagerFactory,
        address _quickJoinFactory,
        address _accountManagerAddress
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
        quickJoinFactory = QuickJoinFactory(_quickJoinFactory);
        accountManagerAddress = _accountManagerAddress;
    }

    function deployAll(DeployParams memory params) public {
        emit DeployParamsLog(
            params.memberTypeNames,
            params.executivePermissionNames,
            params.POname,
            params.quadraticVotingEnabled,
            params.democracyVoteWeight,
            params.participationVoteWeight,
            params.hybridVotingEnabled,
            params.participationVotingEnabled,
            params.logoURL,
            params.votingControlType,
            params.contractNames
        );

        address[] memory contractAddresses = new address[](8); // Increased size to include QuickJoin address

        deployStandardContracts(contractAddresses, params.memberTypeNames, params.executivePermissionNames, params.logoURL, params.POname);
        deployConditionalContracts(contractAddresses, params);
        
        address votingControlAddress = determineVotingControlAddress(params.votingControlType, contractAddresses);

        // Set TaskManager in participation token contract
        IParticipationToken token = IParticipationToken(contractAddresses[2]);
        token.setTaskManagerAddress(contractAddresses[6]);
        // Set Voting Contract in Treasury
        ITreasury treasury = ITreasury(contractAddresses[3]);
        treasury.setVotingContract(votingControlAddress);

        contractAddresses[7] = quickJoinFactory.createQuickJoin(contractAddresses[0], contractAddresses[1], accountManagerAddress, params.POname);

        registryFactory.createRegistry(votingControlAddress, params.contractNames, contractAddresses, params.POname, params.logoURL, params.infoIPFSHash);

        IQuickJoin quickJoin = IQuickJoin(contractAddresses[7]);
        
        if (bytes(params.username).length > 0) {
            quickJoin.quickJoinNoUser(params.username);
        } else {
            quickJoin.quickJoinWithUser();
        }
       
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
        contractAddresses[1] = deployDirectDemocracyToken(contractAddresses[0], memberTypeNames, POname);
        contractAddresses[2] = deployParticipationToken(POname);
        contractAddresses[3] = deployTreasury(POname);
    }
    
    function deployConditionalContracts(
        address[] memory contractAddresses,
        DeployParams memory params
    ) internal {
        contractAddresses[5] = params.participationVotingEnabled 
            ? deployPartcipationVoting(contractAddresses, params.executivePermissionNames, params.quadraticVotingEnabled, params.POname, params.quorumPercentagePV) 
            : address(0);
        contractAddresses[4] = deployDemocracyVoting(contractAddresses, params.executivePermissionNames, params.POname, params.quorumPercentageDD);
        contractAddresses[5] = params.hybridVotingEnabled 
            ? deployHybridVoting(contractAddresses, params)
            : address(0);
        if(!params.hybridVotingEnabled && !params.participationVotingEnabled) {
             contractAddresses[5] = address(0);
        }
        contractAddresses[6] = taskManagerFactory.createTaskManager(contractAddresses[2], contractAddresses[0], params.executivePermissionNames, params.POname);
    }

    function deployPartcipationVoting(
        address[] memory contractAddresses,
        string[] memory _allowedRoleNames,
        bool _quadraticVotingEnabled,
        string memory POname, 
        uint256 quorumPercentagePV
    ) internal returns (address) {
        return participationVotingFactory.createParticipationVoting(contractAddresses[2], contractAddresses[0], _allowedRoleNames, _quadraticVotingEnabled, contractAddresses[3], POname, quorumPercentagePV);
    }

    function deployDemocracyVoting(
        address[] memory contractAddresses,
        string[] memory _allowedRoleNames,
        string memory POname,
        uint256 quorumPercentageDD
    ) internal returns (address) {
        return directDemocracyVotingFactory.createDirectDemocracyVoting(contractAddresses[1], contractAddresses[0], _allowedRoleNames, contractAddresses[3], POname, quorumPercentageDD);
    }

    function deployHybridVoting(
        address[] memory contractAddresses,
        DeployParams memory params
    ) internal returns (address) {
        return hybridVotingFactory.createHybridVoting(
            contractAddresses[2],
            contractAddresses[1],
            contractAddresses[0],
            params.executivePermissionNames,
            params.quadraticVotingEnabled,
            params.democracyVoteWeight,
            params.participationVoteWeight,
            contractAddresses[3],
            params.POname,
            params.quorumPercentagePV
        );
    }
   
    function determineVotingControlAddress(
        string memory votingControlType, 
        address[] memory contractAddresses
    ) internal pure returns (address) {
        if (keccak256(abi.encodePacked(votingControlType)) == keccak256(abi.encodePacked("Hybrid"))) {
            return contractAddresses[5];
        } else if (keccak256(abi.encodePacked(votingControlType)) == keccak256(abi.encodePacked("DirectDemocracy"))) {
            return contractAddresses[4];
        } else if (keccak256(abi.encodePacked(votingControlType)) == keccak256(abi.encodePacked("Participation"))) {
            return contractAddresses[5];
        } else {
            revert("Invalid voting control type");
        }
    }
}

interface  IQuickJoin {
    function quickJoinNoUser(string memory userName) external;
    function quickJoinWithUser() external;
}
   