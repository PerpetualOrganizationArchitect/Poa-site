// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ParticipationToken.sol";

contract ParticipationTokenFactory {

    event TokenCreated(address tokenAddress, string name, string symbol, string POname);

    function createParticipationToken(string memory name, string memory symbol, string memory POname) public returns (address){
        ParticipationToken newToken = new ParticipationToken(name, symbol);
        emit TokenCreated(address(newToken), name, symbol, POname);
        return address(newToken);
    }


}
