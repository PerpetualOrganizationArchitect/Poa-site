// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract NFTMembership is ERC721URIStorage, Ownable{
   
    uint256 private _nextTokenId;

    mapping(uint256 => string) public memberTypeNames; // tokenId to memberType name
    mapping(string => string) public memberTypeImages; // memberType name to image URL


    constructor(string[] memory _memberTypeNames) ERC721("MembershipNFT", "MNF") Ownable(msg.sender) {
        for (uint256 i = 0; i < _memberTypeNames.length; i++) {
            memberTypeNames[i] = _memberTypeNames[i];
        }
    }


    function setMemberTypeImage(string memory memberTypeName, string memory imageURL) public onlyOwner {
        memberTypeImages[memberTypeName] = imageURL;
    }

    // Function to mint an NFT for a specific member type
    function mintNFT(address recipient, string memory memberTypeName) public onlyOwner {
        require(bytes(memberTypeImages[memberTypeName]).length > 0, "Image for member type not set");
        string memory tokenURI = memberTypeImages[memberTypeName];
        uint256 tokenId = _nextTokenId++;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }
}

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
