import React, { useState, useEffect } from 'react';
import { Flex, Box, Heading, useBreakpointValue, Select, Text, Button, VStack, HStack, IconButton, useDisclosure, Input, FormControl, FormLabel, Tooltip, Badge } from '@chakra-ui/react';
import { AddIcon, InfoIcon, ChevronDownIcon } from '@chakra-ui/icons';
import ProjectSidebar from './ProjectSidebar';
import TaskBoard from './TaskBoard';
import { TaskBoardProvider } from '../../context/TaskBoardContext';
import { useDataBaseContext} from '../../context/dataBaseContext';
import { useWeb3Context } from '../../context/web3Context';
import { usePOContext } from '@/context/POContext';
import { useRouter } from 'next/router';

// Enhanced styles for mobile project selector
const mobileHeaderStyle = {
  background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(20,20,20,0.75) 100%)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  padding: '12px 16px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  marginBottom: '16px',
};

const MainLayout = () => {
  const {
    projects,
    selectedProject,
    setSelectedProject,
    handleUpdateColumns,
  } = useDataBaseContext();

  const {account, createProject}= useWeb3Context();
  const {taskManagerContractAddress} = usePOContext();
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [showMobileProjectCreator, setShowMobileProjectCreator] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showHelp, setShowHelp] = useState(true);

  const handleSelectProject = (projectId) => {
     // Decode first to handle any prior encoding, then encode properly
     const safeProjectId = encodeURIComponent(decodeURIComponent(projectId));

    router.push(`/tasks?projectId=${safeProjectId}&userDAO=${router.query.userDAO}`);
    console.log("selecting project",projectId);
    const selected = projects.find((project) => project.id === projectId);
    setSelectedProject(selected);
    console.log('selected', selected);
  };

  const handleCreateNewProject = () => {
    if (newProjectName.trim()) {
      createProject(taskManagerContractAddress, newProjectName.trim());
      setNewProjectName('');
      setShowMobileProjectCreator(false);
      setShowHelp(false);
    }
  };

  // Mobile project selection via dropdown with enhanced UX
  const renderMobileProjectSelector = () => {
    const hasProjects = projects && projects.length > 0;
    
    return (
      <Box w="100%" mb={4}>
        <VStack spacing={3} align="stretch">
          {/* Project Selection Header */}
          <Box style={mobileHeaderStyle}>
            <Flex justify="space-between" align="center" mb={hasProjects ? 2 : 0}>
              <Heading 
                size="md" 
                color="white" 
                fontWeight="600"
                letterSpacing="wide"
              >
                {hasProjects ? 'Select Project' : 'Create Your First Project'}
              </Heading>

              {hasProjects && (
                <Tooltip label="Create a new project">
                  <IconButton
                    size="sm"
                    icon={<AddIcon />}
                    colorScheme="purple"
                    variant="ghost"
                    onClick={() => setShowMobileProjectCreator(prev => !prev)}
                    aria-label="Create new project"
                  />
                </Tooltip>
              )}
            </Flex>

            {hasProjects && !showMobileProjectCreator && (
              <Flex 
                bg="whiteAlpha.100" 
                p={2.5} 
                borderRadius="md" 
                align="center"
                border="1px solid rgba(255,255,255,0.1)"
                onClick={onOpen}
                cursor="pointer"
                _hover={{ bg: "whiteAlpha.200" }}
              >
                <Text color="white" fontWeight="medium" flex={1} noOfLines={1}>
                  {selectedProject?.name || "Select a project"}
                </Text>
                <ChevronDownIcon color="white" ml={2} />
              </Flex>
            )}

            {showMobileProjectCreator && (
              <VStack spacing={3} align="stretch" mt={2}>
                <FormControl>
                  <FormLabel fontSize="sm" color="whiteAlpha.800" mb={1}>Project Name</FormLabel>
                  <Input
                    placeholder="Enter project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    bg="whiteAlpha.100"
                    color="white"
                    size="md"
                    _focus={{ borderColor: "purple.300" }}
                  />
                </FormControl>
                
                <HStack spacing={2}>
                  <Button 
                    colorScheme="purple" 
                    flex={1}
                    isDisabled={!newProjectName.trim()}
                    onClick={handleCreateNewProject}
                    size="sm"
                  >
                    Create Project
                  </Button>
                  <Button 
                    variant="outline" 
                    colorScheme="whiteAlpha" 
                    onClick={() => {
                      setShowMobileProjectCreator(false);
                      setNewProjectName('');
                    }}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </HStack>
              </VStack>
            )}
            
            {!hasProjects && !showMobileProjectCreator && (
              <VStack spacing={3} align="center" mt={4} mb={2}>
                <Text fontSize="sm" color="whiteAlpha.700" textAlign="center">
                  You haven't created any projects yet. Create your first project to get started with tasks.
                </Text>
                <Button
                  colorScheme="purple"
                  leftIcon={<AddIcon />}
                  onClick={() => setShowMobileProjectCreator(true)}
                >
                  Create First Project
                </Button>
              </VStack>
            )}
          </Box>

          {/* First-time user help */}
          {hasProjects && selectedProject && showHelp && (
            <Box 
              bg="rgba(0,0,0,0.7)" 
              p={3} 
              borderRadius="md"
              border="1px solid rgba(255,255,255,0.1)"
              onClick={() => setShowHelp(false)}
            >
              <Flex align="center" mb={1}>
                <InfoIcon color="purple.300" mr={2} />
                <Text color="white" fontWeight="bold" fontSize="sm">Quick Guide</Text>
              </Flex>
              <Text color="whiteAlpha.800" fontSize="xs">
                • Each project has different task columns (Open, In Progress, etc.)<br />
                • Swipe between columns to see all tasks<br />
                • Tap a task to see details or drag tasks between columns
              </Text>
              <Text color="whiteAlpha.600" fontSize="2xs" mt={2} textAlign="center">
                (Tap to dismiss)
              </Text>
            </Box>
          )}
          
          {/* Project selection modal */}
          {isOpen && (
            <Box 
              position="fixed" 
              top="0" 
              left="0" 
              w="100%" 
              h="100%" 
              bg="rgba(0,0,0,0.7)" 
              zIndex={100}
              p={4}
              onClick={onClose}
            >
              <Box
                maxW="90%"
                maxH="80vh"
                mx="auto"
                mt="15vh"
                bg="rgba(30,30,40,0.95)"
                borderRadius="lg"
                p={4}
                boxShadow="0 10px 30px rgba(0,0,0,0.4)"
                border="1px solid rgba(255,255,255,0.1)"
                onClick={(e) => e.stopPropagation()}
                overflowY="auto"
              >
                <Heading size="md" color="white" mb={4} textAlign="center">
                  Select Project
                </Heading>
                
                <VStack spacing={2} align="stretch">
                  {projects.map(project => (
                    <Box
                      key={project.id}
                      bg={selectedProject?.id === project.id ? "purple.800" : "whiteAlpha.100"}
                      p={3}
                      borderRadius="md"
                      onClick={() => {
                        handleSelectProject(project.id);
                        onClose();
                      }}
                      _hover={{ bg: "whiteAlpha.200" }}
                      cursor="pointer"
                    >
                      <Flex align="center" justify="space-between">
                        <Text color="white" fontWeight="medium">
                          {project.name}
                        </Text>
                        {selectedProject?.id === project.id && (
                          <Badge colorScheme="purple">Current</Badge>
                        )}
                      </Flex>
                      <Text color="whiteAlpha.700" fontSize="xs" mt={1}>
                        {project.columns.reduce((sum, col) => sum + col.tasks.length, 0)} tasks
                      </Text>
                    </Box>
                  ))}
                </VStack>
                
                <Button 
                  mt={4} 
                  w="100%" 
                  colorScheme="purple" 
                  variant="outline"
                  onClick={() => {
                    setShowMobileProjectCreator(true);
                    onClose();
                  }}
                >
                  + Create New Project
                </Button>
                
                <Button 
                  mt={2} 
                  w="100%" 
                  variant="ghost" 
                  color="white"
                  onClick={onClose}
                >
                  Close
                </Button>
              </Box>
            </Box>
          )}
        </VStack>
      </Box>
    );
  };

  return (
    <Flex minHeight={`calc(100vh - 80px)`} direction="column" pt={{ base: "60px", md: "70px" }}>
      {/* Only show the sidebar on desktop */}
      {!isMobile && (
        <ProjectSidebar
          projects={projects}
          selectedProject={selectedProject}
          onSelectProject={handleSelectProject}
          onCreateProject={(projectName) => createProject(taskManagerContractAddress, projectName)}
        />
      )}
      
      {/* Show mobile project selector on mobile */}
      {isMobile && renderMobileProjectSelector()}
      
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
      ) : projects.length > 0 ? (
        <Flex 
          flexGrow={1} 
          justifyContent="center" 
          alignItems="center"
          p={4}
          bg="rgba(0, 0, 0, 0.4)"
          borderRadius="md"
          mx={4}
        >
          <Text color="white" textAlign="center">
            Please select a project to view and manage tasks.
          </Text>
        </Flex>
      ) : null}
    </Flex>
  );
};

export default MainLayout;

