// // queries.js
import { gql } from '@apollo/client';

// export const GET_PROJECT_DATA = gql`
//   query GetProjectData($id: String!) {
//     perpetualOrganization(id: $id) {
//       TaskManager {
//         projects {
//           id
//           name
//           tasks {
//             id
//             taskInfo {
//               name
//               description
//               difficulty
//               estimatedHours
//               location
//               submissionContent
//             }
//             payout
//             claimer
//             completed
//             user {
//               Account {
//                 userName
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// export const GET_USER_DATA = gql`
//   query GetUserData($address: String!) {
//     account(id: $address) {
//       userName
//     }
//     user(id: $address) {
//       ptTokenBalance
//       ddTokenBalance
//       totalVotes
//       dateJoined
//       memberType {
//         memberTypeName
//         imageURL
//       }
//       tasks {
//         id
//         taskInfo {
//           name
//           description
//           difficulty
//           estimatedHours
//         }
//         payout
//         completed
//       }
//     }
//   }
// `;

// export const GET_VOTING_DATA = gql`
//   query GetVotingData($id: String!) {
//     perpetualOrganization(id: $id) {
//       ParticipationVoting {
//         proposals(orderBy: experationTimestamp, orderDirection: desc) {
//           id
//           name
//           experationTimestamp
//           creationTimestamp
//           description
//           winningOptionIndex
//           options {
//             id
//             name
//             votes
//           }
//         }
//       }
//       HybridVoting {
//         proposals(orderBy: experationTimestamp, orderDirection: desc) {
//           id
//           name
//           experationTimestamp
//           creationTimestamp
//           description
//           winningOptionIndex
//           validWinner
//           options {
//             id
//             name
//             votes
//           }
//         }
//       }
//       DirectDemocracyVoting {
//         proposals(orderBy: experationTimestamp, orderDirection: desc) {
//           id
//           name
//           experationTimestamp
//           creationTimestamp
//           description
//           winningOptionIndex
//           validWinner
//           options {
//             id
//             name
//             votes
//           }
//         }
//       }
//     }
//   }
// `;

// export const FETCH_RULES = gql`
//   query FetchRules($id: String!) {
//     perpetualOrganization(id: $id) {
//       HybridVoting {
//         id
//         quorum
//       }
//       DirectDemocracyVoting {
//         id
//         quorum
//       }
//       ParticipationVoting {
//         id
//         quorum
//       }
//       NFTMembership {
//         executiveRoles
//         memberTypeNames
//       }
//       Treasury {
//         votingContract
//       }
//     }
//   }
// `;

// export const FETCH_PARTICIPATION_VOTING_COMPLETED = gql`
//   query FetchParticipationVotingCompleted($id: String!) {
//     perpetualOrganization(id: $id) {
//       ParticipationVoting {
//         proposals(orderBy: experationTimestamp, orderDirection: desc, where: { winningOptionIndex_not: null }) {
//           id
//           name
//           experationTimestamp
//           creationTimestamp
//           description
//           winningOptionIndex
//           options {
//             id
//             name
//             votes
//           }
//         }
//       }
//     }
//   }
// `;

// export const FETCH_HYBRID_VOTING_COMPLETED = gql`
//   query FetchHybridVotingCompleted($id: String!) {
//     perpetualOrganization(id: $id) {
//       HybridVoting {
//         proposals(orderBy: experationTimestamp, orderDirection: desc, where: { winningOptionIndex_not: null }) {
//           id
//           name
//           experationTimestamp
//           creationTimestamp
//           description
//           winningOptionIndex
//           validWinner
//           options {
//             id
//             name
//             votes
//           }
//         }
//       }
//     }
//   }
// `;

// export const FETCH_DEMOCRACY_VOTING_COMPLETED = gql`
//   query FetchDemocracyVotingCompleted($id: String!) {
//     perpetualOrganization(id: $id) {
//       DirectDemocracyVoting {
//         proposals(orderBy: experationTimestamp, orderDirection: desc, where: { winningOptionIndex_not: null }) {
//           id
//           name
//           experationTimestamp
//           creationTimestamp
//           description
//           winningOptionIndex
//           validWinner
//           options {
//             id
//             name
//             votes
//           }
//         }
//       }
//     }
//   }
// `;

export const FETCH_USERNAME = gql`
  query FetchUsername($id: String!) {
    account(id: $id) {
      userName
    }
  }
`;

export const FETCH_VOTING_DATA = gql`
  query FetchVotingData($id: String!) {
    perpetualOrganization(id: $id) {
      ParticipationVoting {
        proposals {
          id
          name
          experationTimestamp
          creationTimestamp
          description
          winningOptionIndex
          options {
            id
            name
            votes
          }
        }
      }
      HybridVoting {
        proposals {
          id
          name
          experationTimestamp
          creationTimestamp
          description
          winningOptionIndex
          options {
            id
            name
            votes
          }
        }
      }
      DirectDemocracyVoting {
        proposals {
          id
          name
          experationTimestamp
          creationTimestamp
          description
          winningOptionIndex
          options {
            id
            name
            votes
          }
        }
      }
    }
  }
`;

