// ProjectContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { FETCH_PROJECT_DATA } from './queries';
import client from './apolloClient';

const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider = ({ children, poName }) => {
  const [projectsData, setProjectsData] = useState([]);
  const [taskCount, setTaskCount] = useState(0);
  const [reccommendedTasks, setReccommendedTasks] = useState([]);

  const { data, loading, error } = useQuery(FETCH_PROJECT_DATA, {
    variables: { id: poName },
    client,
  });

  useEffect(() => {
    if (data) {
      const projects = data.perpetualOrganization.TaskManager.projects;

      let taskCount = 0;
      projects.forEach(project => {
        taskCount += project.tasks.length;
      });
      setTaskCount(taskCount);

      const reccommendedTasks = projects
        .flatMap(project => project.tasks)
        .filter(task => !task.completed)
        .sort(() => Math.random() - 0.5);

      setReccommendedTasks(reccommendedTasks);

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

      setProjectsData(transformedProjects);
    }
  }, [data]);

  return (
    <ProjectContext.Provider value={{ projectsData, taskCount, reccommendedTasks, loading, error }}>
      {children}
    </ProjectContext.Provider>
  );
};
