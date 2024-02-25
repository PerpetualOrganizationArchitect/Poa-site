// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TaskManager {
    struct Task {
        uint256 id;
        uint256 payout;
        bool isCompleted;
        address claimer;
    }

    address public admin;
    IERC20 public token;
    mapping(uint256 => Task) public tasks;
    uint256 public nextTaskId;

    event TaskCreated(uint256 indexed id, uint256 payout, string ipfsHash);
    event TaskUpdated(uint256 indexed id, uint256 payout, string ipfsHash);
    event TaskCompleted(uint256 indexed id, address indexed completer);
    event ProjectCreated(string projectName);
    event ProjectDeleted(string projectName);

    constructor(address _token) {
        admin = msg.sender;
        token = IERC20(_token);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function createTask(uint256 _payout, string calldata ipfsHash) external onlyAdmin {
        uint256 taskId = nextTaskId++;
        tasks[taskId] = Task(taskId, _payout, false, address(0));
        emit TaskCreated(taskId, _payout, ipfsHash);
    }

    function updateTask(uint256 _taskId, uint256 _payout, string calldata ipfsHash) external onlyAdmin {
        Task storage task = tasks[_taskId];
        require(!task.isCompleted, "Task already completed");
        require(task.claimer == address(0), "Task already claimed");
        task.payout = _payout;
        emit TaskUpdated(_taskId, _payout, ipfsHash);
    }

    function completeTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        require(!task.isCompleted, "Task already completed");
        task.isCompleted = true;
        //implement functionality for token minting 
        emit TaskCompleted(_taskId, msg.sender);
    }

    function claimTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        require(!task.isCompleted, "Task already completed");
        require(task.claimer == address(0), "Task already claimed");
        task.claimer = msg.sender;
    }

    function createProject(string calldata projectName) external onlyAdmin {
        emit ProjectCreated(projectName);
    }

    function deleteProject(string calldata projectName) external onlyAdmin {
        emit ProjectDeleted(projectName);
    }

}
