import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { FETCH_PO_DATA, FETCH_ALL_PO_DATA } from '../util/queries';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

const POContext = createContext();

export const usePOContext = () => useContext(POContext);

export const POProvider = ({ children}) => {
    const { address } = useAccount();
  const [poDescription, setPODescription] = useState('No description provided or IPFS content still being indexed');
  const [poLinks, setPOLinks] = useState({});
  const [logoHash, setLogoHash] = useState('');
  const [poMembers, setPoMembers] = useState(0);
  const [activeTaskAmount, setActiveTaskAmount] = useState(0);
  const [completedTaskAmount, setCompletedTaskAmount] = useState(0);
  const [ptTokenBalance, setPtTokenBalance] = useState(0);
  const [quickJoinContractAddress, setQuickJoinContractAddress] = useState('');
  const [treasuryContractAddress, setTreasuryContractAddress] = useState('');
  const [taskManagerContractAddress, setTaskManagerContractAddress] = useState('');
  const [hybridVotingContractAddress, setHybridVotingContractAddress] = useState('');
  const [participationVotingContractAddress, setParticipationVotingContractAddress] = useState('');
  const [directDemocracyVotingContractAddress, setDirectDemocracyVotingContractAddress] = useState('');
  const [ddTokenContractAddress, setDDTokenContractAddress] = useState('');
  const [nftMembershipContractAddress, setNFTMembershipContractAddress] = useState('');
  const [votingContractAddress, setVotingContractAddress] = useState('');


    const router = useRouter();

    const poName =  router.query.userDAO || '';

    const combinedID = `${poName}-${address?.toLowerCase()}`;


    const  { data, error, loading } = useQuery(FETCH_ALL_PO_DATA, {
        variables: { id: address?.toLowerCase(), poName: poName, combinedID: combinedID },
        skip: !address || !poName || !combinedID,
        fetchPolicy:'cache-first',
        onCompleted: () => {
            console.log('Query po context completed successfully');
          },
    });

  useEffect(() => {
    if (data) {
      const po = data.perpetualOrganization;

      setLogoHash(po.logoHash);
      setTreasuryContractAddress(po.Treasury?.id);
      setPODescription(po.aboutInfo?.description || 'No description provided or IPFS content still being indexed');
      setPoMembers(po.totalMembers);
      setActiveTaskAmount(po.TaskManager?.activeTaskAmount || 0);
      setCompletedTaskAmount(po.TaskManager?.completedTaskAmount || 0);
      setPtTokenBalance(po.ParticipationToken?.supply || 0);
      setPOLinks(po.aboutInfo?.links || {});
      setTaskManagerContractAddress(po.TaskManager?.id || '');
      setHybridVotingContractAddress(po.HybridVoting?.id || '');
      setParticipationVotingContractAddress(po.ParticipationVoting?.id || '');
      setDirectDemocracyVotingContractAddress(po.DirectDemocracyVoting?.id || '');
      setDDTokenContractAddress(po.DirectDemocracyToken?.id || '');
      setNFTMembershipContractAddress(po.NFTMembership?.id || '');
      setQuickJoinContractAddress(po.QuickJoinContract?.id || '');
      setVotingContractAddress(po.HybridVoting?.id || po.ParticipationVoting?.id || '');
    }
  }, [data]);

  const contextValue = useMemo(() => ({
    poDescription,
    poLinks,
    logoHash,
    poMembers,
    activeTaskAmount,
    completedTaskAmount,
    ptTokenBalance,
    quickJoinContractAddress,
    treasuryContractAddress,
    taskManagerContractAddress,
    hybridVotingContractAddress,
    participationVotingContractAddress,
    directDemocracyVotingContractAddress,
    ddTokenContractAddress,
    nftMembershipContractAddress,
    votingContractAddress,
    loading,
    error,
  }), [
    poDescription,
    poLinks,
    logoHash,
    poMembers,
    activeTaskAmount,
    completedTaskAmount,
    ptTokenBalance,
    quickJoinContractAddress,
    treasuryContractAddress,
    taskManagerContractAddress,
    hybridVotingContractAddress,
    participationVotingContractAddress,
    directDemocracyVotingContractAddress,
    ddTokenContractAddress,
    nftMembershipContractAddress,
    votingContractAddress,
    loading,
    error,
  ]);

  return (
    <POContext.Provider value={contextValue}>
      {error && <div>Error: {error.message}</div>}
      {children}
    </POContext.Provider>
  );
};
