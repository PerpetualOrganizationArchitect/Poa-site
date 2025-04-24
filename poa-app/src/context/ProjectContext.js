import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { FETCH_PROJECT_DATA, FETCH_ALL_PO_DATA } from '../util/queries';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { BigNumber } from 'ethers';

const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projectsData, setProjectsData] = useState([]);
  const [taskCount, setTaskCount] = useState(0);
  const [recommendedTasks, setRecommendedTasks] = useState([]);
  const { address } = useAccount();

  const router = useRouter();
  const { userDAO } = router.query;
  const poName = userDAO || '';

  const [account, setAccount] = useState('0x00');

  useEffect(() => {
    if (address) {
      setAccount(address);
    }
  }, [address]);

  
  const combinedID = `${poName}-${account?.toLowerCase()}`;



  const  { data, loading, error } = useQuery(FETCH_ALL_PO_DATA, {
    variables: { id: account?.toLowerCase(), poName: poName, combinedID: combinedID },
    skip: !account || !poName || !combinedID,
    fetchPolicy:'cache-first',
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      console.log('Query project completed successfully');
    },
  });

  useEffect(() => {
    if (data) {
      console.log("data", data);
      const projects = data.perpetualOrganization.TaskManager.projects;

      const totalTaskCount =
        BigNumber.from(data.perpetualOrganization.TaskManager.activeTaskAmount).toNumber() +
        BigNumber.from(data.perpetualOrganization.TaskManager.completedTaskAmount).toNumber() +
        BigNumber.from(data.perpetualOrganization.TaskManager.deletedTaskAmount).toNumber();
      
      setTaskCount(totalTaskCount);

      const recommendedTasks = projects
      .flatMap(project => project.tasks.map(task => ({ ...task, projectId: project.id })))
        .filter(task => task.taskInfo && task.taskInfo.location === 'Open')
        .sort(() => Math.random() - 0.5);


      setRecommendedTasks(recommendedTasks);

      const transformedProjects = projects.map(project => {
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

        project.tasks.forEach(task => {
          const taskInfo = task.taskInfo || {};
          const transformedTask = {
            id: task.id,
            name: taskInfo.name || 'Indexing...',
            description: taskInfo.description || 'Task information is being indexed from IPFS',
            difficulty: taskInfo.difficulty || '',
            estHours: taskInfo.estimatedHours || '',
            claimedBy: task.claimer || '',
            Payout: parseInt(task.payout, 10),
            projectId: project.id,
            location: taskInfo.location || 'Open',
            completed: task.completed,
            claimerUsername: task.user?.Account?.userName || '',
            submission: taskInfo.submissionContent || '',
            isIndexing: !task.taskInfo,
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

      setProjectsData(transformedProjects);
    }
  }, [data]);

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(() => ({
    projectsData,
    taskCount,
    recommendedTasks,
    loading,
    error,
  }), [projectsData, taskCount, recommendedTasks, loading, error]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};
