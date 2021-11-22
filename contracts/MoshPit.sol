// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MoshPit {
    uint256 totalTracks;
    // mapping(address => uint256) userTracksAdded;

    // Fires when a new track is added
    event NewTrack(
        address indexed from,
        string title,
        string artist,
        uint256 timestamp
    );

    struct Track {
        address mosher;
        string title;
        string artist;
        uint256 timestamp;
    }

    Track[] tracks;

    constructor() {
        console.log("Welcome to the MoshPit! :)");
    }

    function addTrack(string memory _title, string memory _artist) public {
        totalTracks += 1;
        // userTracksAdded[msg.sender] += 1;
        console.log("%s has added a banger!", msg.sender);

        tracks.push(Track(msg.sender, _title, _artist, block.timestamp));

        emit NewTrack(msg.sender, _title, _artist, block.timestamp);
    }

    function getAllTracks() public view returns (Track[] memory) {
        return tracks;
    }

    function getTotalTracks() public view returns (uint256) {
        console.log("We have %d total waves", totalTracks);
        return totalTracks;
    }
}
