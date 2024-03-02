//graphContext

import React, { createContext, useReducer, useContext, useState, useEffect } from 'react';

const GraphContext = createContext();

export const useGraphContext = () => {
    return useContext(GraphContext);
    }


export const GraphProvider = ({ children }) => {

    const[loaded, setLoaded] = useState('');
    const[poName, setPoName] = useState('');

    const[userData, setUserData] = useState({});
    const[participationVotingOngoing, setParticipationVotingOngoing] = useState({});
    const[participationVotingCompleted, setParticipationVotingCompleted] = useState({});
    const[hybridVotingOngoing, setHybridVotingOngoing] = useState({});
    const[hybridVotingCompleted, setHybridVotingCompleted] = useState({});
    const[democracyVotingOngoing, setDemocracyVotingOngoing] = useState({});
    const[democracyVotingCompleted, setDemocracyVotingCompleted] = useState({});
    const[projectsData, setProjectsData] = useState({});
    const[leaderboardData, setLeaderboardData] = useState({});



    useEffect(() => {
        async function init() {
            await loadGraphData(loaded);
        }
        if (loaded !== '') {
            if (loaded === poName) {
                console.log('loaded')
            }
            else
            {
                setPoName(loaded);
                init();
            }

        }
    }, [loaded]);



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
        
        const response = await querySubgraph(query);
        if (response && response.perpetualOrganization && response.perpetualOrganization.Users) {
            return response.perpetualOrganization.Users.map(user => ({
                id: user.id,
                name: user.id, 
                token: user.ptTokenBalance, 
                
            }));
        } else {
            
            console.error("No data returned from the subgraph query");
            return [];
        }


    }

    const transformProjects = async (projects) => {
        console.log("transform")
        if (!projects || !Array.isArray(projects.projects)) {
            const defaultProject = {
                id: "Make A Project",
                name:"Make A Project",
                description: '', 
                columns: [
                  { id: 'open', title: 'Open', tasks: [] },
                  { id: 'inProgress', title: 'In Progress', tasks: [] },
                  { id: 'inReview', title: 'In Review', tasks: [] },
                  { id: 'completed', title: 'Completed', tasks: [] }
                ],
              };

            return [defaultProject];
          }

        return Promise.all(projects.map(async (project) => {
          const transformedProject = {
            id: project.id,
            name: project.name,
            description: '', 
            columns: [
              { id: 'open', title: 'Open', tasks: [] },
              { id: 'inProgress', title: 'In Progress', tasks: [] },
              { id: 'inReview', title: 'In Review', tasks: [] },
              { id: 'completed', title: 'Completed', tasks: [] }
            ],
          };
      
          const taskPromises = project.tasks.map(async (task) => {
            const ipfsData = await fetchFromIpfs(task.ipfsHash); 
            return {
              id: ipfsData.id,
              name: ipfsData.name,
              description: ipfsData.description,
              difficulty: ipfsData.difficulty,
              estHours: ipfsData.estHours,
              submission: ipfsData.submission,
              claimedBy: task.claimer || '',
              Payout: parseInt(task.payout, 10),
              projectId: project.id,
              location: ipfsData.location
            };
          });
      
          const tasks = await Promise.all(taskPromises);
          tasks.forEach((task) => {
            const column = transformedProject.columns.find(c => c.title === task.location);
            if (column) {
              column.tasks.push(task);
            } else {
             
              console.error(`Task location '${task.location}' does not match any column title`);
            }
          });
      
          return transformedProject;
        }));
      };
      

      
      

    async function loadGraphData(poName) {
        const userData = await fetchUserData(poName);
        const participationVotingOngoing = await fetchParticpationVotingOngoing(poName);
        const participationVotingCompleted = await fetchParticipationVotingCompleted(poName);
        const hybridVotingOngoing = await fetchHybridVotingOngoing(poName);
        const hybridVotingCompleted = await fetchHybridVotingCompleted(poName);
        const democracyVotingOngoing = await fetchDemocracyVotingOngoing(poName);
        const democracyVotingCompleted = await fetchDemocracyVotingCompleted(poName);
        const projectData = await fetchProjectData(poName);
        const leaderboardData = await fetchLeaderboardData(poName);

        setUserData(userData);
        setParticipationVotingOngoing(participationVotingOngoing);
        setParticipationVotingCompleted(participationVotingCompleted);
        setHybridVotingOngoing(hybridVotingOngoing);
        setHybridVotingCompleted(hybridVotingCompleted);
        setDemocracyVotingOngoing(democracyVotingOngoing);
        setDemocracyVotingCompleted(democracyVotingCompleted);
        setLeaderboardData(leaderboardData);
        console.log(projectData);
        setProjectsData( await transformProjects(projectData));

    }

    return (
        <GraphContext.Provider value={{setLoaded, leaderboardData, projectsData}}>
        {children}
        </GraphContext.Provider>
    );
}




