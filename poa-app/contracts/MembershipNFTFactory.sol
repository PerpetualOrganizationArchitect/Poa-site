// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./MembershipNFT.sol";

contract NFTMembershipFactory {
    address[] public deployedContracts;

    function createNFTMembership(string[] memory memberTypeNames, string memory _defaultImageURL) public {
        NFTMembership newContract = new NFTMembership(memberTypeNames, _defaultImageURL);
        deployedContracts.push(address(newContract));
    }

    function getDeployedContracts() public view returns (address[] memory) {
        return deployedContracts;
    }
}