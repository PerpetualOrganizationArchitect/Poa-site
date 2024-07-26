// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";



interface INFTMembership5 {
    function checkMemberTypeByAddress(address user) external view returns (string memory);
}

interface ITreasury3 {
    function sendTokens(address _token, address _to, uint256 _amount) external;
    function withdrawEther(address payable _to, uint256 _amount) external;
}


contract ParticipationVoting {
    IERC20 public ParticipationToken;
    INFTMembership5 public nftMembership;
    ITreasury3 public treasury;
    uint256 public quorumPercentage = 50;

    struct PollOption {
        uint256 votes;
    }

    struct Proposal {
        uint256 totalVotes;
        mapping(address => bool) hasVoted;
        uint256 timeInMinutes;
        uint256 creationTimestamp;
        PollOption[] options;
        uint256 transferTriggerOptionIndex;
        address payable transferRecipient;
        uint256 transferAmount;
        bool transferEnabled;
        address transferToken;
    }

    Proposal[] private proposals;

    event NewProposal(uint256 indexed proposalId, string name, string description, uint256 timeInMinutes, uint256 creationTimestamp,  uint256 transferTriggerOptionIndex, address transferRecipient, uint256 transferAmount, bool transferEnabled, address transferToken);
    event Voted(uint256 indexed proposalId, address indexed voter, uint256 optionIndex, uint256 voteWeight);
    event PollOptionNames(uint256 indexed proposalId, uint256 indexed optionIndex, string name);
    event WinnerAnnounced(uint256 indexed proposalId, uint256 winningOptionIndex, bool hasValidWinner);

    mapping(string => bool) private allowedRoles;

    bool public quadraticVotingEnabled;

    constructor(address _ParticipationToken, address _nftMembership, string[] memory _allowedRoleNames, bool _quadraticVotingEnabled, address _treasuryAddress, uint256 _quorumPercentage) {
        quorumPercentage = _quorumPercentage;
        ParticipationToken = IERC20(_ParticipationToken);
        nftMembership = INFTMembership5(_nftMembership);
        treasury = ITreasury3(_treasuryAddress);

        for (uint256 i = 0; i < _allowedRoleNames.length; i++) {
            allowedRoles[_allowedRoleNames[i]] = true;
        }

        quadraticVotingEnabled = _quadraticVotingEnabled;

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
        bool _transferEnabled,
        address _transferToken
    ) external canCreateProposal {

        Proposal storage newProposal = proposals.push();
        newProposal.totalVotes = 0;
        newProposal.timeInMinutes = _timeInMinutes;
        newProposal.creationTimestamp = block.timestamp;
        newProposal.transferTriggerOptionIndex = _transferTriggerOptionIndex;
        newProposal.transferRecipient = _transferRecipient;
        newProposal.transferAmount = _transferAmount;
        newProposal.transferEnabled = _transferEnabled;
        newProposal.transferToken = _transferToken;

        uint256 proposalId = proposals.length - 1;
        emit NewProposal(proposalId, _name, _description, _timeInMinutes, block.timestamp, _transferTriggerOptionIndex, _transferRecipient, _transferAmount, _transferEnabled, _transferToken);

        for (uint256 i = 0; i < _optionNames.length; i++) {
            newProposal.options.push(PollOption(0));
            emit PollOptionNames(proposalId, i, _optionNames[i]);
        }
    }

    function vote(
        uint256 _proposalId,
        address _voter,
        uint256 _optionIndex
    ) external whenNotExpired(_proposalId) {
        uint256 balance = ParticipationToken.balanceOf(_voter);
        require(balance > 0, "No participation tokens");

        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.hasVoted[_voter], "Already voted");


       uint256 voteWeight = quadraticVotingEnabled ? calculateQuadraticVoteWeight(balance) : balance;

        proposal.hasVoted[_voter] = true;
        proposal.totalVotes += voteWeight;
        proposal.options[_optionIndex].votes += voteWeight;

        emit Voted(_proposalId, _voter, _optionIndex, voteWeight);
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
            if(proposals[_proposalId].transferToken == address(0x0000000000000000000000000000000000001010)) {
                treasury.withdrawEther(proposals[_proposalId].transferRecipient, proposals[_proposalId].transferAmount);
            } else {
                treasury.sendTokens(address(proposals[_proposalId].transferToken), proposals[_proposalId].transferRecipient, proposals[_proposalId].transferAmount);
            }
        }

        // Emitting the winner announcement with additional detail about the win validity
        emit WinnerAnnounced(_proposalId, winningOptionIndex, hasValidWinner);
    }



    function getWinner(uint256 _proposalId) public view returns (uint256, bool) {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        uint256 highestVotes = 0;
        uint256 winningOptionIndex = 0;  
        bool hasValidWinner = false;
        uint256 quorumThreshold = (proposal.totalVotes * quorumPercentage);

        // Determine the option with the highest votes that meets or exceeds the quorum
        for (uint256 i = 0; i < proposal.options.length; i++) {
            if (proposal.options[i].votes > highestVotes) {
                highestVotes = proposal.options[i].votes;
                winningOptionIndex = i;
                hasValidWinner = highestVotes*100 >= quorumThreshold;
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
        returns (uint256 votes)
    {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(_optionIndex < proposal.options.length, "Invalid option index");
        return proposal.options[_optionIndex].votes;
    }



}
