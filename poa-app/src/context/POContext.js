// // POContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useQuery } from '@apollo/client';
// import { FETCH_PO_DATA } from './queries';
// import client from './apolloClient';

// const POContext = createContext();

// export const usePOContext = () => useContext(POContext);

// export const POProvider = ({ children, poName }) => {
//   const [poDescription, setPOdescription] = useState('No description provided or IPFS content still being indexed');
//   const [poLinks, setPOlinks] = useState({});
//   const [logoHash, setLogoHash] = useState('');
//   const [poMembers, setPoMembers] = useState(0);
//   const [activeTaskAmount, setActiveTaskAmount] = useState(0);
//   const [completedTaskAmount, setCompletedTaskAmount] = useState(0);
//   const [ptTokenBalance, setPtTokenBalance] = useState(0);
//   const [quickJoinContractAddress, setQuickJoinContractAddress] = useState('');
//   const [treasuryContractAddress, setTreasuryContractAddress] = useState('');
//   const [taskManagerContractAddress, setTaskManagerContractAddress] = useState('');
//   const [hybridVotingContractAddress, setHybridVotingContractAddress] = useState('');
//   const [participationVotingContractAddress, setParticipationVotingContractAddress] = useState('');
//   const [directDemocracyVotingContractAddress, setDirectDemocracyVotingContractAddress] = useState('');
//   const [ddTokenContractAddress, setDDTokenContractAddress] = useState('');
//   const [nftMembershipContractAddress, setNFTMembershipContractAddress] = useState('');
//   const [votingContractAddress, setVotingContractAddress] = useState('');

//   const { data, loading, error } = useQuery(FETCH_PO_DATA, {
//     variables: { poName },
//     client,
//   });

//   useEffect(() => {
//     if (data) {
//       const po = data.perpetualOrganization;

//       setLogoHash(po.logoHash);
//       setTreasuryContractAddress(po.Treasury?.id);
//       setPOdescription(po.aboutInfo?.description || 'No description provided or IPFS content still being indexed');
//       setPoMembers(po.totalMembers);
//       setActiveTaskAmount(po.TaskManager?.activeTaskAmount || 0);
//       setCompletedTaskAmount(po.TaskManager?.completedTaskAmount || 0);
//       setPtTokenBalance(po.ParticipationToken?.supply || 0);
//       setPOlinks(po.aboutInfo?.links || {});
//       setTaskManagerContractAddress(po.TaskManager?.id || '');
//       setHybridVotingContractAddress(po.HybridVoting?.id || '');
//       setParticipationVotingContractAddress(po.ParticipationVoting?.id || '');
//       setDirectDemocracyVotingContractAddress(po.DirectDemocracyVoting?.id || '');
//       setDDTokenContractAddress(po.DirectDemocracyToken?.id || '');
//       setNFTMembershipContractAddress(po.NFTMembership?.id || '');
//       setQuickJoinContractAddress(po.QuickJoinContract?.id || '');
//       setVotingContractAddress(po.HybridVoting?.id || po.ParticipationVoting?.id || '');
//     }
//   }, [data]);

//   return (
//     <POContext.Provider
//       value={{
//         poDescription,
//         poLinks,
//         logoHash,
//         poMembers,
//         activeTaskAmount,
//         completedTaskAmount,
//         ptTokenBalance,
//         quickJoinContractAddress,
//         treasuryContractAddress,
//         taskManagerContractAddress,
//         hybridVotingContractAddress,
//         participationVotingContractAddress,
//         directDemocracyVotingContractAddress,
//         ddTokenContractAddress,
//         nftMembershipContractAddress,
//         votingContractAddress,
//       }}
//     >
//       {children}
//     </POContext.Provider>
//   );
// };
