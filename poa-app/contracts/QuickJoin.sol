// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMembershipNFT {
    function mintDefaultNFT(address newUser) external;
}

interface IDirectDemocracyToken {
    function mint(address newUser) external;
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

    address masterDeployAddress;

    constructor(address _membershipNFTAddress, address _directDemocracyTokenAddress, address _accountManagerAddress, address _masterDeployAddress) {
        membershipNFT = IMembershipNFT(_membershipNFTAddress);
        directDemocracyToken = IDirectDemocracyToken(_directDemocracyTokenAddress);
        accountManager = IAccountManager(_accountManagerAddress);
        masterDeployAddress = _masterDeployAddress;
    }

    modifier onlyMasterDeploy() {
        require(msg.sender == masterDeployAddress, "Only MasterDeploy can call this function");
        _;
    }

    function quickJoinNoUser(string memory userName) public {
        string memory existingUsername = accountManager.getUsername(msg.sender);

        // Check if the user has an existing username
        if (bytes(existingUsername).length == 0) {
            
            accountManager.registerAccount(userName);
        }
        membershipNFT.mintDefaultNFT(msg.sender);
        directDemocracyToken.mint(msg.sender);
    }

    function quickJoinWithUser() public {
        membershipNFT.mintDefaultNFT(msg.sender);
        directDemocracyToken.mint(msg.sender);
    }

    function quickJoinNoUserMasterDeploy(string memory userName, address newUser) public {
        string memory existingUsername = accountManager.getUsername(msg.sender);

        // Check if the user has an existing username
        if (bytes(existingUsername).length == 0) {
            
            accountManager.registerAccount(userName);
        }
        membershipNFT.mintDefaultNFT(newUser);
        directDemocracyToken.mint(newUser);
    }

    function quickJoinWithUserMasterDeploy(address newUser) public {
        membershipNFT.mintDefaultNFT(newUser);
        directDemocracyToken.mint(newUser);
    }

    
}
