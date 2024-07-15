// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMembershipNFT {
    function mintDefaultNFT() external;
}

interface IDirectDemocracyToken {
    function mint() external;
}

// interface for AccountManager.sol
interface IAccountManager {
    function getUsername(address accountAddress) external view returns (string memory);
    function registerAccount(string memory username) external;
}

contract QuickJoin {
    IMembershipNFT private membershipNFT;
    IDirectDemocracyToken private directDemocracyToken;
    IAccountManager private accountManager;

    constructor(address _membershipNFTAddress, address _directDemocracyTokenAddress, address _accountManagerAddress) {
        membershipNFT = IMembershipNFT(_membershipNFTAddress);
        directDemocracyToken = IDirectDemocracyToken(_directDemocracyTokenAddress);
        accountManager = IAccountManager(_accountManagerAddress);
    }

    function quickJoinNoUser(string memory userName) public {
        string memory existingUsername = accountManager.getUsername(msg.sender);

        // Check if the user has an existing username
        if (bytes(existingUsername).length == 0) {
            
            accountManager.registerAccount(userName);
        }
        membershipNFT.mintDefaultNFT();
        directDemocracyToken.mint();
    }

    function quickJoinWithUser() public {
        membershipNFT.mintDefaultNFT();
        directDemocracyToken.mint();
    }
}
