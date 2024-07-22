// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
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

    const router = useRouter();
    const { userDAO } = router.query;

    const combinedID = `${userDAO}-${address?.toLowerCase()}`;

    console.log("combinedID", combinedID);

    const { data, loading, error } = useQuery(FETCH_USER_DETAILS, {
        variables: { id: address?.toLowerCase(), poName: userDAO, combinedID: combinedID},
        skip: !address || !userDAO || !combinedID,
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
        }
    }, [data]);

  return (
    <UserContext.Provider value={{ userData, graphUsername, hasExecNFT, hasMemberNFT, claimedTasks, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
