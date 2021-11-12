// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MoshPit {
    uint256 totalTracks;
    mapping(address => uint256) userTracksAdded;

    // Fires when a new track is added
    event NewTrack(address indexed from, uint256 timestamp, string message);

    constructor() {
        console.log("Welcome to the MoshPit! :)");
    }

    function addTrack() public {
        totalTracks += 1;
        userTracksAdded[msg.sender] += 1;
        console.log("%s has added a banger!", msg.sender);
    }
1
    function getTotalTracks() public view returns (uint256) {
        string memory totalTrackText = (
            totalTracks == 1
                ? "There is %s track in the MoshPit"
                : "There are %s tracks in the MoshPit"
        );

        console.log(totalTrackText, totalTracks);

        return totalTracks;
    }

    function getTotalUserTracks() public view returns (uint256) {
        string memory totalUserTrack = (
            userTracksAdded[msg.sender] == 1
                ? "%s has sent %s banger!"
                : "%s has sent %s bangers!"
        );
        console.log(totalUserTrack, msg.sender, userTracksAdded[msg.sender]);
        return userTracksAdded[msg.sender];
    }
}
