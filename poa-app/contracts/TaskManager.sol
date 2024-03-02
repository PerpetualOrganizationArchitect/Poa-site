// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface INFTMembership {
    function checkMemberTypeByAddress(address user) external view returns (string memory);
}

interface IParticipationToken {
    function mint(address to, uint256 amount) external;
}

contract TaskManager {
    struct Task {
        uint256 id;
        uint256 payout;
        bool isCompleted;
        address claimer;
    }


    IParticipationToken public token;
    INFTMembership public nftMembership;





    mapping(uint256 => Task) public tasks;
    uint256 public nextTaskId;

    event TaskCreated(uint256 indexed id, uint256 payout, string ipfsHash, string projectName);
    event TaskClaimed(uint256 indexed id, address indexed claimer);
    event TaskUpdated(uint256 indexed id, uint256 payout, string ipfsHash);
    event TaskCompleted(uint256 indexed id, address indexed completer);
    event ProjectCreated(string projectName);
    event ProjectDeleted(string projectName);

    mapping(string => bool) private allowedRoles;

    constructor(address _token, address _nftMembership, string[] memory _allowedRoleNames) {
        token = IParticipationToken(_token);

        nftMembership = INFTMembership(_nftMembership);

        for (uint256 i = 0; i < _allowedRoleNames.length; i++) {
            allowedRoles[_allowedRoleNames[i]] = true;
        }
    }

    modifier canTask() {
        string memory memberType = nftMembership.checkMemberTypeByAddress(msg.sender);
        require(allowedRoles[memberType], "Not authorized to create task");
        _;
    }

    modifier isMember() {
        string memory memberType = nftMembership.checkMemberTypeByAddress(msg.sender);
        require(bytes(memberType).length != 0, "Not a member");
        _;
    }

    function createTask(uint256 _payout, string calldata ipfsHash, string memory projectName) external canTask{
        uint256 taskId = nextTaskId++;
        tasks[taskId] = Task(taskId, _payout, false, address(0));
        emit TaskCreated(taskId, _payout, ipfsHash, projectName);
    }

    function updateTask(uint256 _taskId, uint256 _payout, string calldata ipfsHash) external canTask {
        Task storage task = tasks[_taskId];
        require(!task.isCompleted, "Task already completed");
        task.payout = _payout;
        emit TaskUpdated(_taskId, _payout, ipfsHash);
    }

    function completeTask(uint256 _taskId) external canTask {
        Task storage task = tasks[_taskId];
        require(!task.isCompleted, "Task already completed");
        task.isCompleted = true;
        token.mint(task.claimer, task.payout);
        emit TaskCompleted(_taskId, msg.sender);
    }

    function claimTask(uint256 _taskId) external isMember {
        Task storage task = tasks[_taskId];
        require(!task.isCompleted, "Task already completed");
        require(task.claimer == address(0), "Task already claimed");
        task.claimer = msg.sender;
        emit TaskClaimed(_taskId, msg.sender);
        
    }

    function createProject(string calldata projectName) external canTask {
        emit ProjectCreated(projectName);
    }

    function deleteProject(string calldata projectName) external canTask  {
        emit ProjectDeleted(projectName);
    }

}
