// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface INFTMembership2 {
    function checkMemberTypeByAddress(address user) external view returns (string memory);
}

interface ITreasury {
    function sendTokens(address _token, address _to, uint256 _amount) external;
    function setVotingContract(address _votingContract) external;
}


contract DirectDemocracyVoting {
    IERC20 public DirectDemocracyToken;
    INFTMembership2 public nftMembership;
    ITreasury public treasury;

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
    }

    Proposal[] private proposals;

    event NewProposal(uint256 indexed proposalId, string name, string description, uint256 timeInMinutes, uint256 creationTimestamp,  uint256 transferTriggerOptionIndex, address transferRecipient, uint256 transferAmount, bool transferEnabled);
    event Voted(uint256 indexed proposalId, address indexed voter, uint256 optionIndex);
    event PollOptionNames(uint256 indexed proposalId, uint256 indexed optionIndex, string name);
    event WinnerAnnounced(uint256 indexed proposalId, uint256 winningOptionIndex, bool hasValidWinner);


    mapping(string => bool) private allowedRoles;

    constructor(address _ddToken, address _nftMembership, string[] memory _allowedRoleNames , address _treasuryAddress, uint256 _quorumPercentage) {
        quorumPercentage = _quorumPercentage;
        DirectDemocracyToken = IERC20(_ddToken);
        nftMembership = INFTMembership2(_nftMembership); 
        treasury = ITreasury(_treasuryAddress);
        
        for (uint i = 0; i < _allowedRoleNames.length; i++) {
            allowedRoles[_allowedRoleNames[i]] = true;
        }
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
        newProposal.totalVotes = 0;
        newProposal.timeInMinutes = _timeInMinutes;
        newProposal.creationTimestamp = block.timestamp;
        newProposal.transferTriggerOptionIndex = _transferTriggerOptionIndex;
        newProposal.transferRecipient = _transferRecipient;
        newProposal.transferAmount = _transferAmount;

        uint256 proposalId = proposals.length - 1;
        emit NewProposal(proposalId, _name, _description, _timeInMinutes, block.timestamp, _transferTriggerOptionIndex, _transferRecipient, _transferAmount, _transferEnabled);

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
        uint256 balance = DirectDemocracyToken.balanceOf(_voter);
        require(balance > 0, "No democracy tokens");

        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        require(!proposal.hasVoted[_voter], "Already voted");


        proposal.hasVoted[_voter] = true;
        proposal.totalVotes += 1;
        proposal.options[_optionIndex].votes += 1;

        emit Voted(_proposalId, _voter, _optionIndex);
    }

    function announceWinner(uint256 _proposalId) external whenExpired(_proposalId) {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        


        (uint256 winningOptionIndex, bool hasValidWinner) = getWinner(_proposalId);

        if (hasValidWinner && proposals[_proposalId].transferEnabled && winningOptionIndex == proposals[_proposalId].transferTriggerOptionIndex) {
            treasury.sendTokens(address(DirectDemocracyToken), proposals[_proposalId].transferRecipient, proposals[_proposalId].transferAmount);
        }

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
