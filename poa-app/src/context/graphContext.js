//graphContext

import React, { createContext, useReducer, useContext, useState, useEffect } from 'react';
import { useIPFScontext } from './ipfsContext';

const GraphContext = createContext();

import {useAccount} from 'wagmi';

export const useGraphContext = () => {
    return useContext(GraphContext);
    }


export const GraphProvider = ({ children }) => {
    

    const[loaded, setLoaded] = useState('');
    const[poName, setPoName] = useState('1');
    const [hasExecNFT, setHasExecNFT] = useState(false);
    const [hasMemberNFT, setHasMemberNFT] = useState(false);
    const [taskCount, setTaskCount] = useState(0);
    
    const {address, chainId}= useAccount();

   


    const[graphUsername, setGraphUsername] = useState(false);

    const[userData, setUserData] = useState({});
    const[participationVotingOngoing, setParticipationVotingOngoing] = useState({});
    const[participationVotingCompleted, setParticipationVotingCompleted] = useState({});
    const[hybridVotingOngoing, setHybridVotingOngoing] = useState({});
    const[hybridVotingCompleted, setHybridVotingCompleted] = useState({});
    const[democracyVotingOngoing, setDemocracyVotingOngoing] = useState({});
    const[democracyVotingCompleted, setDemocracyVotingCompleted] = useState({});
    const[projectsData, setProjectsData] = useState({});
    const[leaderboardData, setLeaderboardData] = useState({});

    const [claimedTasks, setClaimedTasks] = useState([]);
    const { fetchFromIpfs } = useIPFScontext();

    //contract address state 
    const [partcipationTokenContractAddress, setPartcipationTokenContractAddress] = useState('');
    const [ddTokenContractAddress, setDDTokenContractAddress] = useState('');
    const [taskManagerContractAddress, setTaskManagerContractAddress] = useState('');
    const [hybridVotingContractAddress, setHybridVotingContractAddress] = useState('');
    const [participationVotingContractAddress, setParticipationVotingContractAddress] = useState('');
    const [directDemocracyVotingContractAddress, setDirectDemocracyVotingContractAddress] = useState('');
    const [nftMembershipContractAddress, setNFTMembershipContractAddress] = useState('');
    const [votingContractAddress, setVotingContractAddress] = useState('');

    //Po info 
    const [poDescription, setPOdescription]= useState('No description provided or IPFS content still being indexed')
    const [poLinks, setPOlinks]= useState({})
    const [logoHash, setLogoHash] =useState('')


    



    useEffect(() => {
        
        async function init() {
            await fetchPOdata(loaded);
            await loadGraphData(loaded);
        }

        async function noAccountInit(){
            await fetchPOdata(loaded);
            await loadGraphDataNoAccount(loaded);
        }

        if (loaded !== undefined && loaded !== '' && address !== undefined) {
            if (loaded === poName) {
                console.log('loaded')
            }
            else
            {
                console.log("po name", loaded)
                setPoName(loaded);
                init();
            }

        }else if (loaded !== undefined && loaded !== '' && address === undefined){
            noAccountInit();
        }
    }, [address, loaded]);



    const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;
    
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

    async function fetchRules(id){
        const query = `
        {
            perpetualOrganization(id: "${id}"){
              HybridVoting{
                id
                quorum
              }
              DirectDemocracyVoting{
                id
                quorum
              }
              ParticipationVoting{
                id 
                quorum
              }
              NFTMembership{
                executiveRoles
                memberTypeNames
              }
              Treasury{
                votingContract
              }
            }
          }`;

        const data = await querySubgraph(query);

        return data;

    }



    async function fetchParticpationVotingOngoing(id) {
        const query = `{
            perpetualOrganization(id: "${id}") {
              id
              ParticipationVoting{
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
        console.log("participation voting ongoing", data);

        return data.perpetualOrganization.ParticipationVoting?.proposals;
    }

    async function fetchParticipationVotingCompleted(id) {
        const query = `{
            perpetualOrganization(id: "${id}") {
           ParticipationVoting {
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

        return data.perpetualOrganization.ParticipationVoting?.proposals;
    }

    async function fetchHybridVotingOngoing(id) {
        const query = `{
            perpetualOrganization(id: "${id}") {
              id
              HybridVoting{
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
        console.log("hybrid voting ongoing", data);

        return data.perpetualOrganization.HybridVoting?.proposals;
    }

    async function fetchHybridVotingCompleted(id) {
        const query = `{
            perpetualOrganization(id: "${id}") {
            HybridVoting {
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

        return data.perpetualOrganization.HybridVoting?.proposals;
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
        console.log("democracy voting ongoing", data);

        return data.perpetualOrganization.DirectDemocracyVoting?.proposals;
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

        return data.perpetualOrganization.DirectDemocracyVoting?.proposals;
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
                    taskInfo{
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
                    user{
                        Account{
                            userName
                        }
                    }
                }
                }
            }
            }
        }`;
    
        const data = await querySubgraph(query);
    
        // Initialize a variable to count all tasks
        let taskCount = 0;
    
        // Loop through projects and count the tasks
        if (data.perpetualOrganization && data.perpetualOrganization.TaskManager && data.perpetualOrganization.TaskManager.projects) {
            data.perpetualOrganization.TaskManager.projects.forEach(project => {
                taskCount += project.tasks.length;
            });
        }
    
        setTaskCount(taskCount);
        return data
    }
    

    async function fetchUserDetails(poName, id) {
        if (!poName || !id) {
            console.error("Organization name or user ID is undefined");
            return false;
        }
    
        // Normalize the id to lowercase as per previous usage
        const normalizedId = id.toLowerCase();
    
        const query = `{
            perpetualOrganization(id: "${poName}") {
                NFTMembership {
                    executiveRoles
                }
                Users(where: {id: "${poName}-${normalizedId}"}) {
                    id
                    memberType {
                        memberTypeName
                    }
                }
            }
            account(id: "${normalizedId}") {
                id
                userName
            }
            user(id: "${poName}-${normalizedId}") {
                id
                ptTokenBalance
                ddTokenBalance
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
            }
        }`;
    
        console.log("Fetching user details with query:", query);
        const data = await querySubgraph(query);
    
        // Handle data received from the query
        if (data) {
            const { perpetualOrganization, account, user } = data;
    
            // Set user details based on fetched data
            const hasExecNFT = perpetualOrganization.Users.some(u =>
                perpetualOrganization.NFTMembership.executiveRoles.includes(u.memberType.memberTypeName)
            );
            const hasMemberNFT = perpetualOrganization.Users.length > 0;
            const username = account?.userName || false;
            const userTasks = user?.tasks || [];
            
            // count amount of tasks completed
            let taskCount = 0;
            userTasks.forEach(task => {
                if (task.completed) {
                    taskCount++;
                }
            });

            console.log("tasks completed", taskCount)



            setGraphUsername(username);
            setHasExecNFT(hasExecNFT);
            setHasMemberNFT(hasMemberNFT);
            setClaimedTasks(userTasks.filter(task => !task.completed));
    
            // Set user data details
            if(hasMemberNFT){
                setUserData({
                    id: user.id,
                    ptTokenBalance: user.ptTokenBalance,
                    ddTokenBalance: user.ddTokenBalance,
                    memberType: user.memberType.memberTypeName,
                    imageURL: user.memberType.imageURL,
                    tasksCompleted: taskCount,
                });
            }
    
        }
    
        return false;
    }
    


        

    async function fetchLeaderboardData(id) {
        const query =
        `{
            perpetualOrganization(id: "${id}") {
            Users(orderBy: ptTokenBalance, orderDirection: desc) {
                Account {
                    userName
                }
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
                name: user.Account.userName, 
                token: user.ptTokenBalance, 
                
                
            }));
        } else {
            
            console.error("No data returned from the subgraph query");
            return [];
        }


    }

    async function fetchPOdata(poName) {
        console.log("Fetching Perpetual Organization data for:", poName);
    
        const query = `{
            perpetualOrganization(id: "${poName}") {
                logoHash
                aboutInfo {
                    description
                    links {
                        name
                        url
                    }
                }
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
        console.log("Fetched data:", data);
    
        const po = data.perpetualOrganization;
    
        if (po.logoHash) {
            setLogoHash(po.logoHash);
        }
    
        if (data.perpetualOrganization.aboutInfo?.description) {
            console.log("Description:", po.aboutInfo.description);
            setPOdescription(po.aboutInfo.description);
        }
    
        if (data.perpetualOrganization.aboutInfo?.links) {
            console.log("Links:", po.aboutInfo.links);
            setPOlinks(po.aboutInfo.links);
        }
    
        if (data.perpetualOrganization.TaskManager?.id) {
            setTaskManagerContractAddress(po.TaskManager.id);
        }
    
        if (data.perpetualOrganization.HybridVoting?.id) {
            console.log("Hybrid Voting Contract Address:", po.HybridVoting.id);
            setHybridVotingContractAddress(po.HybridVoting.id);
            setVotingContractAddress(po.HybridVoting.id);
        }
    
        if (data.perpetualOrganization.ParticipationVoting?.id) {
            setParticipationVotingContractAddress(po.ParticipationVoting.id);
            setVotingContractAddress(po.ParticipationVoting.id);
        }
    
        if (data.perpetualOrganization.DirectDemocracyVoting?.id) {
            setDirectDemocracyVotingContractAddress(po.DirectDemocracyVoting.id);
        }
    
        if (data.perpetualOrganization.DirectDemocracyToken?.id) {
            setDDTokenContractAddress(po.DirectDemocracyToken.id);
        }
    
        if (data.perpetualOrganization.ParticipationToken?.id) {
            setPartcipationTokenContractAddress(po.ParticipationToken.id);
        }
    
        if (data.perpetualOrganization.NFTMembership?.id) {
            setNFTMembershipContractAddress(po.NFTMembership.id);
        }
    }

    const transformProjects = async (perpetualOrganization) => {
    
    
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
    
        return projects.map((project) => {
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
            
            tasksData.forEach((task) => {
                const taskInfo = task.taskInfo || {};
                const transformedTask = {
                    id: task.id,
                    name: taskInfo.name || '',
                    description: taskInfo.description || '',
                    difficulty: taskInfo.difficulty || '',
                    estHours: taskInfo.estimatedHours || '',
                    claimedBy: task.claimer || '',
                    Payout: parseInt(task.payout, 10),
                    projectId: project.id,
                    location: taskInfo.location || 'Open',
                    completed: task.completed,
                    claimerUsername: task.user?.Account?.userName || '',
                    submission: taskInfo.submissionContent || '',
                };
    
                let columnTitle = transformedTask.location;
    
                if (transformedTask.claimedBy && columnTitle === 'Open') {
                    columnTitle = 'In Progress';
                }
    
                if (transformedTask.completed) {
                    columnTitle = 'Completed';
                }
    
                const column = transformedProject.columns.find(c => c.title === columnTitle);
                if (column) {
                    column.tasks.push(transformedTask);
                } else {
                    console.error(`Task location '${transformedTask.location}' does not match any column title`);
                }
            });
    
            return transformedProject;
        });
    };
    
      
      

    async function loadGraphData(poName) {

        const userInfo = await fetchUserDetails(poName, address.toLocaleLowerCase());
        const projectData = await fetchProjectData(poName);
        setProjectsData( await transformProjects(projectData));
        const participationVotingOngoing = await fetchParticpationVotingOngoing(poName);
        setParticipationVotingOngoing(participationVotingOngoing);
        const participationVotingCompleted = await fetchParticipationVotingCompleted(poName);
        setParticipationVotingCompleted(participationVotingCompleted);
        const hybridVotingOngoing = await fetchHybridVotingOngoing(poName);
        setHybridVotingOngoing(hybridVotingOngoing);
        const hybridVotingCompleted = await fetchHybridVotingCompleted(poName);
        setHybridVotingCompleted(hybridVotingCompleted);
        const democracyVotingOngoing = await fetchDemocracyVotingOngoing(poName);
        setDemocracyVotingOngoing(democracyVotingOngoing);
        const democracyVotingCompleted = await fetchDemocracyVotingCompleted(poName);
        setDemocracyVotingCompleted(democracyVotingCompleted);
        const leaderboardData = await fetchLeaderboardData(poName);
        setLeaderboardData(leaderboardData);
        


    }

    //function that loads all graph data like last function but without any function that relies on account
    async function loadGraphDataNoAccount(poName) {

        const projectData = await fetchProjectData(poName);
        setProjectsData( await transformProjects(projectData));
        const participationVotingOngoing = await fetchParticpationVotingOngoing(poName);
        const participationVotingCompleted = await fetchParticipationVotingCompleted(poName);
        const hybridVotingOngoing = await fetchHybridVotingOngoing(poName);
        const hybridVotingCompleted = await fetchHybridVotingCompleted(poName);
        const democracyVotingOngoing = await fetchDemocracyVotingOngoing(poName);
        const democracyVotingCompleted = await fetchDemocracyVotingCompleted(poName);
       
        const leaderboardData = await fetchLeaderboardData(poName);


        console.log("participationTokenContractAddress", participationVotingContractAddress);
        if(participationVotingContractAddress === ''){
            console.log("hybrid voting ongoinngg", hybridVotingOngoing);
            setParticipationVotingOngoing(hybridVotingOngoing);
            setParticipationVotingCompleted(hybridVotingCompleted);
            console.log("hybrid voting contract address", hybridVotingContractAddress);
        }else
        {
            setParticipationVotingOngoing(participationVotingOngoing);
            setParticipationVotingCompleted(participationVotingCompleted);
            console.log("participation voting contract address", participationVotingContractAddress);
        }
        setDemocracyVotingOngoing(democracyVotingOngoing);
        setDemocracyVotingCompleted(democracyVotingCompleted);
        setLeaderboardData(leaderboardData);
        

        


    }

    return (
        <GraphContext.Provider value={{taskCount, chainId, poDescription, poLinks, logoHash, address, graphUsername,claimedTasks, ddTokenContractAddress, nftMembershipContractAddress, userData, setLoaded, leaderboardData, projectsData, hasExecNFT, hasMemberNFT, address, taskManagerContractAddress, directDemocracyVotingContractAddress, democracyVotingOngoing, democracyVotingCompleted, participationVotingOngoing, participationVotingCompleted, votingContractAddress, hybridVotingCompleted, hybridVotingOngoing, fetchRules}}>
        {children}
        </GraphContext.Provider>
    );
}




