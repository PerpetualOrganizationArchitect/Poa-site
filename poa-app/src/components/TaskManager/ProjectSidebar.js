import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Button,
  Input,
  FormControl,
  Spacer,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useWeb3Context } from '../../context/Web3Context';
import { useDataBaseContext } from '@/context/dataBaseContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableProject from './DraggableProject';
import TrashBin from './TrashBin';






const glassLayerStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  zIndex: -1,
  borderRadius: 'inherit',
  backdropFilter: 'blur(50px)',
  backgroundColor: 'rgba(0, 0, 0, .8)',
};

const ProjectSidebar = ({ projects,selectedProject, onSelectProject, onCreateProject }) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const { hasExecNFT} = useWeb3Context();
  const { handleDeleteProject } = useDataBaseContext();


  
  const handleCreateProject = () => {
    
      if (hasExecNFT) {
        onCreateProject(newProjectName);
        setNewProjectName('');
        setShowInput(false);
      } else {
         alert('You must be an executive to create project');
         setNewProjectName('');
         setShowInput(false);
      }

  };
  const onDeleteProject = (projectId) => {
    if(hasExecNFT){
      handleDeleteProject(projectId);
    }
    else{
      alert('You must be an executive to delete project');
    }

  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        w="300px"
        marginRight={1}

        display="flex"
        flexDirection="column"
        bg="transparent" // Set the background to transparent
        boxShadow="lg"
        position="relative" // Add position: 'relative'
        zIndex={1}
      >
        <div className="glass" style={glassLayerStyle} />
      <Heading size="md" mb={4} color="white" mt={3}ml="7%">
        Projects
        </Heading>
      <Box flexGrow={1} overflowY="auto" pl={1} pr={1}>
      
        <VStack spacing={4} width="100%" align="center">
          {projects.map((project) => {
            const isSelected = selectedProject && project.id === selectedProject.id;

            return (
              <DraggableProject
                key={project.id}
                project={project}
                isSelected={isSelected}
                onSelectProject={onSelectProject}
                onDeleteProject={onDeleteProject}
              />
            );
          })}
        </VStack>

      </Box>
      
      <Spacer />
      <TrashBin onDeleteProject={onDeleteProject} />
      <Flex direction="column" mt={4}>
        {showInput && (
          <FormControl>
            <Input
              color="white"
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
          </FormControl>
        )}
        <Button
          mt={2}
          onClick={showInput ? handleCreateProject : () => setShowInput(true)}
          disabled={showInput && !newProjectName.trim()}
          ml="5%"
          width="90%" // Set width to 100%
          _hover={{ bg: "#2d86fff7", boxShadow: "md", transform: "scale(1.05)"}}
          mb="4"
          color={'ghostwhite'}
        >
          <Text color="black">
          {showInput ? 'Save Project' : 'Create Project'}
          </Text>
        </Button>
      </Flex>
    </Box>
    </DndProvider>
  );
};

export default ProjectSidebar;
