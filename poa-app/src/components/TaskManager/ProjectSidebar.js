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
  Icon,
  Divider,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Tooltip,
  IconButton,
  Collapse,
} from '@chakra-ui/react';
import { useWeb3Context } from '../../context/web3Context';
import { useDataBaseContext } from '@/context/dataBaseContext';
import DraggableProject from './DraggableProject';
import TrashBin from './TrashBin';
import { usePOContext } from '@/context/POContext';
import { AddIcon, SearchIcon, ChevronLeftIcon } from '@chakra-ui/icons';

const glassLayerStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  zIndex: -1,
  borderRadius: 'inherit',
  backdropFilter: 'blur(15px)',
  backgroundColor: 'rgba(0, 0, 0, .85)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
};

const ProjectSidebar = ({ projects, selectedProject, onSelectProject, onCreateProject, onToggleSidebar }) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProjects, setShowProjects] = useState(true);
  let hasExecNFT = true;
  const { deleteProject: handleDeleteProject } = useWeb3Context();
  
  const { taskManagerContractAddress } = usePOContext();
  
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
  
  const onDeleteProject = (projectName) => {
    if (hasExecNFT) {
      handleDeleteProject(taskManagerContractAddress, projectName);
    } else {
      alert('You must be an executive to delete project');
    }
  };

  // Filter projects based on search term
  const filteredProjects = searchTerm 
    ? projects.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : projects;

  return (
    <Box
      w="220px"
      marginRight={0}
      display="flex"
      flexDirection="column"
      bg="transparent"
      position="relative"
      zIndex={1}
      h="calc(100vh - 80px)"
      overflowY="auto"
      overflowX="hidden"
      borderRight="1px solid rgba(255, 255, 255, 0.08)"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '24px',
        },
      }}
      transition="width 0.3s ease, transform 0.3s ease"
    >
      <div className="glass" style={glassLayerStyle} />
      
      {/* Header with gradient effect */}
      <Flex 
        direction="column" 
        align="center" 
        pt={5} 
        pb={3} 
        background="linear-gradient(180deg, rgba(41, 65, 171, 0.4) 0%, rgba(0, 0, 0, 0) 100%)"
      >
        <Flex 
          width="95%" 
          align="center" 
          justify="space-between"
          mb={2}
        >
          <Heading 
            textAlign="left" 
            fontSize="22px"
            color="white" 
            letterSpacing="wider"
            fontWeight="bold"
            textTransform="uppercase"
            textShadow="0 0 10px rgba(100, 149, 237, 0.5)"
            ml="10"
          >
            Projects
          </Heading>

          {/* Collapse sidebar button */}
          <IconButton
            aria-label="Collapse sidebar"
            icon={<ChevronLeftIcon />}
            size="sm"
            variant="ghost"
            colorScheme="blue"
            onClick={onToggleSidebar}
            title="Collapse sidebar"
          />
        </Flex>
        
        {/* Search input */}
        <InputGroup size="sm" width="95%" mt={1}>
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="whiteAlpha.100"
            border="1px solid rgba(255, 255, 255, 0.15)"
            borderRadius="md"
            color="white"
            _placeholder={{ color: "whiteAlpha.500" }}
            _hover={{ borderColor: "blue.300" }}
            _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
          />
          <InputRightElement pointerEvents="none">
            <SearchIcon color="whiteAlpha.500" />
          </InputRightElement>
        </InputGroup>
      </Flex>
      
      <Divider borderColor="whiteAlpha.200" />
      
      {/* Projects list with improved spacing */}
      <Box flexGrow={1} overflowY="auto" p={3}>
        <VStack spacing={3} width="100%" align="center">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
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
            })
          ) : searchTerm ? (
            <Text color="whiteAlpha.600" fontSize="sm" pt={4}>
              No projects match your search
            </Text>
          ) : (
            <Text color="whiteAlpha.600" fontSize="sm" pt={4}>
              No projects available
            </Text>
          )}
        </VStack>
      </Box>
      
      <Divider borderColor="whiteAlpha.200" mt={2} />
      
      {/* Trash bin section */}
      <Box mt={2} mb={2}>
        <TrashBin onDeleteProject={onDeleteProject} />
      </Box>
      
      {/* Create project section */}
      <Flex direction="column" p={3} bg="whiteAlpha.050">
        {showInput && (
          <FormControl>
            <Input
              color="white"
              placeholder="New project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              bg="whiteAlpha.100"
              border="1px solid rgba(255, 255, 255, 0.15)"
              borderRadius="md"
              _hover={{ borderColor: "blue.300" }}
              _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
              mb={2}
            />
          </FormControl>
        )}
        <Button
          onClick={showInput ? handleCreateProject : () => setShowInput(true)}
          disabled={showInput && !newProjectName.trim()}
          width="100%"
          size="md"
          colorScheme="blue"
          variant="solid"
          _hover={{ 
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(45, 134, 255, 0.4)"
          }}
          leftIcon={<AddIcon />}
          transition="all 0.2s ease"
        >
          {showInput ? 'Save Project' : 'Create Project'}
        </Button>
      </Flex>
    </Box>
  );
};

export default ProjectSidebar;
