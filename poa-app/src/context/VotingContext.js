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
  const [votingType, setVotingType] = useState('Participation');

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
      console.log('data', data);
      const { perpetualOrganization } = data;
  
      // Set voting type to Participation or Hybrid
      setVotingType(perpetualOrganization.ParticipationVoting ? 'Participation' : 'Hybrid');
      
      setParticipationVotingCompleted(
        perpetualOrganization.ParticipationVoting?.proposals.filter(
          proposal => proposal.winningOptionIndex !== null
        )
      );
      setHybridVotingCompleted(
        perpetualOrganization.HybridVoting?.proposals.filter(
          proposal => proposal.winningOptionIndex !== null
        )
      );
      setDemocracyVotingCompleted(
        perpetualOrganization.DirectDemocracyVoting?.proposals.filter(
          proposal => proposal.winningOptionIndex !== null
        )
      );
  
      // Filter out ongoing (active) proposals
      const ddVoting = perpetualOrganization.DirectDemocracyVoting?.proposals
        .filter(proposal => proposal.winningOptionIndex === null)  // Ongoing if no winningOptionIndex
        .map(proposal => ({
          votingTypeId: perpetualOrganization.DirectDemocracyVoting.id,
          ...proposal,
          type: 'Direct Democracy',
        }));
  
      const hybridVoting = perpetualOrganization.HybridVoting?.proposals
        .filter(proposal => proposal.winningOptionIndex === null)  // Ongoing if no winningOptionIndex
        .map(proposal => ({
          votingTypeId: perpetualOrganization.HybridVoting.id,
          ...proposal,
          type: 'Hybrid',
          options: proposal.options.map(option => ({
            ...option,
            votes: option.votesPT + option.votesDD, // Combine votesPT and votesDD
          }))
        }));
  
      const participationVoting = perpetualOrganization.ParticipationVoting?.proposals
        .filter(proposal => proposal.winningOptionIndex === null)  // Ongoing if no winningOptionIndex
        .map(proposal => ({
          votingTypeId: perpetualOrganization.ParticipationVoting.id,
          ...proposal,
          type: 'Participation',
        }));
  
      // Update state for ongoing proposals
      if (ddVoting) {
        setDemocracyVotingOngoing(ddVoting);
      }
      if (hybridVoting) {
        setHybridVotingOngoing(hybridVoting);
      }
      if (participationVoting) {
        setParticipationVotingOngoing(participationVoting);
      }
  
      // Combine all ongoing polls into one array
      const polls = [
        ...(ddVoting || []),
        ...(hybridVoting || []),
        ...(participationVoting || []),
      ];
      setOngoingPolls(polls);
      console.log('polls', polls);
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
    ongoingPolls,
    votingType
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
    votingType
  ]);

  return (
    <VotingContext.Provider value={contextValue}>
      {error && <div>Error: {error.message}</div>}
      {children}
    </VotingContext.Provider>
  );
};
