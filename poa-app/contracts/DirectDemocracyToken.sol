// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";  

interface INFTMembership {
    function checkMemberTypeByAddress(address user) external view returns (string memory);
}

contract DirectDemocracyToken is ERC20, Ownable { 

    event Mint(address indexed to, uint256 amount);

    INFTMembership public nftMembership;

    uint256 public constant maxSupplyPerPerson = 100;

    address quickJoin; 

    bool quickJoinSet = false;

    mapping(string => bool) private allowedRoles;

    constructor(string memory name, string memory symbol, address _nftMembership, string[] memory _allowedRoleNames) ERC20(name, symbol) {
        nftMembership = INFTMembership(_nftMembership);

        for (uint256 i = 0; i < _allowedRoleNames.length; i++) {
            allowedRoles[_allowedRoleNames[i]] = true;
        }
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

    modifier canMint(address newUser) {
        string memory memberType = nftMembership.checkMemberTypeByAddress(newUser);
        require(allowedRoles[memberType], "Not authorized to mint coins");
        _;
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function mint(address newUser) public canMint(newUser) onlyQuickJoin { 
        require(balanceOf(newUser) == 0, "This account has already claimed coins!");
        _mint(newUser, maxSupplyPerPerson);
        emit Mint(newUser, maxSupplyPerPerson);
    }

    function getBalance(address _address) public view returns (uint256) {
        return balanceOf(_address);
    }

    function transfer(address /*to*/, uint256 /*amount*/) public virtual override returns (bool) {
        revert("Transfer of tokens is not allowed");
    }

    function approve(address /*spender*/, uint256 /*amount*/) public virtual override returns (bool) {
        revert("Approval of Token allowance is not allowed");
    }

    function transferFrom(address /*from*/, address /*to*/, uint256 /*amount*/) public virtual override returns (bool) {
        revert("Transfer of Tokens is not allowed");
    }
}
