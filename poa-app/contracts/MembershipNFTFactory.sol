// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./MembershipNFT.sol";

contract NFTMembershipFactory {
    address[] public deployedContracts;

    event ContractCreated(address contractAddress, string[] memberTypeNames, string[] executiveRoleNames, string defaultImageURL, string POname);

    function createNFTMembership(string[] memory memberTypeNames, string[] memory _executiveRoleNames, string memory _defaultImageURL, string memory POname) public {
        NFTMembership newContract = new NFTMembership(memberTypeNames, _executiveRoleNames, _defaultImageURL);
        deployedContracts.push(address(newContract));
        emit ContractCreated(address(newContract), memberTypeNames, _executiveRoleNames, _defaultImageURL, POname);
    }

    function getDeployedContracts() public view returns (address[] memory) {
        return deployedContracts;
    }
}