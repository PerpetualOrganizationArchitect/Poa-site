// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface INFTMembership {
    function checkMemberTypeByAddress(address user) external view returns (string memory);
}

contract ParticipationToken is ERC20, Ownable {

    INFTMembership public nftMembership;

    mapping(string => bool) public allowedRoles;

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

    function mint(address to, uint256 amount) public canMint {
        _mint(to, amount);
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal override {
        revert("Transfers are disabled.");
    }
}

