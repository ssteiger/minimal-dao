import React from 'react';
import { utils } from 'ethers';
import { useEventListener } from 'eth-hooks/events/useEventListener';
import Proposal from './Proposal';

export default function VoteOnProposals({
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
      <h1 style={{ marginTop: 15, marginBottom: 30, fontSize: 16 }} className="text-gray-900 dark:text-white">
        Overview of active proposal - Vote here
      </h1>
      <div>
        {events_ProposalCreated.map(event => {
          return (
            <Proposal
              proposalCreatedEvent={event}
              price={price}
              localProvider={localProvider}
              address={address}
              useContractReader={useContractReader}
              readContracts={readContracts}
              writeContracts={writeContracts}
            />
          );
        })}
      </div>
    </div>
  );
}
