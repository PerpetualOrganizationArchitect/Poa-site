// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC202 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Treasury {
    address public votingContract;
    event TokensSent(address indexed token, address indexed to, uint256 amount);
    event TokensReceived(address indexed token, address indexed from, uint256 amount);
    event EtherWithdrawn(address indexed to, uint256 amount);
    event VotingContractSet(address votingContract);

    constructor() {
    }

    function setVotingContract(address _votingContract) external  {
        require(votingContract == address(0), "Voting contract already set");
        votingContract = _votingContract;
        emit VotingContractSet(_votingContract);

    }

    modifier onlyVotingContract() {
        require(msg.sender == votingContract, "Caller is not the voting contract");
        _;
    }

    function sendTokens(address _token, address _to, uint256 _amount) external onlyVotingContract {
        require(IERC202(_token).balanceOf(address(this)) >= _amount, "Insufficient balance");
        require(IERC202(_token).transfer(_to, _amount), "Transfer failed");
        emit TokensSent(_token, _to, _amount);
    }

    function receiveTokens(address _token, address _from, uint256 _amount) public {
        require(IERC202(_token).transferFrom(_from, address(this), _amount), "Transfer failed");
        emit TokensReceived(_token, _from, _amount);
    }

    function withdrawEther(address payable _to, uint256 _amount) external onlyVotingContract {
        require(address(this).balance >= _amount, "Insufficient Ether balance");
        (bool sent, ) = _to.call{value: _amount}("");
        require(sent, "Failed to send Ether");
        emit EtherWithdrawn(_to, _amount);
    }

    receive() external payable {}
}
