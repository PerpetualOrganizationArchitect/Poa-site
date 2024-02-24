// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "./membership.sol";

contract NFTMembershipFactory {
    address[] public deployedContracts;

    function createNFTMembership(string[] memory memberTypeNames) public {
        NFTMembership newContract = new NFTMembership(memberTypeNames);
        deployedContracts.push(address(newContract));
    }

    function getDeployedContracts() public view returns (address[] memory) {
        return deployedContracts;
    }
}