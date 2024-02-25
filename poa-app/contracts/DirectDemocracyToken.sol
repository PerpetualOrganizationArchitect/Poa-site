pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";  

contract DirectDemocracyToken is ERC20, Ownable { 
    uint256 public constant maxSupplyPerPerson = 100;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function mint(address _to) public { 
        require(balanceOf(_to) == 0, "This account has already claimed coins!");
        _mint(_to, maxSupplyPerPerson);
        require(balanceOf(_to) == maxSupplyPerPerson, "Coins failed to mint");
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
