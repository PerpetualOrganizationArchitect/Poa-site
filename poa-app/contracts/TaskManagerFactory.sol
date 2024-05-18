// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TaskManager.sol"; 

contract TaskManagerFactory {


    event TaskManagerCreated(address TaskManager, string POname);

   
    function createTaskManager(address _token, address _nftMembership, string[] memory _allowedRoleNames, string memory POname) external returns (address) {
        TaskManager newTaskManager = new TaskManager(_token, _nftMembership, _allowedRoleNames);

        emit TaskManagerCreated(address(newTaskManager), POname);

        return address(newTaskManager);
    }

}
