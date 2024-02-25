// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ParticipationVoting {
    using SafeMath for uint256;
    IERC20 public ParticipationToken;
    address public dao;

    struct PollOption {
        uint256 votes;
    }

    struct Proposal {
        uint256 totalVotes;
        mapping(address => bool) hasVoted;
        uint256 timeInMinutes;
        uint256 creationTimestamp;
        PollOption[] options;
    }

    Proposal[] private proposals;

    event NewProposal(uint256 indexed proposalId, string name, string description, string execution, uint256 timeInMinutes, uint256 creationTimestamp);

    event Voted(uint256 indexed proposalId, address indexed voter, uint256 optionIndex, uint256 voteWeight);
    event PollOptionNames(uint256 indexed proposalId, uint256 indexed optionIndex, string name);
    event WinnerAnnounced(uint256 indexed proposalId, uint256 winningOptionIndex);

    constructor(address _ParticipationToken, address _dao) {
        ParticipationToken = IERC20(_ParticipationToken);
        dao = _dao;
    }

    modifier onlyDAO() {
        require(msg.sender == dao, "Only DAO can call this function");
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
        string memory _execution,
        uint256 _timeInMinutes,
        string[] memory _optionNames
    ) external  {

        Proposal storage newProposal = proposals.push();
        newProposal.totalVotes = 0;
        newProposal.timeInMinutes = _timeInMinutes;
        newProposal.creationTimestamp = block.timestamp;

        uint256 proposalId = proposals.length - 1;
        emit NewProposal(proposalId, _name, _description, _execution, _timeInMinutes, block.timestamp);

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


        uint256 voteWeight = calculateVoteWeight(balance);

        proposal.hasVoted[_voter] = true;
        proposal.totalVotes += voteWeight;
        proposal.options[_optionIndex].votes += voteWeight;

        emit Voted(_proposalId, _voter, _optionIndex, voteWeight);
    }

    function calculateVoteWeight(uint256 _balance) public pure returns (uint256) {
        uint256 adjustedBalance = _balance;

        uint256 voteWeight = sqrt(adjustedBalance);

        return voteWeight;
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
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.creationTimestamp + proposal.timeInMinutes * 1 minutes, "Voting is not yet closed");

        uint256 winningOptionIndex = getWinner(_proposalId);

        emit WinnerAnnounced(_proposalId, winningOptionIndex);
    }

    function getWinner(uint256 _proposalId) internal view returns (uint256 winningOptionIndex) {
        require(_proposalId < proposals.length, "Invalid proposal ID");
        Proposal storage proposal = proposals[_proposalId];
        uint256 highestVotes = 0;

        for (uint256 i = 0; i < proposal.options.length; i++) {
            if (proposal.options[i].votes > highestVotes) {
                highestVotes = proposal.options[i].votes;
                winningOptionIndex = i;
            }
        }
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
