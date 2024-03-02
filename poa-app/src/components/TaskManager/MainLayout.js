import React, { useState, useEffect } from 'react';
import { Flex, Box, Heading,} from '@chakra-ui/react';
import ProjectSidebar from './ProjectSidebar';
import TaskBoard from './TaskBoard';
import { TaskBoardProvider } from '../../context/TaskBoardContext';
import { useDataBaseContext} from '../../context/dataBaseContext';
import { useWeb3Context } from '../../context/Web3Context';


const MainLayout = () => {
  const {
    projects,
    selectedProject,
    setSelectedProject,
    handleUpdateColumns,
    handleCreateProject,

  } = useDataBaseContext();

  const {account}= useWeb3Context()
  

  const handleSelectProject = (projectId) => {
    const selected = projects.find((project) => project.id === projectId);
    setSelectedProject(selected);
  };




  return (
    <Flex direction="column" w="100%" minH="90vh">
      <Box bg={"#2d86fff7"} p={4} boxShadow="md">
        <Heading mr={"300px"}color={'white'} size="md">KUBI Task Manager</Heading>
      </Box>
      <Flex w="100%" flex="1">
        <ProjectSidebar
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
          onCreateProject={handleCreateProject}
        />
        {selectedProject ? (
          <TaskBoardProvider 
            key={selectedProject.id}
            projectId={selectedProject.id}
            initialColumns={selectedProject.columns}
            onColumnChange={(newColumns) => handleUpdateColumns(newColumns)}
            onUpdateColumns={(newColumns) => handleUpdateColumns(newColumns)}
            account={account}
          >
            <TaskBoard />
          </TaskBoardProvider>
        ) : (
          <Flex flexGrow={1} justifyContent="center" alignItems="center">
            <div>No projects selected, please create or select a project.</div>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default MainLayout;

