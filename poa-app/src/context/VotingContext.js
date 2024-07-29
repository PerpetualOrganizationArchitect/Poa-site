import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { FETCH_VOTING_DATA, FETCH_ALL_PO_DATA } from '../util/queries'; 
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

const VotingContext = createContext();

export const useVotingContext = () => useContext(VotingContext);

export const VotingProvider = ({ children, id }) => {
  const [participationVotingOngoing, setParticipationVotingOngoing] = useState([]);
  const [participationVotingCompleted, setParticipationVotingCompleted] = useState([]);
  const [hybridVotingOngoing, setHybridVotingOngoing] = useState([]);
  const [hybridVotingCompleted, setHybridVotingCompleted] = useState([]);
  const [democracyVotingOngoing, setDemocracyVotingOngoing] = useState([]);
  const [democracyVotingCompleted, setDemocracyVotingCompleted] = useState([]);
  const [ongoingPolls, setOngoingPolls] = useState([]);

    const { address } = useAccount();
    const router = useRouter();
    const poName =  router.query.userDAO || '';

    

    const [account, setAccount] = useState('0x00');

    useEffect(() => {
        if (address) {
            setAccount(address);
        }
    } , [address]);

    const combinedID = `${poName}-${account?.toLowerCase()}`;

  const  { data, loading, error } = useQuery(FETCH_ALL_PO_DATA, {
    variables: { id: account?.toLowerCase(), poName: poName, combinedID: combinedID },
    skip: !account || !poName || !combinedID,
    fetchPolicy:'cache-first',
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
        console.log('Query voting context completed successfully');
      },
  });

  useEffect(() => {
    if (data) {
        console.log("data", data); 
      const { perpetualOrganization } = data;
      
      setParticipationVotingCompleted(perpetualOrganization.ParticipationVoting?.proposals.filter(proposal => proposal.winningOptionIndex));
      setHybridVotingCompleted(perpetualOrganization.HybridVoting?.proposals.filter(proposal => proposal.winningOptionIndex));
      setDemocracyVotingCompleted(perpetualOrganization.DirectDemocracyVoting?.proposals.filter(proposal => proposal.winningOptionIndex));

      const ddVoting = data.perpetualOrganization.DirectDemocracyVoting?.proposals.map(proposal => ({ ...proposal, type: 'Direct Democracy' }));
      const hybridVoting = data.perpetualOrganization.HybridVoting?.proposals.map(proposal => ({ ...proposal, type: 'Hybrid' }));
      const participationVoting = data.perpetualOrganization.ParticipationVoting?.proposals.map(proposal => ({ ...proposal, type: 'Participation' }));
  
      if (ddVoting) {
          setDemocracyVotingOngoing(ddVoting);
      }
      if (hybridVoting) {
          setHybridVotingOngoing(hybridVoting);
      }
      if (participationVoting) {
          setParticipationVotingOngoing(participationVoting);
      }
  
      // combine all ongoing polls into one array with type of poll check to make sure each exists first 
      const polls = [
          ...(ddVoting || []),
          ...(hybridVoting || []),
          ...(participationVoting || []),
      ];
      setOngoingPolls(polls);
      console.log("polls", polls);
    }
  }, [data]);

  const contextValue = useMemo(() => ({
    participationVotingOngoing,
    participationVotingCompleted,
    hybridVotingOngoing,
    hybridVotingCompleted,
    democracyVotingOngoing,
    democracyVotingCompleted,
    loading,
    error,
    ongoingPolls
  }), [
    participationVotingOngoing,
    participationVotingCompleted,
    hybridVotingOngoing,
    hybridVotingCompleted,
    democracyVotingOngoing,
    democracyVotingCompleted,
    loading,
    error,
    ongoingPolls,
  ]);

  return (
    <VotingContext.Provider value={contextValue}>
      {error && <div>Error: {error.message}</div>}
      {children}
    </VotingContext.Provider>
  );
};
