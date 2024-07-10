// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//importnaant vote weights arent percerntages but integers 

interface INFTMembership3 {
    function checkMemberTypeByAddress(address user) external view returns (string memory);
}

interface ITreasury2{
    function sendTokens(address _token, address _to, uint256 _amount) external;
}


contract HybridVoting {
    IERC20 public ParticipationToken;
    IERC20 public DirectDemocracyToken;
    INFTMembership3 public nftMembership;
    ITreasury2 public treasury;

    uint256 public quorumPercentage = 50;

    struct PollOption {
        uint256 votesPT;
        uint256 votesDDT;
    }

    struct Proposal {
        uint256 totalVotesPT;
        uint256 totalVotesDDT;
        mapping(address => bool) hasVoted;
        uint256 timeInMinutes;
        uint256 creationTimestamp;
        PollOption[] options;
        uint256 transferTriggerOptionIndex;
        address payable transferRecipient;
        uint256 transferAmount;
        bool transferEnabled;
    }

    Proposal[] private proposals;


    uint256 public democracyVoteWeight;
    uint256 public participationVoteWeight;

    event NewProposal(uint256 indexed proposalId, string name, string description, uint256 timeInMinutes, uint256 creationTimestamp,  uint256 transferTriggerOptionIndex, address transferRecipient, uint256 transferAmount, bool transferEnabled);
    event Voted(uint256 indexed proposalId, address indexed voter, uint256 optionIndex, uint256 voteWeightPT, uint256 voteWeightDDT);
    event PollOptionNames(uint256 indexed proposalId, uint256 indexed optionIndex, string name);
    event WinnerAnnounced(uint256 indexed proposalId, uint256 winningOptionIndex, bool hasValidWinner);

    mapping(string => bool) private allowedRoles;

    bool public quadraticVotingEnabled;

    constructor(address _ParticipationToken, address _DemocracyToken, address _nftMembership, string[] memory _allowedRoleNames, bool _quadraticVotingEnabled, uint256 _democracyVoteWeight, uint256 _participationVoteWeight, address _treasuryAddress, uint256 _quorumPercentage) {
        quorumPercentage = _quorumPercentage;
        ParticipationToken = IERC20(_ParticipationToken);
        DirectDemocracyToken = IERC20(_DemocracyToken);
        nftMembership = INFTMembership3(_nftMembership);

        for (uint256 i = 0; i < _allowedRoleNames.length; i++) {
            allowedRoles[_allowedRoleNames[i]] = true;
        }

        quadraticVotingEnabled = _quadraticVotingEnabled;

        democracyVoteWeight = _democracyVoteWeight;
        participationVoteWeight = _participationVoteWeight;
        treasury = ITreasury2(_treasuryAddress);

    }

    modifier canCreateProposal() {
        string memory memberType = nftMembership.checkMemberTypeByAddress(msg.sender);
        require(allowedRoles[memberType], "Not authorized to create proposal");
        _;
    }

    modifier whenNotExpired(uint256 _proposalId) {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp <= proposal.creationTimestamp + proposal.timeInMinutes * 1 minutes, "Voting time expired");
        _;
    }

    modifier whenExpired(uint256 _proposalId) {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.creationTimestamp + proposal.timeInMinutes * 1 minutes, "Voting is not yet closed");
        _;
    }

    function createProposal(
        string memory _name,
        string memory _description,
        uint256 _timeInMinutes,
        string[] memory _optionNames,
        uint256 _transferTriggerOptionIndex,
        address payable _transferRecipient,
        uint256 _transferAmount,
        bool _transferEnabled
    ) external canCreateProposal {

        Proposal storage newProposal = proposals.push();
        newProposal.totalVotesPT = 0;
        newProposal.totalVotesDDT = 0;
        newProposal.timeInMinutes = _timeInMinutes;
        newProposal.creationTimestamp = block.timestamp;
        newProposal.transferRecipient = _transferRecipient;
        newProposal.transferAmount = _transferAmount;
        newProposal.transferTriggerOptionIndex = _transferTriggerOptionIndex;
        newProposal.transferEnabled = _transferEnabled;

        uint256 proposalId = proposals.length - 1;
        emit NewProposal(proposalId, _name, _description, _timeInMinutes, block.timestamp, _transferTriggerOptionIndex, _transferRecipient, _transferAmount, _transferEnabled);

        for (uint256 i = 0; i < _optionNames.length; i++) {
            newProposal.options.push(PollOption(0,0));
            emit PollOptionNames(proposalId, i, _optionNames[i]);
        }
    }

    function vote(
        uint256 _proposalId,
        address _voter,
        uint256 _optionIndex
    ) external whenNotExpired(_proposalId) {

        uint256 balanceDDT = DirectDemocracyToken.balanceOf(_voter);
        require(balanceDDT > 0, "No democracy tokens");
        uint256 balancePT = ParticipationToken.balanceOf(_voter);

        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.hasVoted[_voter], "Already voted");

        uint256 voteWeightPT = quadraticVotingEnabled ? calculateQuadraticVoteWeight(balancePT) : balancePT;

        proposal.hasVoted[_voter] = true;
        proposal.totalVotesPT += voteWeightPT;
        proposal.options[_optionIndex].votesPT += voteWeightPT;
        proposal.totalVotesDDT += balanceDDT;
        proposal.options[_optionIndex].votesDDT += balanceDDT;

        emit Voted(_proposalId, _voter, _optionIndex, voteWeightPT, balanceDDT);
    }

    function calculateQuadraticVoteWeight(uint256 _balance) internal pure returns (uint256) {
        return sqrt(_balance);
    }

    // Helper function to approximate square root 
    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }


    function announceWinner(uint256 _proposalId) external whenExpired(_proposalId) {
        require(_proposalId < proposals.length, "Invalid proposal ID");

        // Retrieve the winning option index and the validity of the win
        (uint256 winningOptionIndex, bool hasValidWinner) = getWinner(_proposalId);

        // Check if there's a valid winner and if the specific winning option triggers a transfer
        if (hasValidWinner && proposals[_proposalId].transferEnabled && winningOptionIndex == proposals[_proposalId].transferTriggerOptionIndex) {
            treasury.sendTokens(address(ParticipationToken), proposals[_proposalId].transferRecipient, proposals[_proposalId].transferAmount);
        }

        // Emitting the winner announcement with additional detail about the win validity
        emit WinnerAnnounced(_proposalId, winningOptionIndex, hasValidWinner);
    }

    function getWinner(uint256 _proposalId) internal view returns (uint256, bool) {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];

        uint256 winningVotes = 0;
        uint256 winningOptionIndex = 0;
        bool hasValidWinner = false;

        uint256 totalVotesPT = proposal.totalVotesPT;
        uint256 totalVotesDDT = proposal.totalVotesDDT;

        uint256 scalingFactor = 1e9; 

        uint256 totalWeightedVotes = 0;
        uint256[] memory optionWeights = new uint256[](proposal.options.length);

        for (uint256 i = 0; i < proposal.options.length; i++) {
            uint256 votesPT = proposal.options[i].votesPT;
            uint256 votesDDT = proposal.options[i].votesDDT;

            // Properly calculate the weighted votes for each option checking for 0
            uint256 weightedVotesPT = totalVotesPT > 0 ? (votesPT * participationVoteWeight * scalingFactor) / totalVotesPT : 0;
            uint256 weightedVotesDDT = totalVotesDDT > 0 ? (votesDDT * democracyVoteWeight * scalingFactor) / totalVotesDDT : 0;

            uint256 totalVotesWeighted = weightedVotesPT + weightedVotesDDT;
            optionWeights[i] = totalVotesWeighted;
            totalWeightedVotes += totalVotesWeighted;
        }

        // Calculate the quorum threshold as a percentage of total weighted votes
        uint256 quorumThreshold = (totalWeightedVotes * quorumPercentage) / 100;

        for (uint256 i = 0; i < proposal.options.length; i++) {
            uint256 totalVotesWeighted = optionWeights[i];

            // Compare and determine the winning option
            if (totalVotesWeighted > winningVotes) {
                winningVotes = totalVotesWeighted;
                winningOptionIndex = i;
                hasValidWinner = totalWeightedVotes >= quorumThreshold; 
            }
        }

        return (winningOptionIndex, hasValidWinner);
    }




    function getOptionsCount(uint256 _proposalId) public view returns (uint256) {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        return proposal.options.length;
    }

    function getOptionVotes(uint256 _proposalId, uint256 _optionIndex)
        public
        view
        returns (uint256 votesPT, uint256 votesDDT)
    {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(_optionIndex < proposal.options.length, "Invalid option index");
        return (proposal.options[_optionIndex].votesPT, proposal.options[_optionIndex].votesDDT);
    }


}
