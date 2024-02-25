// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Treasury {
    address public votingContract;

    constructor(address _votingContract) {
        require(_votingContract != address(0), "Invalid voting contract address");
        votingContract = _votingContract;
    }

    modifier onlyVotingContract() {
        require(msg.sender == votingContract, "Caller is not the voting contract");
        _;
    }

    function sendTokens(address _token, address _to, uint256 _amount) external onlyVotingContract {
        require(IERC20(_token).balanceOf(address(this)) >= _amount, "Insufficient balance");
        require(IERC20(_token).transfer(_to, _amount), "Transfer failed");
    }

    // Optional: Function to receive Ether in the contract, making it capable of holding ETH as well.
    receive() external payable {}

    // Function to allow the contract to receive ERC-20 tokens directly
    function receiveTokens(address _token, uint256 _amount) public {
        IERC20(_token).transfer(msg.sender, _amount);
    }
}
