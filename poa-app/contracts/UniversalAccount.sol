// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AccountManager {
    // Mapping from address to username
    mapping(address => string) public addressToUsername;

    // Mapping to check if a username is already taken
    mapping(string => bool) private usernameExists;

    // Event for new registration
    event UserRegistered(address indexed accountAddress, string username);

    // Event for username change
    event UsernameChanged(address indexed accountAddress, string newUsername);

    // Function to register a new account with a unique username
    function registerAccount(string memory username) public {
        require(bytes(username).length > 0, "Username cannot be empty");
        require(bytes(addressToUsername[msg.sender]).length == 0, "Account already registered");
        require(!usernameExists[username], "Username already taken");

        addressToUsername[msg.sender] = username;
        usernameExists[username] = true;
        emit UserRegistered(msg.sender, username);
    }

    // Function to change the username
    function changeUsername(string memory newUsername) public {
        string memory oldUsername = addressToUsername[msg.sender];
        require(bytes(oldUsername).length > 0, "Account not registered");
        require(bytes(newUsername).length > 0, "New username cannot be empty");
        require(!usernameExists[newUsername], "Username already taken");

        // Update the mappings
        usernameExists[oldUsername] = false;
        addressToUsername[msg.sender] = newUsername;
        usernameExists[newUsername] = true;

        emit UsernameChanged(msg.sender, newUsername);
    }

    // Function to get a username by address
    function getUsername(address accountAddress) public view returns (string memory) {
        return addressToUsername[accountAddress];
    }
}
