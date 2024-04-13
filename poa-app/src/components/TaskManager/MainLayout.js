import React, { useState, useEffect } from 'react';
import { Flex, Box, Heading,} from '@chakra-ui/react';
import ProjectSidebar from './ProjectSidebar';
import TaskBoard from './TaskBoard';
import { TaskBoardProvider } from '../../context/TaskBoardContext';
import { useDataBaseContext} from '../../context/dataBaseContext';
import { useWeb3Context } from '../../context/web3Context';
import { useGraphContext } from '@/context/graphContext';


const MainLayout = () => {
  const {
    projects,
    selectedProject,
    setSelectedProject,
    handleUpdateColumns,

  } = useDataBaseContext();

  

  const {account, createProject}= useWeb3Context()

  const {projectData, taskManagerContractAddress} = useGraphContext();
  

  const handleSelectProject = (projectId) => {
    console.log("selecting project",projectId);
    const selected = projects.find((project) => project.id === projectId);
    setSelectedProject(selected);
    console.log('selected', selected);
  };




  return (
      <Flex minHeight={`calc(100vh - 94px)`}>
        <ProjectSidebar
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
          onCreateProject={(projectName) => createProject(taskManagerContractAddress, projectName)}
        />
        {selectedProject ? (
          <TaskBoardProvider 
            key={selectedProject.id}
            projectId={selectedProject.id}
            initialColumns={selectedProject.columns}
            account={account}
          >
            <TaskBoard 
              columns={selectedProject.columns} 
              projectName={selectedProject.name}
            >
            </TaskBoard>
          </TaskBoardProvider>
        ) : (
          <Flex flexGrow={1} justifyContent="center" alignItems="center">
            <div>No projects selected, please create or select a project.</div>
          </Flex>
        )}
      </Flex>
  );
};

export default MainLayout;

