//graphContext

import React, { createContext, useReducer, useContext, useState, useEffect } from 'react';
import { useIPFScontext } from './ipfsContext';

const GraphContext = createContext();

export const useGraphContext = () => {
    return useContext(GraphContext);
    }


export const GraphProvider = ({ children }) => {

    const[loaded, setLoaded] = useState('');
    const[poName, setPoName] = useState('1');
    const [hasExecNFT, setHasExecNFT] = useState(false);
    const [hasMemberNFT, setHasMemberNFT] = useState(false);
    const[account, setAccount] = useState("0x06e6620C67255d308A466293070206176288A67B".toLocaleLowerCase());

    const[userData, setUserData] = useState({});
    const[participationVotingOngoing, setParticipationVotingOngoing] = useState({});
    const[participationVotingCompleted, setParticipationVotingCompleted] = useState({});
    const[hybridVotingOngoing, setHybridVotingOngoing] = useState({});
    const[hybridVotingCompleted, setHybridVotingCompleted] = useState({});
    const[democracyVotingOngoing, setDemocracyVotingOngoing] = useState({});
    const[democracyVotingCompleted, setDemocracyVotingCompleted] = useState({});
    const[projectsData, setProjectsData] = useState({});
    const[leaderboardData, setLeaderboardData] = useState({});

    const { fetchFromIpfs } = useIPFScontext();

    //contract address state 
    const [partcipationTokenContractAddress, setPartcipationTokenContractAddress] = useState('');
    const [ddTokenContractAddress, setDDTokenContractAddress] = useState('');
    const [taskManagerContractAddress, setTaskManagerContractAddress] = useState('');
    const [hybridVotingContractAddress, setHybridVotingContractAddress] = useState('');
    const [participationVotingContractAddress, setParticipationVotingContractAddress] = useState('');
    const [directDemocracyVotingContractAddress, setDirectDemocracyVotingContractAddress] = useState('');
    const [nftMembershipContractAddress, setNFTMembershipContractAddress] = useState('');


    



    useEffect(() => {
        async function init() {
            await loadContractAddress(loaded);
            await loadGraphData(loaded);
        }
        if (loaded !== undefined && loaded !== '') {
            if (loaded === poName) {
                console.log('loaded')
            }
            else
            {
                console.log("po name", loaded)
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

    async function fetchUserData(id, org) {
        const query = `
        {
        users(where: {organization: "${org}", id: "${id}"}) {
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
              id
              DirectDemocracyVoting{
                id
                proposals(orderBy: experationTimestamp, orderDirection: asc, where: {winningOptionIndex: null}){
                  id
                  name
                  experationTimestamp
                  creationTimestamp
                  description
                  options{
                    id
                    name
                    votes
                  }
                }
              }
            }
          }`;

        const data = await querySubgraph(query);

        return data.perpetualOrganization.DirectDemocracyVoting.proposals;
    }

    async function fetchDemocracyVotingCompleted(id) {
        const query = `{
            perpetualOrganization(id: "${id}") {
            DirectDemocracyVoting {
                proposals(orderBy: experationTimestamp, orderDirection: desc, where: {winningOptionIndex_not: null}) {
                    id
                    name
                    experationTimestamp
                    creationTimestamp
                    description
                    winningOptionIndex
                    options{
                      id
                      name
                      votes
                    }
                }
            }
            }
        }`;

        const data = await querySubgraph(query);

        return data.perpetualOrganization.DirectDemocracyVoting.proposals;
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
    async function execNFTcheck(poName,id){
        if (poName === undefined){
            return false;
        }


        const query = `{
            perpetualOrganization(id: "${poName}") {
              NFTMembership {
                executiveRoles
              }
              Users(where: {id: "${id}"}){
                      memberType{
                  memberTypeName
                }
                    }
            }
      }`;

      console.log("execNFTcheck",query);

        const data = await querySubgraph(query);
        console.log("pls",data.perpetualOrganization);

        // see if memberTypeName is in executiveRoles
        //loop through executive roles 
        for (let i = 0; i < data.perpetualOrganization.NFTMembership.executiveRoles.length; i++){
            if (data.perpetualOrganization.Users[0].memberType.memberTypeName === data.perpetualOrganization.NFTMembership.executiveRoles[i]){
                setHasExecNFT(true);
                return true;
            }
        }
        setHasExecNFT(false);
        return false;
 
        }

        async function memberNFTcheck(poName,id){   
            if (poName === undefined){
                return false;
            }
            const query = `{
                perpetualOrganization(id: "${poName}") {

                  Users(where: {id: "${id}"}){
                    id
                    }
                      
                }
            }`;
            const data = await querySubgraph(query);
            //check if user id returns a value
            console.log("memberNFTcheck",data);

            if (data.perpetualOrganization.Users.length > 0){
                setHasMemberNFT(true);
                return true;
            }
            setHasMemberNFT(false);
            return false;
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

    const transformProjects = async (perpetualOrganization) => {
        console.log("transform");

        console.log(perpetualOrganization.perpetualOrganization);

        const projects = perpetualOrganization?.perpetualOrganization?.TaskManager?.projects;
        
        if (!Array.isArray(projects) || projects.length === 0) {
            const defaultProject = {
                id: "Make A Project",
                name: "Make A Project",
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
    

        return Promise.all(perpetualOrganization.perpetualOrganization.TaskManager.projects.map(async (project) => {
            const transformedProject = {
                id: project.id,
                name: project.name,
                description: project.description || '', 
                columns: [
                    { id: 'open', title: 'Open', tasks: [] },
                    { id: 'inProgress', title: 'In Progress', tasks: [] },
                    { id: 'inReview', title: 'In Review', tasks: [] },
                    { id: 'completed', title: 'Completed', tasks: [] }
                ],
            };
    
            const tasksData = project.tasks || [];
    
            const taskPromises = tasksData.map(async (task) => {
                const ipfsData = await fetchFromIpfs(task.ipfsHash); 
                console.log("task", ipfsData);
                return {
                    id: task.id,
                    name: ipfsData.name,
                    description: ipfsData.description,
                    difficulty: ipfsData.difficulty,
                    estHours: ipfsData.estHours,
                    submission: ipfsData.submission,
                    claimedBy: task.claimer || '',
                    Payout: parseInt(task.payout, 10),
                    projectId: project.id,
                    location: ipfsData.location,
                    completed: task.completed
                };
            });
    
            const tasks = await Promise.all(taskPromises);
            tasks.forEach((task) => {
                console.log("pposcfvrvrgfvfrvrftask", task);
                // Determine the appropriate column for the task
                let columnTitle = task.location;
                // Check if the task has a claimer and its location is 'Open', then move it to 'In Progress'
                console.log("claimedBy", task.claimedBy);
                console.log("columnTitle", columnTitle);
                if (task.claimedBy && columnTitle === 'Open') {
                    console.log("claimedBy", task.claimedBy);
                    columnTitle = 'In Progress';
                }

                console.log("ssssssscompleted", task.completed);

                if(task.completed){
                    columnTitle = 'Completed';
                    console.log("completed", task.completed);
                }

                
                // Find the column by title
                const column = transformedProject.columns.find(c => c.title === columnTitle);
                if (column) {
                    column.tasks.push(task);
                } else {
                    console.error(`Task location '${task.location}' does not match any column title`);
                }
            });
            
    
            return transformedProject;
        }));
    };

    async function loadContractAddress(poName) {
        const query = `{
            perpetualOrganization(id:"${poName}") {
                TaskManager {
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
                ParticipationToken {
                    id
                }
                NFTMembership {
                    id
                }

            }
          }`;
        const data = await querySubgraph(query);

        // set the data reuslts to contract address
        if (data.perpetualOrganization.TaskManager?.id) {
            setTaskManagerContractAddress(data.perpetualOrganization.TaskManager.id);
        }
        if (data.perpetualOrganization.HybridVoting?.id) {
            setHybridVotingContractAddress(data.perpetualOrganization.HybridVoting.id);
        }
        if (data.perpetualOrganization.ParticipationVoting?.id) {
            setParticipationVotingContractAddress(data.perpetualOrganization.ParticipationVoting.id);
        }
        if (data.perpetualOrganization.DirectDemocracyVoting?.id) {
            setDirectDemocracyVotingContractAddress(data.perpetualOrganization.DirectDemocracyVoting.id);
            console.log("direct democracy voting", data.perpetualOrganization.DirectDemocracyVoting.id);
        }
        if (data.perpetualOrganization.DirectDemocracyToken?.id) {
            setDDTokenContractAddress(data.perpetualOrganization.DirectDemocracyToken.id);
        }
        if (data.perpetualOrganization.ParticipationToken?.id) {
            setPartcipationTokenContractAddress(data.perpetualOrganization.ParticipationToken.id);
        }
        if (data.perpetualOrganization.NFTMembership?.id) {
            setNFTMembershipContractAddress(data.perpetualOrganization.NFTMembership.id);
        }
        

    }
    
      

      
      

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
        console.log("democracy voting ongoing", democracyVotingOngoing);
        setDemocracyVotingCompleted(democracyVotingCompleted);
        console.log("democracy voting completed", democracyVotingCompleted);
        setLeaderboardData(leaderboardData);
        console.log(projectData);
        setProjectsData( await transformProjects(projectData));
        console.log(await execNFTcheck(poName,"0x06e6620c67255d308a466293070206176288a67b"));
        console.log(await memberNFTcheck(poName,"0x06e6620c67255d308a466293070206176288a67b"));

    }

    return (
        <GraphContext.Provider value={{setLoaded, leaderboardData, projectsData, hasExecNFT, hasMemberNFT, account, taskManagerContractAddress, directDemocracyVotingContractAddress, democracyVotingOngoing, democracyVotingCompleted}}>
        {children}
        </GraphContext.Provider>
    );
}




