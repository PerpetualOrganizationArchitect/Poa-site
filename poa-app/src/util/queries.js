// // queries.js
import { gql } from '@apollo/client';



export const FETCH_USERNAME = gql`
  query FetchUsername($id: String!) {
    account(id: $id) {
      id
      userName
    }
  }
`;

export const FETCH_VOTING_DATA = gql`
  query FetchVotingData($id: String!) {
    perpetualOrganization(id: $id) {
      id
      ParticipationVoting {
        id
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
        id
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
        id
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



export const FETCH_PROJECT_DATA = gql`
  query FetchProjectData($id: String!) {
    perpetualOrganization(id: $id) {
      id
      TaskManager {
        id
        projects(where: { deleted: false }) {
          id
          name
          tasks {
            id
            taskInfo {
              id
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
              id
              Account {
                id
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
      id
      logoHash
      totalMembers
      aboutInfo {
        id
        description
        links {
          id
          name
          url
        }
      }
      TaskManager {
        id
        activeTaskAmount
        completedTaskAmount
      }
      ParticipationToken {
        id
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



export const FETCH_USER_DETAILS = gql`
  query FetchUserDetails($id: String!, $poName: String!, $combinedID: String!) {
    account(id: $id) {
      id
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
          id
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
      id
      NFTMembership {
        id
        executiveRoles
      }
      Users(where: { id: $combinedID }) {
        id
        memberType {
          id
          memberTypeName
        }
      }
    }
  }
`;



export const FETCH_PO_AND_USER_DETAILS = gql`
  query FetchPOAndUserDetails($id: String!, $poName: String!, $combinedID: String!) {
    account(id: $id) {
      id
      userName
    }
    user(id: $combinedID) {
      id
      ptTokenBalance
      ddTokenBalance
      totalVotes
      dateJoined
      memberType {
        id
        memberTypeName
        imageURL
      }
      tasks {
        id
        taskInfo {
          id
          name
          description
          difficulty
          estimatedHours
        }
        payout
        completed
      }
      ptProposals(orderBy: experationTimestamp, orderDirection: desc) {
        id
        name
        experationTimestamp
        creationTimestamp
      }
      ddProposals(orderBy: experationTimestamp, orderDirection: desc) {
        id
        name
        experationTimestamp
        creationTimestamp
      }
      hybridProposals(orderBy: experationTimestamp, orderDirection: desc) {
        id
        name
        experationTimestamp
        creationTimestamp
      }
    }
    perpetualOrganization(id: $poName) {
      id
      logoHash
      totalMembers
      aboutInfo {
        id
        description
        links {
          id
          name
          url
        }
      }
      TaskManager {
        id
        activeTaskAmount
        completedTaskAmount
      }
      ParticipationToken {
        id
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
        executiveRoles
      }
      Users(where: { id: $combinedID }) {
        id
        memberType {
          id
          memberTypeName
        }
      }
    }
  }
`;
