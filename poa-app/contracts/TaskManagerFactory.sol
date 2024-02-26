// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TaskManager.sol"; 

contract TaskManagerFactory {

    address[] public taskManagers;


    event TaskManagerCreated(address indexed admin, address TaskManager);

   
    function createTaskManager(address _token, address _nftMembership, string[] memory _allowedRoleNames) external returns (address) {
        TaskManager newTaskManager = new TaskManager(_token, _nftMembership, _allowedRoleNames);
        taskManagers.push(address(newTaskManager));

        emit TaskManagerCreated(msg.sender, address(newTaskManager));

        return address(newTaskManager);
    }


    function getAllTaskManagers() external view returns (address[] memory) {
        return taskManagers;
    }
}
