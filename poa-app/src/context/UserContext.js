import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useAccount } from 'wagmi';
import { FETCH_USER_DETAILS } from '../util/queries'; 
import { useRouter } from 'next/router';

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

    const combinedID = `${userDAO}-${address?.toLowerCase()}`;

    console.log("combinedID", combinedID);

    const  { data, error } = useQuery(FETCH_USER_DETAILS, {
        variables: { id: address?.toLowerCase(), poName: userDAO, combinedID: combinedID },
        skip: !address || !userDAO || !combinedID,
        fetchPolicy:'cache-first',
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        if (data) {
            console.log("data", data);
            const { user, account, perpetualOrganization } = data;

            const execRoles = perpetualOrganization.NFTMembership.executiveRoles;
            const hasExecNFT = execRoles.includes(user.memberType.memberTypeName);
            const hasMemberNFT = user != null;
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
                ...data.user.ptProposals.map(proposal => ({ ...proposal, type: 'Participation' })),
                ...data.user.ddProposals.map(proposal => ({ ...proposal, type: 'Direct Democracy' })),
                ...data.user.hybridProposals.map(proposal => ({ ...proposal, type: 'Hybrid' })),
            ];
        
            const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        
            // Order proposals by expiration timestamp, but move completed proposals to the end
            proposals.sort((a, b) => {
                const aIsCompleted = a.experationTimestamp < currentTime;
                const bIsCompleted = b.experationTimestamp < currentTime;
        
                if (aIsCompleted && !bIsCompleted) {
                    return 1; // a is completed, b is not - put a after b
                } else if (!aIsCompleted && bIsCompleted) {
                    return -1; // b is completed, a is not - put b after a
                } else if (!aIsCompleted && !bIsCompleted) {
                    return a.experationTimestamp - b.experationTimestamp; // Both are active - sort by expiration ascending
                } else {
                    return a.experationTimestamp - b.experationTimestamp; // Both are completed - sort by expiration ascending
                }
            });
        
            setUserProposals(proposals);
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
