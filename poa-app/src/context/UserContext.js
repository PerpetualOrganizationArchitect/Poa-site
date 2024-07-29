import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useAccount } from 'wagmi';
import { FETCH_USER_DETAILS, FETCH_PO_AND_USER_DETAILS, FETCH_ALL_PO_DATA } from '../util/queries'; 
import { useRouter } from 'next/router';
import { useWeb3Context } from './web3Context';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const { address } = useAccount();
    const [userData, setUserData] = useState({});
    const [graphUsername, setGraphUsername] = useState('');
    const [hasExecNFT, setHasExecNFT] = useState(false);
    const [hasMemberNFT, setHasMemberNFT] = useState(false);
    const [claimedTasks, setClaimedTasks] = useState([]);
    const [userProposals, setUserProposals] = useState([]);
    const [userDataLoading, setUserDataLoading] = useState(true);
    const router = useRouter();
    const { userDAO } = router.query;

    const [account, setAccount] = useState('0x00');

    useEffect(() => {
        if (address) {
            setAccount(address);
        }
    } , [address]);

    const combinedID = `${userDAO}-${account?.toLowerCase()}`;

    const { data, error } = useQuery(FETCH_ALL_PO_DATA, {
        variables: { id: account?.toLowerCase(), poName: userDAO, combinedID: combinedID },
        skip: !account || !userDAO || !combinedID,
        fetchPolicy: 'cache-first',
        onCompleted: () => {
            console.log('Query user context completed successfully');
            console.log('data', data);
        },
    });

    useEffect(() => {
        if (data) {
            console.log("data", data);
            const { user, account, perpetualOrganization } = data;

            const execRoles = perpetualOrganization?.NFTMembership?.executiveRoles || [];
            const hasExecNFT = user ? execRoles.includes(user.memberType.memberTypeName) : false;
            const hasMemberNFT = !!user;
            const username = account?.userName || '';
            const userTasks = user?.tasks || [];
            const tasksCompleted = userTasks.filter(task => task.completed).length;

            setGraphUsername(username);
            setHasExecNFT(hasExecNFT);
            setHasMemberNFT(hasMemberNFT);
            setClaimedTasks(userTasks.filter(task => !task.completed));

            if (hasMemberNFT) {
                setUserData({
                    id: user.id,
                    ptTokenBalance: user.ptTokenBalance,
                    ddTokenBalance: user.ddTokenBalance,
                    memberType: user.memberType.memberTypeName,
                    imageURL: user.memberType.imageURL,
                    tasksCompleted,
                    totalVotes: user.totalVotes,
                    dateJoined: user.dateJoined,
                });
            }

            const proposals = [
                ...(data.user?.ptProposals || []).map(proposal => ({ ...proposal, type: 'Participation' })),
                ...(data.user?.ddProposals || []).map(proposal => ({ ...proposal, type: 'Direct Democracy' })),
                ...(data.user?.hybridProposals || []).map(proposal => ({ ...proposal, type: 'Hybrid' })),
            ];

            const currentTime = Math.floor(Date.now() / 1000); 


            proposals.sort((a, b) => {
                const aIsCompleted = a.experationTimestamp < currentTime;
                const bIsCompleted = b.experationTimestamp < currentTime;

                if (aIsCompleted && !bIsCompleted) {
                    return 1; 
                } else if (!aIsCompleted && bIsCompleted) {
                    return -1; 
                } else if (!aIsCompleted && !bIsCompleted) {
                    return a.experationTimestamp - b.experationTimestamp; 
                } else {
                    return a.experationTimestamp - b.experationTimestamp; 
                }
            });

            setUserProposals(proposals);
            setUserDataLoading(false);
        } else {
            setUserDataLoading(false); 
        }
    }, [data]);

    // Memoize the context value to avoid unnecessary re-renders
    const contextValue = useMemo(() => ({
        userDataLoading,
        userProposals,
        userData,
        graphUsername,
        hasExecNFT,
        hasMemberNFT,
        claimedTasks,
        error,
    }), [userDataLoading, userProposals, userData, graphUsername, hasExecNFT, hasMemberNFT, claimedTasks, error]);

    return (
        <UserContext.Provider value={contextValue}>
            {error && <div>Error: {error.message}</div>}
            {children}
        </UserContext.Provider>
    );
};
