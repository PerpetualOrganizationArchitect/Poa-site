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

    const [ongoingPolls, setOngoingPolls] = useState([]);

    const [claimedTasks, setClaimedTasks] = useState([]);
    const[reccommendedTasks, setReccomendedTasks] = useState([]);
    const { fetchFromIpfs } = useIPFScontext();
    const [userProposals, setUserProposals] = useState([]);

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
    const [poMembers, setPoMembers] = useState(0);
    const [activeTaskAmount, setActiveTaskAmount] = useState(0);
    const [completedTaskAmount, setCompletedTaskAmount] = useState(0);
    const [ptTokenBalance, setPtTokenBalance] = useState(0);



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

    async function fetchUsersProposals(poName, address) {
        const query = `{
            user(id:"${poName}-${address.toLocaleLowerCase()}"){
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
          }`;
    
        const data = await querySubgraph(query);
    
        // Combine all proposals into one array but keep the type of proposal
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
    
        return proposals;
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
                    validWinner
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

    async function fetchAllOngoingPolls(id) {
        const query = `{
            perpetualOrganization(id: "${id}") {

            DirectDemocracyVoting {
                proposals(orderBy: experationTimestamp, orderDirection: asc, where: {winningOptionIndex: null}) {
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
            HybridVoting {
                proposals(orderBy: experationTimestamp, orderDirection: asc, where: {winningOptionIndex: null}) {
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
            ParticipationVoting {
                proposals(orderBy: experationTimestamp, orderDirection: asc, where: {winningOptionIndex: null}) {
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

        
        // set ongoing polls to correct ongoing use state 
        const ddVoting = data.perpetualOrganization.DirectDemocracyVoting?.proposals;
        const hybridVoting = data.perpetualOrganization.HybridVoting?.proposals;
        const participationVoting = data.perpetualOrganization.ParticipationVoting?.proposals;

        if(ddVoting){
            setDemocracyVotingOngoing(ddVoting);
        }
        if(hybridVoting){
            setHybridVotingOngoing(hybridVoting);
        }

        if(participationVoting){
            setParticipationVotingOngoing(participationVoting);
        }

        // combine all ongoing polls into one array with type of poll check to make sure each exists first 
        const polls = [
            ...(ddVoting || []).map(proposal => ({...proposal, type: 'Direct Democracy'})),
            ...(hybridVoting || []).map(proposal => ({...proposal, type: 'Hybrid'})),
            ...(participationVoting || []).map(proposal => ({...proposal, type: 'Participation'})),
        ];
        setOngoingPolls(polls);
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
                    validWinner
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
    
        // Filter out completed tasks and order the remaining tasks randomly
        const recommendedTasks = data.perpetualOrganization.TaskManager.projects
            .flatMap(project => project.tasks)
            .filter(task => !task.completed)
            .sort(() => Math.random() - 0.5);
    
        setReccomendedTasks(recommendedTasks);
        return data;
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
                    totalVotes: user.totalVotes,
                    dateJoined: user.dateJoined,
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
                totalMembers
                aboutInfo {
                    description
                    links {
                        name
                        url
                    }
                }
                TaskManager {
                    id
                    activeTaskAmount
                    completedTaskAmount
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
                    supply
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

        if (data.perpetualOrganization.totalMembers) {
            console.log("Total Members:", po.totalMembers);
            setPoMembers(po.totalMembers);
        }

        if (data.perpetualOrganization.TaskManager?.activeTaskAmount) {
            console.log("Active Task Amount:", po.TaskManager.activeTaskAmount);
            setActiveTaskAmount(po.TaskManager.activeTaskAmount);
        }

        if (data.perpetualOrganization.TaskManager?.completedTaskAmount) {
            console.log("Completed Task Amount:", po.TaskManager.completedTaskAmount);
            setCompletedTaskAmount(po.TaskManager.completedTaskAmount);
        }

        if (data.perpetualOrganization.ParticipationToken?.supply) {
            console.log("Participation Token Supply:", po.ParticipationToken.supply);
            setPtTokenBalance(po.ParticipationToken.supply);
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
        const proposalData = await fetchAllOngoingPolls(poName);

        const participationVotingCompleted = await fetchParticipationVotingCompleted(poName);
        setParticipationVotingCompleted(participationVotingCompleted);
        const hybridVotingCompleted = await fetchHybridVotingCompleted(poName);
        setHybridVotingCompleted(hybridVotingCompleted);
        const democracyVotingCompleted = await fetchDemocracyVotingCompleted(poName);
        setDemocracyVotingCompleted(democracyVotingCompleted);
        const userProposalData = await fetchUsersProposals(poName, address);
        setUserProposals(userProposalData);
        const leaderboardData = await fetchLeaderboardData(poName);
        setLeaderboardData(leaderboardData);
        


    }

    //function that loads all graph data like last function but without any function that relies on account
    async function loadGraphDataNoAccount(poName) {

        const projectData = await fetchProjectData(poName);
        setProjectsData( await transformProjects(projectData));
        const proposalData = await fetchAllOngoingPolls(poName);

        
        const participationVotingCompleted = await fetchParticipationVotingCompleted(poName);
       
        const hybridVotingCompleted = await fetchHybridVotingCompleted(poName);
       
        const democracyVotingCompleted = await fetchDemocracyVotingCompleted(poName);
       
        const leaderboardData = await fetchLeaderboardData(poName);


        console.log("participationTokenContractAddress", participationVotingContractAddress);
        if(participationVotingContractAddress === ''){
            console.log("hybrid voting ongoinngg", hybridVotingOngoing);
            setParticipationVotingCompleted(hybridVotingCompleted);
            console.log("hybrid voting contract address", hybridVotingContractAddress);
        }else
        {
            setParticipationVotingCompleted(participationVotingCompleted);
            console.log("participation voting contract address", participationVotingContractAddress);
        }
        setDemocracyVotingCompleted(democracyVotingCompleted);
        setLeaderboardData(leaderboardData);


    }

    return (
        <GraphContext.Provider value={{ongoingPolls, userProposals, setGraphUsername, activeTaskAmount,completedTaskAmount, ptTokenBalance, poMembers, reccommendedTasks, taskCount, chainId, poDescription, poLinks, logoHash, address, graphUsername,claimedTasks, ddTokenContractAddress, nftMembershipContractAddress, userData, setLoaded, leaderboardData, projectsData, hasExecNFT, hasMemberNFT, address, taskManagerContractAddress, directDemocracyVotingContractAddress, democracyVotingOngoing, democracyVotingCompleted, participationVotingOngoing, participationVotingCompleted, votingContractAddress, hybridVotingCompleted, hybridVotingOngoing, fetchRules}}>
        {children}
        </GraphContext.Provider>
    );
}




