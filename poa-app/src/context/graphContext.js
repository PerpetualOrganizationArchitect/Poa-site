const SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/hudsonhrh/poa';

async function querySubgraph(query) {
    const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });

    const data = await response.json();

    if (data.errors) {
        console.error('Error fetching data:', data.errors);
        return null;
    }

    return data.data;
}

async function fetchUserData(id) {
    const query = `
    {
      users(where: {organization: "Test Org", id: "${id}"}) {
        ptTokenBalance
        ddTokenBalance
        memberType {
          memberTypeName
          imageURL
        }
      }
    }`;

    const data = await querySubgraph(query);

    return data.users[0];
}

async function fetchParticpationVotingOngoing(id) {
    const query = `{
        perpetualOrganization(id: "${id}") {
          ParticipationVoting {
            proposals(orderBy: experationTimestamp, orderDirection: asc, where: {winningOptionIndex: null}) {
              id
            }
          }
        }
      }`;

    const data = await querySubgraph(query);

    return data
}

async function fetchParticipationVotingCompleted(id) {
    const query = `{
        perpetualOrganization(id: "${id}") {
          ParticipationVoting {
            proposals(orderBy: experationTimestamp, orderDirection: desc, where: {winningOptionIndex_not: null}) {
              id
            }
          }
        }
      }`;

    const data = await querySubgraph(query);

    return data
}

async function fetchHybridVotingOngoing(id) {
    const query = `{
        perpetualOrganization(id: "${id}") {
          HybridVoting {
            proposals(orderBy: experationTimestamp, orderDirection: asc, where: {winningOptionIndex: null}) {
              id
            }
          }
        }
      }`;

    const data = await querySubgraph(query);

    return data
}

async function fetchHybridVotingCompleted(id) {
    const query = `{
        perpetualOrganization(id: "${id}") {
          HybridVoting {
            proposals(orderBy: experationTimestamp, orderDirection: desc, where: {winningOptionIndex_not: null}) {
              id
            }
          }
        }
      }`;

    const data = await querySubgraph(query);

    return data
}

async function fetchDemocracyVotingOngoing(id) {
    const query = `{
        perpetualOrganization(id: "${id}") {
          DirectDemocracyVoting {
            proposals(orderBy: experationTimestamp, orderDirection: asc, where: {winningOptionIndex: null}) {
              id
            }
          }
        }
      }`;

    const data = await querySubgraph(query);

    return data
}

async function fetchDemocracyVotingCompleted(id) {
    const query = `{
        perpetualOrganization(id: "${id}") {
          DirectDemocracyVoting {
            proposals(orderBy: experationTimestamp, orderDirection: desc, where: {winningOptionIndex_not: null}) {
              id
            }
          }
        }
      }`;

    const data = await querySubgraph(query);

    return data
}

async function fetchProjectData(id) {
    const query = `
    {
        perpetualOrganization(id: "${id}") {
          TaskManager {
            projects(where: {deleted: false}) {
              id
              name
              tasks {
                id
                ipfsHash
                payout
                claimer
                completed
              }
            }
          }
        }
    }`;

    const data = await querySubgraph(query);

    return data
}

async function fetchLeaderboardData(id) {
    const query =
    `{
        perpetualOrganization(id: "${id}") {
          Users(orderBy: ptTokenBalance, orderDirection: desc) {
            id
            ptTokenBalance
            ddTokenBalance
            memberType {
              memberTypeName
              imageURL
            }
          }
        }
      }`;
    
    const data = await querySubgraph(query);

    return data

}



async function main(){
    await fetchUserData("0x06e6620c67255d308a466293070206176288a67b").then(user => console.log(user));
    await fetchParticipationVotingCompleted("Test Org").then(user => console.log(user));
    await fetchParticpationVotingOngoing("Test Org").then(user => console.log(user));
    await fetchHybridVotingOngoing("Test Org").then(user => console.log(user));
    await fetchHybridVotingCompleted("Test Org").then(user => console.log(user));
    await fetchProjectData("Test Org").then(user => console.log(user));
    await fetchLeaderboardData("Test Org").then(data => console.log(JSON.stringify(data, null, 2)));
    await fetchDemocracyVotingOngoing("Test Org").then(user => console.log(user));
    await fetchDemocracyVotingCompleted("Test Org").then(user => console.log(user));

}

main()


