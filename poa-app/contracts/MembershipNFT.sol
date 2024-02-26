// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract NFTMembership is ERC721URIStorage, Ownable{
   
    uint256 private _nextTokenId;

    mapping(uint256 => string) public memberTypeNames; 
    mapping(string => string) public memberTypeImages; 
    mapping(address => string) public memberTypeOf;

    string private constant DEFAULT_MEMBER_TYPE = "Default";
    string private defaultImageURL; 

    constructor(string[] memory _memberTypeNames, string memory _defaultImageURL) ERC721("MembershipNFT", "MNF") {
        defaultImageURL = _defaultImageURL; 
        for (uint256 i = 0; i < _memberTypeNames.length; i++) {
            memberTypeNames[i] = _memberTypeNames[i];
            
            memberTypeImages[_memberTypeNames[i]] = _defaultImageURL;
        }
    }


    function setMemberTypeImage(string memory memberTypeName, string memory imageURL) public onlyOwner {
        memberTypeImages[memberTypeName] = imageURL;
    }


    function checkMemberTypeByAddress(address user) public view returns (string memory) {
        require(bytes(memberTypeOf[user]).length > 0, "No member type found for user.");
        return memberTypeOf[user];
    }

    function mintNFT(address recipient, string memory memberTypeName) public onlyOwner {
        require(bytes(memberTypeImages[memberTypeName]).length > 0, "Image for member type not set");
        string memory tokenURI = memberTypeImages[memberTypeName];
        uint256 tokenId = _nextTokenId++;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        memberTypeOf[recipient] = memberTypeName;
    }

    function changeMembershipType(address user, string memory newMemberType) public onlyOwner {
        require(bytes(memberTypeImages[newMemberType]).length > 0, "Image for member type not set");
        memberTypeOf[user] = newMemberType;
    }

    function mintDefaultNFT() public {
        string memory tokenURI = defaultImageURL;
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        memberTypeOf[msg.sender] = DEFAULT_MEMBER_TYPE;
    }


    
}


