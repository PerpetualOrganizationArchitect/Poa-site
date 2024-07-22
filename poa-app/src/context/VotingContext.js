import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client';
import { FETCH_VOTING_DATA } from '../util/queries'; 
import { useRouter } from 'next/router';

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

    const router = useRouter();
    const {userDAO} = router.query;

  const [fetchVotingDetails, { data, loading, error }] = useLazyQuery(FETCH_VOTING_DATA, {
    variables: { id: userDAO },
    skip: !userDAO,
  });

  useEffect(() => {
    if (data) {
      const { perpetualOrganization } = data;
      setParticipationVotingOngoing(perpetualOrganization.ParticipationVoting?.proposals.filter(proposal => !proposal.winningOptionIndex));
      setParticipationVotingCompleted(perpetualOrganization.ParticipationVoting?.proposals.filter(proposal => proposal.winningOptionIndex));
      setHybridVotingOngoing(perpetualOrganization.HybridVoting?.proposals.filter(proposal => !proposal.winningOptionIndex));
      setHybridVotingCompleted(perpetualOrganization.HybridVoting?.proposals.filter(proposal => proposal.winningOptionIndex));
      setDemocracyVotingOngoing(perpetualOrganization.DirectDemocracyVoting?.proposals.filter(proposal => !proposal.winningOptionIndex));
      setDemocracyVotingCompleted(perpetualOrganization.DirectDemocracyVoting?.proposals.filter(proposal => proposal.winningOptionIndex));
      

        const ongoingPolls = [...perpetualOrganization.ParticipationVoting?.proposals.filter(proposal => !proposal.winningOptionIndex),
            ...perpetualOrganization.HybridVoting?.proposals.filter(proposal => !proposal.winningOptionIndex),
            ...perpetualOrganization.DirectDemocracyVoting?.proposals.filter(proposal => !proposal.winningOptionIndex)];
        
        setOngoingPolls(ongoingPolls);
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
    fetchVotingDetails, // Pass fetchVotingDetails to consumers
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
