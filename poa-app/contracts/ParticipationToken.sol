// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract ParticipationToken is ERC20, Ownable {

    address private taskManagerAddress;

    event Mint(address indexed to, uint256 amount);
    event TaskManagerAddressSet(address taskManagerAddress);


    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    }

    modifier onlyTaskManager() {
        require(msg.sender == taskManagerAddress, "Only the task manager can call this function.");
        _;
    }

    function mint(address to, uint256 amount) public onlyTaskManager {
        _mint(to, amount);
        emit Mint(to, amount);
    }

    function setTaskManagerAddress(address _taskManagerAddress) external onlyOwner {
        taskManagerAddress = _taskManagerAddress;
        renounceOwnership();
        emit TaskManagerAddressSet(_taskManagerAddress);
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal override {
        revert("Transfers are disabled.");
    }
}

