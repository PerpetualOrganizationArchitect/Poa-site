// VotingContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { FETCH_VOTING_DATA } from './queries'; // Define your query in queries.js

const VotingContext = createContext();

export const useVotingContext = () => useContext(VotingContext);

export const VotingProvider = ({ children }) => {
  const [participationVotingOngoing, setParticipationVotingOngoing] = useState([]);
  const [participationVotingCompleted, setParticipationVotingCompleted] = useState([]);
  const [hybridVotingOngoing, setHybridVotingOngoing] = useState([]);
  const [hybridVotingCompleted, setHybridVotingCompleted] = useState([]);
  const [democracyVotingOngoing, setDemocracyVotingOngoing] = useState([]);
  const [democracyVotingCompleted, setDemocracyVotingCompleted] = useState([]);

  const { data, loading, error } = useQuery(FETCH_VOTING_DATA, {
    variables: { id: 'your-id' }, // Replace 'your-id' with actual variable
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
    }
  }, [data]);

  return (
    <VotingContext.Provider value={{ participationVotingOngoing, participationVotingCompleted, hybridVotingOngoing, hybridVotingCompleted, democracyVotingOngoing, democracyVotingCompleted, loading, error }}>
      {children}
    </VotingContext.Provider>
  );
};
