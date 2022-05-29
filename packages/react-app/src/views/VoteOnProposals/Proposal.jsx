import React, { useState } from 'react';
import { utils } from 'ethers';
import { useEventListener } from 'eth-hooks/events/useEventListener';

export default function Proposal({
  proposalCreatedEvent,

  localProvider,
  useContractReader,
  readContracts,
  writeContracts,
  yourLocalBalance,
  mainnetProvider,
  price,
  address,
}) {
  console.log({ proposalCreatedEvent });

  const { args } = proposalCreatedEvent;
  const { proposalId, proposer, targets, calldatas, description, startBlock, endBlock, signatures } = args;

  const eventsVoteCastAll = useEventListener(
    readContracts,
    'MyGovernor',
    'VoteCast',
    localProvider,
    1, // start block
  );

  const eventsVoteCastThisProposal = eventsVoteCastAll.filter(event => {
    return event.args.proposalId.toString() === proposalId.toString();
  });

  const [formValues, setFormValues] = useState({});

  const executeVoteTx = async () => {
    const { support } = formValues;
    if (!support) return;
    await writeContracts.MyGovernor.castVote(`${proposalId}`, support);
  };

  /*
  const queueProposal = async () => {
    console.log('now queue proposal');
    console.log({ args });
    const values = ['0']; // TODO:
    const descriptionHash = utils.id(description);
    console.log({ targets, values, calldatas, descriptionHash });
    await writeContracts.MyGovernor.queue(targets, values, calldatas, descriptionHash);
  };
  */

  const executeProposal = async () => {
    console.log('now execute proposal');
    console.log({ args });
    const values = ['0']; // TODO:
    const descriptionHash = utils.id(description);
    await writeContracts.MyGovernor.execute(targets, values, calldatas, descriptionHash);
  };

  const hasVoted = useContractReader(readContracts, 'MyGovernor', 'hasVoted', [proposalId, address]);

  /*
  ProposalState: Enum(
    'Pending',
    'Active',
    'Canceled',
    'Defeated',
    'Succeeded',
    'Queued',
    'Expired',
    'Executed',
  ),
  */
  const proposalState = useContractReader(readContracts, 'MyGovernor', 'state', [proposalId]);

  console.log({ hasVoted });
  console.log({ proposalState });

  return (
    <div className="font-normal text-gray-900 dark:text-white">
      <p style={{ marginBottom: 15 }}>proposal Id: {`${proposalId}`}</p>
      <p>you have voted: {hasVoted ? 'yes' : 'no'}</p>
      <p>calldatas: {calldatas}</p>
      <p>description: {description}</p>
      <p>endBlock: {`${endBlock}`}</p>
      <p>proposer: {proposer}</p>
      <p>signatures: {signatures}</p>
      <p>startBlock: {`${startBlock}`}</p>
      <p>targets: {targets}</p>
      <h2
        style={{ marginTop: 40 }}
        className="inline-flex items-center px-3 py-0.5 rounded-full text-base font-normal bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white"
      >
        cast vote
      </h2>
      <br />
      support
      <input
        type="text"
        id="votes"
        // name={key}
        class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        size="large"
        placeholder="Number of votes"
        autoComplete="off"
        onChange={event => {
          console.log({ value: event.target.value });
          const formUpdate = { ...formValues };
          formUpdate.support = event.target.value;
          setFormValues(formUpdate);
        }}
      />
      <button
        onClick={() => executeVoteTx()}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Send
      </button>
      <br />
      castVoteWithReason (TODO)
      <br />
      Vote History
      {eventsVoteCastThisProposal.map(event => {
        console.log({ event });

        const { args } = event;
        const { proposalId, voter, support, reason, weight } = args;
        return (
          <div>
            voter: {voter}
            <br />
            support: {support.toString()}
            <br />
            weight: {weight.toString()}
          </div>
        );
      })}
      <br />
      <br />
      proposalState: {proposalState}
      <br />
      <br />
      Execute Proposal
      <br />
      <button
        onClick={() => executeProposal()}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Execute Proposal
      </button>
      <br />
      <hr />
      <br />
    </div>
  );
}
