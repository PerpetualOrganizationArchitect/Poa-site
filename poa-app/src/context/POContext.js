import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { FETCH_PO_DATA, FETCH_ALL_PO_DATA } from '../util/queries';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

const POContext = createContext();

export const usePOContext = () => useContext(POContext);

async function fetchLeaderboardData(id, users) {
    if (users) {
        return users.map(user => ({
            id: user.id,
            name: user.Account.userName,
            token: user.ptTokenBalance,
        }));
    } else {
        console.error("No user data available");
        return [];
    }
}

export const POProvider = ({ children }) => {
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
    const [leaderboardData, setLeaderboardData] = useState({});
    const [poContextLoading, setPoContextLoading] = useState(true);
    const [rules, setRules] = useState(null); // Add rules state

    const [account, setAccount] = useState('0x00');
    const router = useRouter();
    const poName = router.query.userDAO || '';
    

    useEffect(() => {
        if (address) {
            setAccount(address);
        }
    }
    , [address]);

    const combinedID = `${poName}-${account?.toLowerCase()}`;



    const { data, error, loading } = useQuery(FETCH_ALL_PO_DATA, {
        variables: { id: account?.toLowerCase(), poName: poName, combinedID: combinedID },
        skip: !account || !poName || !combinedID,
        fetchPolicy: 'cache-first',
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

            fetchLeaderboardData(combinedID, po.Users).then(data => {
                setLeaderboardData(data);
            });

            setRules({
                HybridVoting: po.HybridVoting,
                DirectDemocracyVoting: po.DirectDemocracyVoting,
                ParticipationVoting: po.ParticipationVoting,
                NFTMembership: po.NFTMembership,
                Treasury: po.Treasury
            });

            setPoContextLoading(false);
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
        leaderboardData,
        poContextLoading,
        rules, 
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
        leaderboardData,
        poContextLoading,
        rules,
    ]);

    return (
        <POContext.Provider value={contextValue}>
            {error && <div>Error: {error.message}</div>}
            {children}
        </POContext.Provider>
    );
};
