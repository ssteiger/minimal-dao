import React, { useState } from 'react';
import { utils } from 'ethers';
import { Select } from 'antd';
import { Address, Balance, Events } from '../components';

export default function ProposalCreator({
  localProvider,
  useContractReader,
  readContracts,
  writeContracts,
  yourLocalBalance,
  mainnetProvider,
  price,
  address,
}) {
  // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/governance/Governor.sol
  console.log({ currentSignerAddress: address });

  const createMintCalldata = () => {
    const ABI = ['function safeMint(address to, uint amount)'];
    const iface = new utils.Interface(ABI);
    const args = {
      to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      amount: '100',
    };

    const calldata = iface.encodeFunctionData('safeMint', [args.to]);

    console.log({ calldata });
    return calldata;
  };

  const proposeMint = async () => {
    const myNFTAddress = writeContracts.MyNFT.address;

    const args = {
      to: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    };

    //const calldata = createMintCalldata();
    const calldata = writeContracts.MyNFT.interface.encodeFunctionData('safeMint', [args.to]);
    console.log({ calldata });

    /*
      require(
        getVotes(_msgSender(), block.number - 1) >= proposalThreshold(),
        "Governor: proposer votes below proposal threshold"
      );
      require(targets.length == values.length, "Governor: invalid proposal length");
      require(targets.length == calldatas.length, "Governor: invalid proposal length");
      require(targets.length > 0, "Governor: empty proposal");
    */

    // address of the contract to call
    const targets = [myNFTAddress];
    // the amount of ETH you want to send with an execution - whoever executes has to send that amount
    const values = ['0'];
    // includes the arguments for the issue function (e.g. token type, quantity, description, etc.)
    // encoded to a binary format by the front-end using the abiCoder object from ethers.js
    const calldatas = [calldata];
    const description = `I propose to mint of a new NFT to ${args.to}!`;

    console.log({ targets, values, calldatas, description });

    await writeContracts.MyGovernor.propose(targets, values, calldatas, description);
  };

  const proposeSetStorage = async () => {
    const simpleStorageAddress = readContracts.SimpleStorage.address;
    console.log({ address });

    const calldata = writeContracts.SimpleStorage.interface.encodeFunctionData('set', ['100']);

    /*
      require(
        getVotes(_msgSender(), block.number - 1) >= proposalThreshold(),
        "Governor: proposer votes below proposal threshold"
      );
      require(targets.length == values.length, "Governor: invalid proposal length");
      require(targets.length == calldatas.length, "Governor: invalid proposal length");
      require(targets.length > 0, "Governor: empty proposal");
    */

    // address of the contract to call
    const targets = [simpleStorageAddress];
    // the amount of ETH you want to send with an execution - whoever executes has to send that amount
    const values = ['0'];
    // includes the arguments for the issue function (e.g. token type, quantity, description, etc.)
    // encoded to a binary format by the front-end using the abiCoder object from ethers.js
    const calldatas = [calldata];
    const description = 'A propose to change the storage value to 100.';

    console.log({ targets, values, calldatas, description });

    const contractValueAssertsAreSuccessfull =
      targets.length === values.length && targets.length === calldatas.length && targets.length > 0;

    console.log({ contractValueAssertsAreSuccessfull });

    await writeContracts.MyGovernor.propose(targets, values, calldatas, description);
  };

  const currentSimpleStorageValue = useContractReader(readContracts, 'SimpleStorage', 'get');
  const yourBalance = useContractReader(readContracts, 'MyNFT', 'balanceOf', [address ?? '']);
  const yourVotes = useContractReader(readContracts, 'MyNFT', 'getVotes', [address ?? '', '1']);
  const proposalThreshold = useContractReader(readContracts, 'MyGovernor', 'proposalThreshold');

  return (
    <div className="font-normal text-gray-900 dark:text-white">
      <h1 style={{ marginTop: 15, fontSize: 16 }} className="text-gray-900 dark:text-white">
        Proposal Creator
      </h1>
      <br />
      <br />
      <p>
        <b>IMPORTANT:</b> Each proposal can only be submitted once! No duplicate allowed! - Anyone can create a
        proposal, also non NFT holders.
      </p>
      <br />
      <br />
      <p>
        Proposal Threshold: {`${proposalThreshold}`} -> [Part of the Governor Bravo’s interface: "The number of votes
        required in order for a voter to become a proposer".]
      </p>
      <p>Your NFT balance: {yourBalance ? `${yourBalance}` : undefined}</p>
      <p>Your NFT votes: {yourVotes ? `${yourVotes}` : undefined}</p>
      <p>Current SimpleStorage value: {`${currentSimpleStorageValue}`}</p>
      <p>
        Proposal does not exist:
        <p>
          SimpleStorage Proposal:
          <br />
          NFT mint Proposal:
        </p>
      </p>
      <br />
      <br />
      <br />
      <br />
      <div>
        <button
          onClick={proposeMint}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Propose to mint NFT
        </button>
      </div>
      <div>
        <button
          onClick={proposeSetStorage}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Propose to setStorage to 100
        </button>
      </div>
    </div>
  );
}
