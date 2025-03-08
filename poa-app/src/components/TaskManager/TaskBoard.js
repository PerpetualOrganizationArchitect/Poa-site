import { useEffect, useState } from 'react';
import { Flex, Box, VStack, Text, useBreakpointValue, IconButton, Heading, HStack, Tooltip, Badge, Progress, useToast, Button } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTaskBoard } from '../../context/TaskBoardContext';
import TaskColumn from './TaskColumn';
import { ChevronLeftIcon, ChevronRightIcon, InfoIcon, AddIcon } from '@chakra-ui/icons';

const glassLayerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '3xl',
  backdropFilter: 'blur(20px)',
  backgroundColor: 'rgba(0, 0, 0, .3)',
};

// Enhanced glass style for mobile
const mobileGlassStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '16px',
  backdropFilter: 'blur(15px)',
  backgroundColor: 'rgba(0, 0, 0, .5)',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
};

// Column names with descriptions for tooltips
const columnInfo = {
  'Open': 'Tasks awaiting someone to claim them',
  'In Progress': 'Tasks currently being worked on',
  'Review': 'Tasks awaiting review by team members',
  'Completed': 'Tasks that have been completed and rewards issued'
};

// Fun empty state messages for columns
const emptyStateMessages = {
  'Open': 'No open tasks yet! Create one with the + button.',
  'In Progress': 'Nobody is working on anything yet. Claim a task from "Open"!',
  'Review': 'Nothing to review yet. Tasks will appear here when ready for approval.',
  'Completed': 'No completed tasks yet. Keep up the good work!'
};

