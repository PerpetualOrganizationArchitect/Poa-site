import React, { useState, useEffect } from 'react';
import { Flex, Box, Heading,} from '@chakra-ui/react';
import ProjectSidebar from './ProjectSidebar';
import TaskBoard from './TaskBoard';
import { TaskBoardProvider } from '../../context/TaskBoardContext';
import { useDataBaseContext} from '../../context/dataBaseContext';
import { useWeb3Context } from '../../context/web3Context';
import { usePOContext } from '@/context/POContext';
	
import { useRouter } from 'next/router';


const MainLayout = () => {
  const {
    projects,
    selectedProject,
    setSelectedProject,
    handleUpdateColumns,

  } = useDataBaseContext();


  const {account, createProject}= useWeb3Context()

  const {taskManagerContractAddress} = usePOContext();

  const router = useRouter();

  const handleSelectProject = (projectId) => {
     // Decode first to handle any prior encoding, then encode properly
     const safeProjectId = encodeURIComponent(decodeURIComponent(projectId));

    router.push(`/tasks?projectId=${safeProjectId}&userDAO=${router.query.userDAO}`);
    console.log("selecting project",projectId);
    const selected = projects.find((project) => project.id === projectId);
    setSelectedProject(selected);
    console.log('selected', selected);
  };


  return (
      <Flex minHeight={`calc(100vh - 80px)`}>
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

