// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract SimpleStorage {
    uint x;

    function set(uint newValue) public {
        x = newValue;
    }

    function get() public view returns (uint) {
        return x;
    }
}
