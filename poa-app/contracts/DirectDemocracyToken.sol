// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";  

interface INFTMembership {
    function checkMemberTypeByAddress(address user) external view returns (string memory);
}

contract DirectDemocracyToken is ERC20, Ownable { 

    event Mint(address indexed to, uint256 amount);

    INFTMembership public nftMembership;

    uint256 public constant maxSupplyPerPerson = 100;

    mapping(string => bool) private allowedRoles;

    constructor(string memory name, string memory symbol, address _nftMembership, string[] memory _allowedRoleNames) ERC20(name, symbol) {
        nftMembership = INFTMembership(_nftMembership);

        for (uint256 i = 0; i < _allowedRoleNames.length; i++) {
            allowedRoles[_allowedRoleNames[i]] = true;
        }
    }

    modifier canMint() {
        string memory memberType = nftMembership.checkMemberTypeByAddress(msg.sender);
        require(allowedRoles[memberType], "Not authorized to mint coins");
        _;
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function mint(address _to) public canMint { 
        require(balanceOf(_to) == 0, "This account has already claimed coins!");
        _mint(_to, maxSupplyPerPerson);
        emit Mint(_to, maxSupplyPerPerson);
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
