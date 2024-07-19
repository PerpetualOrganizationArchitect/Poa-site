// // VotingContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useQuery } from '@apollo/client';
// import {
//   FETCH_PARTICIPATION_VOTING_COMPLETED,
//   FETCH_HYBRID_VOTING_COMPLETED,
//   FETCH_DEMOCRACY_VOTING_COMPLETED,
//   FETCH_ALL_ONGOING_POLLS
// } from './queries';
// import client from './apolloClient';

// const VotingContext = createContext();

// export const useVotingContext = () => useContext(VotingContext);

// export const VotingProvider = ({ children, poName }) => {
//   const [participationVotingOngoing, setParticipationVotingOngoing] = useState({});
//   const [participationVotingCompleted, setParticipationVotingCompleted] = useState({});
//   const [hybridVotingOngoing, setHybridVotingOngoing] = useState({});
//   const [hybridVotingCompleted, setHybridVotingCompleted] = useState({});
//   const [democracyVotingOngoing, setDemocracyVotingOngoing] = useState({});
//   const [democracyVotingCompleted, setDemocracyVotingCompleted] = useState({});
//   const [ongoingPolls, setOngoingPolls] = useState([]);

//   const { data: participationVotingCompletedData } = useQuery(FETCH_PARTICIPATION_VOTING_COMPLETED, {
//     variables: { id: poName },
//     client,
//   });

//   const { data: hybridVotingCompletedData } = useQuery(FETCH_HYBRID_VOTING_COMPLETED, {
//     variables: { id: poName },
//     client,
//   });

//   const { data: democracyVotingCompletedData } = useQuery(FETCH_DEMOCRACY_VOTING_COMPLETED, {
//     variables: { id: poName },
//     client,
//   });

//   const { data: ongoingPollsData } = useQuery(FETCH_ALL_ONGOING_POLLS, {
//     variables: { id: poName },
//     client,
//   });

//   useEffect(() => {
//     if (participationVotingCompletedData) {
//       setParticipationVotingCompleted(participationVotingCompletedData.perpetualOrganization.ParticipationVoting.proposals);
//     }
//     if (hybridVotingCompletedData) {
//       setHybridVotingCompleted(hybridVotingCompletedData.perpetualOrganization.HybridVoting.proposals);
//     }
//     if (democracyVotingCompletedData) {
//       setDemocracyVotingCompleted(democracyVotingCompletedData.perpetualOrganization.DirectDemocracyVoting.proposals);
//     }
//     if (ongoingPollsData) {
//       const ddVoting = ongoingPollsData.perpetualOrganization.DirectDemocracyVoting?.proposals.map(proposal => ({ ...proposal, type: 'Direct Democracy' }));
//       const hybridVoting = ongoingPollsData.perpetualOrganization.HybridVoting?.proposals.map(proposal => ({ ...proposal, type: 'Hybrid' }));
//       const participationVoting = ongoingPollsData.perpetualOrganization.ParticipationVoting?.proposals.map(proposal => ({ ...proposal, type: 'Participation' }));

//       if (ddVoting) {
//         setDemocracyVotingOngoing(ddVoting);
//       }
//       if (hybridVoting) {
//         setHybridVotingOngoing(hybridVoting);
//       }
//       if (participationVoting) {
//         setParticipationVotingOngoing(participationVoting);
//       }

//       const polls = [
//         ...(ddVoting || []),
//         ...(hybridVoting || []),
//         ...(participationVoting || []),
//       ];
//       setOngoingPolls(polls);
//     }
//   }, [participationVotingCompletedData, hybridVotingCompletedData, democracyVotingCompletedData, ongoingPollsData]);

//   return (
//     <VotingContext.Provider
//       value={{
//         participationVotingOngoing,
//         participationVotingCompleted,
//         hybridVotingOngoing,
//         hybridVotingCompleted,
//         democracyVotingOngoing,
//         democracyVotingCompleted,
//         ongoingPolls,
//       }}
//     >
//       {children}
//     </VotingContext.Provider>
//   );
// };
