// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./MembershipNFT.sol";

contract NFTMembershipFactory {

    event ContractCreated(address contractAddress, string[] memberTypeNames, string[] executiveRoleNames, string defaultImageURL, string POname);

    function createNFTMembership(string[] memory memberTypeNames, string[] memory _executiveRoleNames, string memory _defaultImageURL, string memory POname) public returns (address){
        NFTMembership newContract = new NFTMembership(memberTypeNames, _executiveRoleNames, _defaultImageURL);
        emit ContractCreated(address(newContract), memberTypeNames, _executiveRoleNames, _defaultImageURL, POname);
        return address(newContract);
    }

}