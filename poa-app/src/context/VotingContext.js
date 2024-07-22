import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
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

  const  { data, loading, error } = useQuery(FETCH_VOTING_DATA, {
    variables: { id: userDAO },
    skip: !userDAO,
    fetchPolicy:'cache-first',
    notifyOnNetworkStatusChange: true,
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
