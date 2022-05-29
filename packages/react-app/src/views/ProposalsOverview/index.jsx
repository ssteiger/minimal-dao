import React from 'react';
import { utils } from 'ethers';
import { useEventListener } from 'eth-hooks/events/useEventListener';

export default function ProposalsOverview({
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

  const events_ProposalCreated = useEventListener(
    readContracts,
    'MyGovernor',
    'ProposalCreated',
    localProvider,
    1, // start block
  );

  console.log({ events_ProposalCreated });

  return (
    <div className="font-normal text-gray-900 dark:text-white">
      <h1 style={{ marginTop: 15, fontSize: 16 }} className="text-gray-900 dark:text-white">
        ProposalCreated Events
      </h1>

      {events_ProposalCreated.map(event => {
        console.log({ event });

        const { args } = event;
        const { proposalId, proposer, targets, calldatas, description, startBlock, endBlock, signatures } = args;

        return (
          <div>
            {`ID: [${args.proposalId}]`}
            <br />
            {args.description}
            <p>calldatas: {calldatas}</p>
            <p>description: {description}</p>
            <p>endBlock: {`${endBlock}`}</p>
            <p>proposalId: {`${proposalId}`}</p>
            <p>proposer: {proposer}</p>
            <p>signatures: {signatures}</p>
            <p>startBlock: {`${startBlock}`}</p>
            <p>targets: {targets}</p>

            <br />
            <hr />
            <br />
          </div>
        );
      })}
    </div>
  );
}
