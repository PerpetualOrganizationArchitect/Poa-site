// // UserContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useQuery } from '@apollo/client';
// import { useAccount } from 'wagmi';
// import { FETCH_USERNAME, FETCH_USER_DETAILS } from './queries';
// import client from './apolloClient';

// const UserContext = createContext();

// export const useUserContext = () => useContext(UserContext);

// export const UserProvider = ({ children }) => {
//   const { address } = useAccount();
//   const [userData, setUserData] = useState({});
//   const [graphUsername, setGraphUsername] = useState(false);
//   const [claimedTasks, setClaimedTasks] = useState([]);

//   const { data: usernameData } = useQuery(FETCH_USERNAME, {
//     variables: { id: address?.toLowerCase() },
//     client,
//     skip: !address,
//   });

//   const { data: userDetailsData } = useQuery(FETCH_USER_DETAILS, {
//     variables: { poName: 'your_po_name', id: address?.toLowerCase() },
//     client,
//     skip: !address,
//   });

//   useEffect(() => {
//     if (usernameData) {
//       setGraphUsername(usernameData.account.userName);
//     }
//   }, [usernameData]);

//   useEffect(() => {
//     if (userDetailsData) {
//       const { user, perpetualOrganization } = userDetailsData;
//       const hasExecNFT = perpetualOrganization.Users.some(u =>
//         perpetualOrganization.NFTMembership.executiveRoles.includes(u.memberType.memberTypeName)
//       );
//       const hasMemberNFT = perpetualOrganization.Users.length > 0;
//       const userTasks = user?.tasks || [];

//       let tasksCompleted = [];
//       let taskCount = 0;
//       userTasks.forEach(task => {
//         if (task.completed) {
//           tasksCompleted.push(task);
//           taskCount++;
//         }
//       });

//       setClaimedTasks(userTasks.filter(task => !task.completed));

//       if (hasMemberNFT) {
//         setUserData({
//           id: user.id,
//           ptTokenBalance: user.ptTokenBalance,
//           ddTokenBalance: user.ddTokenBalance,
//           memberType: user.memberType.memberTypeName,
//           imageURL: user.memberType.imageURL,
//           tasksCompleted: taskCount,
//           totalVotes: user.totalVotes,
//           dateJoined: user.dateJoined,
//           completedTasks: tasksCompleted,
//         });
//       }
//     }
//   }, [userDetailsData]);

//   return (
//     <UserContext.Provider value={{ userData, graphUsername, claimedTasks }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
