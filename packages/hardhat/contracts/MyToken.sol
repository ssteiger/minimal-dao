// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// https://github.com/OpenZeppelin/openzeppelin-contracts
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {}

    // TODO: anyone can mint
    //       add access control: https://wizard.openzeppelin.com
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
