// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract NFTMembership is ERC721URIStorage, Ownable{
   
    uint256 private _nextTokenId;

    mapping(uint256 => string) public memberTypeNames; 
    mapping(string => string) public memberTypeImages; 
    mapping(address => string) public memberTypeOf;
    mapping(uint256 => string) public executiveRoleNames;
    mapping(string => bool) public isExecutiveRole;

    address quickJoin; 
    bool quickJoinSet = false;



    string private constant DEFAULT_MEMBER_TYPE = "Default";
    string private defaultImageURL; 

    event mintedNFT(address recipient, string memberTypeName, string tokenURI);
    event membershipTypeChanged(address user, string newMemberType);

    constructor(string[] memory _memberTypeNames, string[] memory _executiveRoleNames, string memory _defaultImageURL) ERC721("MembershipNFT", "MNF") {
        defaultImageURL = _defaultImageURL; 
        for (uint256 i = 0; i < _memberTypeNames.length; i++) {
            memberTypeNames[i] = _memberTypeNames[i];
            
            memberTypeImages[_memberTypeNames[i]] = _defaultImageURL;
        }

        for (uint256 i = 0; i < _executiveRoleNames.length; i++) {
            
            isExecutiveRole[_executiveRoleNames[i]] = true;
        }
    }

    modifier onlyExecutiveRole() {
        require(isExecutiveRole[memberTypeOf[msg.sender]], "Not an executive role");
        _;
    }

    function setQuickJoin(address _quickJoin) public {
        require(!quickJoinSet, "QuickJoin already set");
        quickJoin = _quickJoin;
        quickJoinSet = true;

    }

    modifier onlyQuickJoin() {
        require(msg.sender == quickJoin, "Only QuickJoin can call this function");
        _;
        
    }

    function setMemberTypeImage(string memory memberTypeName, string memory imageURL) public {
        memberTypeImages[memberTypeName] = imageURL;
    }


    function checkMemberTypeByAddress(address user) public view returns (string memory) {
        require(bytes(memberTypeOf[user]).length > 0, "No member type found for user.");
        return memberTypeOf[user];
    }

    function mintNFT(address recipient, string memory memberTypeName) public onlyExecutiveRole {
        require(bytes(memberTypeImages[memberTypeName]).length > 0, "Image for member type not set");
        string memory tokenURI = memberTypeImages[memberTypeName];
        uint256 tokenId = _nextTokenId++;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        memberTypeOf[recipient] = memberTypeName;
        emit mintedNFT(recipient, memberTypeName, tokenURI);
        
    }

    function changeMembershipType(address user, string memory newMemberType) public onlyExecutiveRole {
        require(bytes(memberTypeImages[newMemberType]).length > 0, "Image for member type not set");
        memberTypeOf[user] = newMemberType;
        emit membershipTypeChanged(user, newMemberType);
    }
    // variable for first mint check
    bool public firstMint = true;
    

    function mintDefaultNFT(address newUser) public onlyQuickJoin() {
        string memory tokenURI = defaultImageURL;
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        if (firstMint) {
            memberTypeOf[newUser] = "Executive";
            firstMint = false;
            emit mintedNFT(newUser, "Executive", tokenURI);
        } else
        {
            memberTypeOf[newUser] = DEFAULT_MEMBER_TYPE;
            emit mintedNFT(newUser, DEFAULT_MEMBER_TYPE, tokenURI);
        }

    }


    
}