// export const FETCH_ALL_ONGOING_POLLS = gql`
//   query FetchAllOngoingPolls($id: String!) {
//     perpetualOrganization(id: $id) {
//       DirectDemocracyVoting {
//         proposals(orderBy: experationTimestamp, orderDirection: asc, where: { winningOptionIndex: null }) {
//           id
//           name
//           experationTimestamp
//           creationTimestamp
//           description
//           options {
//             id
//             name
//             votes
//           }
//         }
//       }
//       HybridVoting {
//         proposals(orderBy: experationTimestamp, orderDirection: asc, where: { winningOptionIndex: null }) {
//           id
//           name
//           experationTimestamp
//           creationTimestamp
//           description
//           options {
//             id
//             name
//             votes
//           }
//         }
//       }
//       ParticipationVoting {
//         proposals(orderBy: experationTimestamp, orderDirection: asc, where: { winningOptionIndex: null }) {
//           id
//           name
//           experationTimestamp
//           creationTimestamp
//           description
//           options {
//             id
//             name
//             votes
//           }
//         }
//       }
//     }
//   }
// `;

export const FETCH_PROJECT_DATA = gql`
  query FetchProjectData($id: String!) {
    perpetualOrganization(id: $id) {
      TaskManager {
        projects(where: { deleted: false }) {
          id
          name
          tasks {
            id
            taskInfo {
              name
              description
              difficulty
              estimatedHours
              location
              submissionContent
            }
            payout
            claimer
            completed
            user {
              Account {
                userName
              }
            }
          }
        }
      }
    }
  }
`;


export const FETCH_PO_DATA = gql`
  query FetchPODetails($poName: String!) {
    perpetualOrganization(id: $poName) {
      logoHash
      totalMembers
      aboutInfo {
        description
        links {
          name
          url
        }
      }
      TaskManager {
        activeTaskAmount
        completedTaskAmount
      }
      ParticipationToken {
        supply
      }
      Treasury {
        id
      }
      QuickJoinContract {
        id
      }
      HybridVoting {
        id
      }
      ParticipationVoting {
        id
      }
      DirectDemocracyVoting {
        id
      }
      DirectDemocracyToken {
        id
      }
      NFTMembership {
        id
      }
    }
  }
`;


// export const FETCH_USERNAME = gql`
//   query FetchUsername($id: String!) {
//     account(id: $id) {
//       userName
//     }
//   }
// `;

// export const FETCH_USER_DETAILS = gql`
//   query FetchUserDetails($poName: String!, $id: String!) {
//     perpetualOrganization(id: $poName) {
//       NFTMembership {
//         executiveRoles
//       }
//       Users(where: { id: $poName-$id }) {
//         id
//         memberType {
//           memberTypeName
//         }
//       }
//     }
//     account(id: $id) {
//       id
//       userName
//     }
//     user(id: $poName-$id) {
//       id
//       ptTokenBalance
//       ddTokenBalance
//       totalVotes
//       dateJoined
//       memberType {
//         memberTypeName
//         imageURL
//       }
//       tasks {
//         id
//         taskInfo {
//           name
//           description
//           difficulty
//           estimatedHours
//         }
//         payout
//         completed
//       }
//     }
//   }
// `;

// export const FETCH_LEADERBOARD_DATA = gql`
//   query FetchLeaderboardData($id: String!) {
//     perpetualOrganization(id: $id) {
//       Users(orderBy: ptTokenBalance, orderDirection: desc) {
//         Account {
//           userName
//         }
//         id
//         ptTokenBalance
//         ddTokenBalance
//         memberType {
//           memberTypeName
//           imageURL
//         }
//       }
//     }
//   }
// `;

// export const FETCH_PO_DATA = gql`
//   query FetchPOData($poName: String!) {
//     perpetualOrganization(id: $poName) {
//       logoHash
//       totalMembers
//       aboutInfo {
//         description
//         links {
//           name
//           url
//         }
//       }
//       TaskManager {
//         id
//         activeTaskAmount
//         completedTaskAmount
//       }
//       HybridVoting {
//         id
//       }
//       ParticipationVoting {
//         id
//       }
//       DirectDemocracyVoting {
//         id
//       }
//       DirectDemocracyToken {
//         id
//       }
//       ParticipationToken {
//         id
//         supply
//       }
//       NFTMembership {
//         id
//       }
//       Treasury {
//         id
//       }
//       QuickJoinContract {
//         id
//       }
//     }
//   }
// `;
export const FETCH_USER_DETAILS = gql`
  query FetchUserDetails($id: String!, $poName: String!, $combinedID: String!) {
    account(id: $id) {
      userName
    }
    user(id: $combinedID) {
      id
      ptTokenBalance
      ddTokenBalance
      totalVotes
      dateJoined
      memberType {
        memberTypeName
        imageURL
      }
      tasks {
        id
        taskInfo {
          name
          description
          difficulty
          estimatedHours
        }
        payout
        completed
      }
      ptProposals(orderBy: experationTimestamp, orderDirection: desc){
        id
        name
        experationTimestamp
        creationTimestamp
      }
      ddProposals(orderBy: experationTimestamp, orderDirection: desc){
        id
        name
        experationTimestamp
        creationTimestamp
      }
      hybridProposals(orderBy: experationTimestamp, orderDirection: desc){
        id
        name
        experationTimestamp
        creationTimestamp
      }
    }
    perpetualOrganization(id: $poName) {
      NFTMembership {
        executiveRoles
      }
      Users(where: { id: $combinedID }) {
        id
        memberType {
          memberTypeName
        }
      }
    }
  }
`;