import {ethers } from 'ethers';
import { createContext, useContext, useState, useEffect, use } from 'react';
import { useWeb3Context } from './web3Context';
import { useIPFScontext } from './ipfsContext';
import { set } from 'lodash';
import { id } from 'ethers/lib/utils';
import { useProjectContext } from './ProjectContext';



const DataBaseContext = createContext();

export const useDataBaseContext = () => {
  return useContext(DataBaseContext);
};

export const DataBaseProvider = ({ children }) => {
    // usestate for projects initalized with mock data with 3 projects and each has an id 

    const {projectsData}= useProjectContext();

    useEffect(()=>{
        if (typeof projectsData === 'object' && projectsData !== null && Object.keys(projectsData).length !== 0) {
            console.log("projectsData", projectsData);
            setProjects(projectsData);
            setSelectedProject(projectsData[0]);
        }
    },[projectsData])


    const [projects, setProjects] = useState([
        {
          id: 'project-1',
          name: 'Project One',
          description: 'This is a description of Project One.',
          columns: [
            {
              id: 'open',
              title: 'Open',
              tasks: [
                {
                  id: 'task-1',
                  name: 'Task One',
                  description: 'This is a description of Task One.',
                  difficulty: 'Easy',
                  estHours: 5,
                  submission: '',
                  claimedBy: '',
                  Payout: 1,
                  projectId: 'project-1'
                },
                {
                  id: 'task-2',
                  name: 'Task Two',
                  description: 'This is a description of Task Two.',
                  difficulty: 'Medium',
                  estHours: 10,
                  submission: '',
                  claimedBy: '',
                    Payout: 2,
                    projectId: 'project-1'
                }
              ],
            },
            {
              id: 'inProgress',
              title: 'In Progress',
              tasks: [
                {
                  id: 'task-3',
                  name: 'Task Three',
                  description: 'This is a description of Task Three.',
                  difficulty: 'Hard',
                  estHours: 20,
                  submission: '',
                  claimedBy: ''
                }
              ],
            }
          ]
        },
        {
          id: 'project-2',
          name: 'Project Two',
          description: 'This is a description of Project Two.',
          startDate: '2023-05-15',
          endDate: '2024-05-14',
          status: 'Completed'
        },
        {
          id: 'project-3',
          name: 'Project Three',
          description: 'This is a description of Project Three.',
          startDate: '2024-03-01',
          endDate: '2025-03-01',
          status: 'Planned'
        }
      ]);

      const emptyProjectTemplate = {
        id: '', 
        name: '', 
        description: '', 
        columns: [
          {
            id: '', 
            title: '', 
            tasks: [
              {
                id: '', 
                name: '',
                description: '', 
                difficulty: '', 
                estHours: 0, 
                submission: '', 
                claimedBy: '', 
                Payout: 0, 
                projectId: '' 
              },
              
            ],
          },
          
        ],
      };
      
      
      
      

    const [selectedProjectId, setSelectedProjectId] = useState('');

    const [selectedProject,setSelectedProject] = useState('')


    
  
    
    return (
        <DataBaseContext.Provider
        value={{projects, selectedProjectId, setSelectedProjectId, selectedProject, setSelectedProject
        }}
        >
        {children}
        </DataBaseContext.Provider>

      );
    };