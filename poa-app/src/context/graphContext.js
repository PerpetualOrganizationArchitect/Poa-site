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
            perpetualOrganization(id: "TreeHouse"){
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
                    ipfsHash
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
            
            // Log and set states (assuming state-setting functions are available in scope)
            console.log("Executive NFT:", hasExecNFT);
            console.log("Member NFT:", hasMemberNFT);
            console.log("Username:", username);
            console.log("User tasks:", userTasks);
            console.log("User data:", user);
    
            // Assuming setGraphUsername, setHasExecNFT, setHasMemberNFT, setClaimedTasks, and setUserData are defined
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
        console.log("transform");

        console.log(perpetualOrganization.perpetualOrganization);

        const projects = perpetualOrganization?.perpetualOrganization?.TaskManager?.projects;
        console.log("projects", projects);
        
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
                console.log("task", task);
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
      
      

    async function loadGraphData(poName) {

        const userInfo = await fetchUserDetails(poName, address.toLocaleLowerCase());
        
       
        const participationVotingOngoing = await fetchParticpationVotingOngoing(poName);
        const participationVotingCompleted = await fetchParticipationVotingCompleted(poName);
        const hybridVotingOngoing = await fetchHybridVotingOngoing(poName);
        const hybridVotingCompleted = await fetchHybridVotingCompleted(poName);
        const democracyVotingOngoing = await fetchDemocracyVotingOngoing(poName);
        const democracyVotingCompleted = await fetchDemocracyVotingCompleted(poName);
        const projectData = await fetchProjectData(poName);
        const leaderboardData = await fetchLeaderboardData(poName);
        

        console.log("setting user data", userInfo);
        setParticipationVotingOngoing(participationVotingOngoing);
        setParticipationVotingCompleted(participationVotingCompleted);
        setHybridVotingOngoing(hybridVotingOngoing);
        setHybridVotingCompleted(hybridVotingCompleted);
        setDemocracyVotingOngoing(democracyVotingOngoing);
        console.log("democracy voting ongoing", democracyVotingOngoing);
        setDemocracyVotingCompleted(democracyVotingCompleted);
        console.log("democracy voting completed", democracyVotingCompleted);
        setLeaderboardData(leaderboardData);
        console.log("leaderboard", leaderboardData);
        console.log(projectData);
        setProjectsData( await transformProjects(projectData));


    }

    //function that loads all graph data like last function but without any function that relies on account
    async function loadGraphDataNoAccount(poName) {
        const participationVotingOngoing = await fetchParticpationVotingOngoing(poName);
        const participationVotingCompleted = await fetchParticipationVotingCompleted(poName);
        const hybridVotingOngoing = await fetchHybridVotingOngoing(poName);
        const hybridVotingCompleted = await fetchHybridVotingCompleted(poName);
        const democracyVotingOngoing = await fetchDemocracyVotingOngoing(poName);
        const democracyVotingCompleted = await fetchDemocracyVotingCompleted(poName);
        const projectData = await fetchProjectData(poName);
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
        setProjectsData( await transformProjects(projectData));

        


    }

    return (
        <GraphContext.Provider value={{chainId, poDescription, poLinks, logoHash, address, graphUsername,claimedTasks, ddTokenContractAddress, nftMembershipContractAddress, userData, setLoaded, leaderboardData, projectsData, hasExecNFT, hasMemberNFT, address, taskManagerContractAddress, directDemocracyVotingContractAddress, democracyVotingOngoing, democracyVotingCompleted, participationVotingOngoing, participationVotingCompleted, votingContractAddress, hybridVotingCompleted, hybridVotingOngoing, fetchRules}}>
        {children}
        </GraphContext.Provider>
    );
}