const TaskBoard = ({ columns, projectName }) => {
  const { taskColumns, setTaskColumns } = useTaskBoard();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [showColumnGuide, setShowColumnGuide] = useState(true);
  const toast = useToast();
  
  // Track column navigation for UX guidance
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    setTaskColumns(columns);
  }, [columns, setTaskColumns]);

  // Function to navigate between columns on mobile
  const handleNavigate = (direction) => {
    if (direction === 'next' && activeTabIndex < taskColumns.length - 1) {
      setActiveTabIndex(activeTabIndex + 1);
      setHasNavigated(true);
    } else if (direction === 'prev' && activeTabIndex > 0) {
      setActiveTabIndex(activeTabIndex - 1);
      setHasNavigated(true);
    }
  };
  
  // Helper to count tasks in a column
  const getTaskCount = (columnId) => {
    const column = taskColumns?.find(col => col.id === columnId);
    return column?.tasks?.length || 0;
  };

  // Mobile swipe column display with enhanced UX
  const renderMobileView = () => {
    const currentColumn = taskColumns && taskColumns[activeTabIndex];
    const columnId = currentColumn?.id;
    const totalTasks = taskColumns?.reduce((count, column) => count + column.tasks.length, 0) || 0;
    const hasNoTasks = totalTasks === 0;
    
    return (
      <>
        {/* Enhanced column navigation bar */}
        <Box 
          w="100%" 
          mb={4}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="0 2px 10px rgba(0, 0, 0, 0.3)"
        >
          {/* Column header with info */}
          <Flex 
            justify="space-between" 
            align="center" 
            w="100%" 
            bg="rgba(0, 0, 0, 0.7)"
            p={3.5}
            borderBottom="1px solid rgba(255,255,255,0.1)"
          >
            <IconButton
              icon={<ChevronLeftIcon boxSize={5} />}
              aria-label="Previous column"
              onClick={() => handleNavigate('prev')}
              isDisabled={activeTabIndex === 0}
              variant="ghost"
              color="white"
              _hover={{ bg: "rgba(255,255,255,0.1)" }}
              size="sm"
            />
            
            <Flex 
              direction="column" 
              alignItems="center"
              flex={1}
            >
              <Heading 
                size="md" 
                color="white" 
                textAlign="center" 
                textShadow="0 1px 2px rgba(0,0,0,0.5)"
                letterSpacing="wide"
              >
                {currentColumn?.title}
                <Tooltip 
                  label={columnInfo[currentColumn?.title] || 'Tasks in this stage'} 
                  placement="top"
                >
                  <InfoIcon boxSize={3.5} ml={1.5} mb={1} color="purple.200" />
                </Tooltip>
              </Heading>
              
              <HStack spacing={1} mt={1}>
                {taskColumns?.map((column, index) => (
                  <Box 
                    key={index}
                    w={`${100 / taskColumns.length}%`}
                    maxW="50px"
                    onClick={() => setActiveTabIndex(index)}
                    cursor="pointer"
                  >
                    <Box 
                      h="3px" 
                      bg={index === activeTabIndex ? "purple.400" : "whiteAlpha.300"}
                      borderRadius="full"
                    />
                  </Box>
                ))}
              </HStack>
            </Flex>
            
            <IconButton
              icon={<ChevronRightIcon boxSize={5} />}
              aria-label="Next column"
              onClick={() => handleNavigate('next')}
              isDisabled={!taskColumns || activeTabIndex === taskColumns.length - 1}
              variant="ghost"
              color="white"
              _hover={{ bg: "rgba(255,255,255,0.1)" }}
              size="sm"
            />
          </Flex>
          
          {/* Column progress indicator */}
          <Flex 
            bg="rgba(0, 0, 0, 0.5)" 
            p={2.5} 
            justify="space-between"
            align="center"
          >
            <HStack spacing={2}>
              <Badge 
                colorScheme="purple" 
                fontSize="xs" 
                borderRadius="full" 
                px={2} 
                py={0.5}
              >
                {currentColumn?.tasks?.length || 0} task{currentColumn?.tasks?.length !== 1 ? 's' : ''}
              </Badge>
              
              <Text color="white" fontSize="xs">
                {activeTabIndex + 1} of {taskColumns?.length} columns
              </Text>
            </HStack>
            
            {columnId === 'open' && (
              <Tooltip label="Add a new task" placement="top">
                <IconButton
                  icon={<AddIcon />}
                  aria-label="Add task"
                  size="xs"
                  bg="purple.400"
                  color="white"
                  onClick={() => {
                    // This will be handled by the column component
                    // Just providing visual affordance here
                    toast({
                      title: "Add New Task",
                      description: "Create a new task for this project",
                      status: "info",
                      duration: 2000,
                      isClosable: true,
                    });
                  }}
                  borderRadius="full"
                />
              </Tooltip>
            )}
          </Flex>
        </Box>
        
        {/* Main column content with tasks */}
        <Box
          flex="1"
          mx={0}
          p={3}
          borderRadius="xl"
          position="relative"
          style={mobileGlassStyle}
          h="calc(100vh - 220px)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
        >
          {/* Empty state guidance */}
          {currentColumn?.tasks?.length === 0 && (
            <Flex 
              direction="column" 
              justify="center" 
              align="center" 
              h="100%" 
              color="whiteAlpha.700"
              textAlign="center"
              px={4}
            >
              <Box 
                p={3} 
                borderRadius="full" 
                bg="whiteAlpha.200" 
                mb={3}
              >
                {columnId === 'open' ? <AddIcon boxSize={6} /> : <InfoIcon boxSize={6} />}
              </Box>
              <Text fontWeight="bold" fontSize="md" mb={2} color="white">
                {currentColumn?.title} Tasks
              </Text>
              <Text fontSize="sm">
                {emptyStateMessages[currentColumn?.title] || 'No tasks in this column yet.'}
              </Text>
              
              {columnId === 'open' && (
                <Button 
                  mt={5} 
                  colorScheme="purple" 
                  size="sm"
                  onClick={() => {
                    // Open add task modal through TaskColumn
                    document.getElementById('mobileAddTaskBtn')?.click();
                  }}
                >
                  Create First Task
                </Button>
              )}
            </Flex>
          )}
          
          {taskColumns && taskColumns[activeTabIndex] && (
            <TaskColumn
              title={taskColumns[activeTabIndex].title}
              tasks={taskColumns[activeTabIndex].tasks}
              columnId={taskColumns[activeTabIndex].id}
              projectName={projectName}
              zIndex={1}
              isMobile={true}
              isEmpty={taskColumns[activeTabIndex].tasks.length === 0}
            />
          )}
        </Box>

        {/* First-time user guidance - will auto-hide after interacting */}
        {showColumnGuide && !hasNavigated && taskColumns?.length > 1 && (
          <Box 
            position="absolute" 
            bottom="20px" 
            left="50%" 
            transform="translateX(-50%)"
            bg="rgba(0,0,0,0.8)"
            color="white"
            p={3}
            borderRadius="lg"
            boxShadow="0 4px 15px rgba(0,0,0,0.3)"
            maxW="90%"
            zIndex={10}
            onClick={() => setShowColumnGuide(false)}
          >
            <Text fontSize="sm" textAlign="center">
              <span role="img" aria-label="hand-swipe">👆</span> Swipe between columns to see all tasks
            </Text>
          </Box>
        )}
      </>
    );
  };

  // Desktop column view (unchanged)
  const renderDesktopView = () => {
    return (
      <Flex
        direction="row"
        justifyContent="space-between"
        w="100%"
        overflowX="hidden"
        overflowY="hidden"
        minHeight={`calc(100vh - 148px)`}
        wrap="nowrap"
        mt={0}
      >
        {taskColumns &&
          taskColumns.map((column) => (
            <Box
              key={column.id}
              flex="1 1 100%"
              mx={0.5}
              p={2}
              borderRadius="xl"
              position="relative"
              sx={glassLayerStyle}
            >
              <TaskColumn
                title={column.title}
                tasks={column.tasks}
                columnId={column.id}
                projectName={projectName}
                zIndex={1}
                isMobile={false}
              />
            </Box>
          ))}
      </Flex>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <VStack w="100%" align="stretch">
        <Box bg="purple.300" w="100%" p={2}>
          <Text ml={5} fontSize="2xl" fontWeight="bold" color="black">{projectName}</Text>
        </Box>
        
        {/* Conditional rendering based on screen size */}
        {isMobile ? renderMobileView() : renderDesktopView()}
      </VStack>
    </DndProvider>
  );
};

export default TaskBoard;
