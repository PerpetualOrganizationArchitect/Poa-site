import { useEffect, useState, useRef } from 'react';
import { Flex, Box, VStack, Text, useBreakpointValue, IconButton, Heading, HStack, Tooltip, Badge, Progress, useToast, Button, SimpleGrid } from '@chakra-ui/react';
import { useTaskBoard } from '../../context/TaskBoardContext';
import TaskColumn from './TaskColumn';
import { ChevronLeftIcon, ChevronRightIcon, InfoIcon, AddIcon } from '@chakra-ui/icons';
import { FaProjectDiagram } from 'react-icons/fa';

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

// Darker glass style for column navigation in mobile
const mobileNavGlassStyle = {
  backdropFilter: 'blur(20px)',
  backgroundColor: 'rgba(0, 0, 0, .7)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
};

// Darker style for info popup
const infoPopupStyle = {
  backgroundColor: 'rgba(255, 255, 255, 1)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
  border: '1px solid rgba(105, 57, 153, 0.4)',
  borderRadius: '12px',
  padding: '12px',
  maxWidth: '80%',
  textAlign: 'center',
  zIndex: 20,
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
  'Open': 'Looks like a blank canvas! Create a task and start building something amazing.',
  'In Progress': 'No tasks in the works yet. Claim one from "Open" to show your skills!',
  'Review': 'Nothing to review at the moment. Good work happens before great feedback!',
  'Completed': 'The finish line is waiting for your first completed task. Keep pushing!'
};

// Empty state illustrations/icons for each column type
const emptyStateIcons = {
  'Open': '🚀',
  'In Progress': '⚙️',
  'Review': '🔍',
  'Completed': '🏆'
};

// Empty state component for mobile view
const EmptyColumnState = ({ columnType }) => (
  <Box 
    width="100%"
    height="auto"
    minHeight="200px"
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    justifyContent="center"
    p={4}
    textAlign="center"
    bg="whiteAlpha.100"
    borderRadius="md"
    border="1px dashed rgba(255,255,255,0.2)"
    m="0 auto"
    mx="auto"
    mb={4}
  >
    <Text fontSize="3xl" mb={2}>
      {emptyStateIcons[columnType] || '✨'}
    </Text>
    <Text color="white" fontWeight="medium" fontSize="sm" mb={2}>
      {columnType}
    </Text>
    <Text color="whiteAlpha.700" fontSize="xs">
      {emptyStateMessages[columnType] || 'Drag tasks here to populate this column.'}
    </Text>
  </Box>
);

const TaskBoard = ({ columns, projectName, hideTitleBar, sidebarVisible, toggleSidebar, isDesktop }) => {
  const { taskColumns, setTaskColumns } = useTaskBoard();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const toast = useToast();
  
  // Touch handling variables for improved swipe detection
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const swipeContainerRef = useRef(null);
  const [isSwiping, setIsSwiping] = useState(false);
  
  // Higher threshold for swipe detection to prevent accidental triggers
  const SWIPE_THRESHOLD = 50;
  const SCROLL_TOLERANCE = 30;

  // Track if user has seen the swipe guide - store in localStorage
  const [hasSeenSwipeGuide, setHasSeenSwipeGuide] = useState(() => {
    // Check localStorage on component mount
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasSeenSwipeGuide') === 'true';
    }
    return false;
  });
  
  // Initialize the guide visibility based on localStorage and random chance (1 in 25)
  const [showSwipeGuide, setShowSwipeGuide] = useState(() => {
    // Always show for new users
    if (!hasSeenSwipeGuide) return true;
    
    // For users who have seen it, show randomly 1 out of 25 times (4% chance)
    const randomChance = Math.floor(Math.random() * 25) === 0;
    return randomChance;
  });
  
  // Hide guide after timeout and save to localStorage
  useEffect(() => {
    if (showSwipeGuide) {
      const timer = setTimeout(() => {
        setShowSwipeGuide(false);
        // Only update localStorage if they've never seen it before
        if (!hasSeenSwipeGuide) {
          setHasSeenSwipeGuide(true);
          if (typeof window !== 'undefined') {
            localStorage.setItem('hasSeenSwipeGuide', 'true');
          }
        }
      }, 8500);
      
      return () => clearTimeout(timer);
    }
  }, [showSwipeGuide, hasSeenSwipeGuide]);
  
  // Hide the guide when user navigates
  const handleUserNavigated = () => {
    if (showSwipeGuide) {
      setShowSwipeGuide(false);
      
      // Only update localStorage if they've never seen it before
      if (!hasSeenSwipeGuide) {
        setHasSeenSwipeGuide(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('hasSeenSwipeGuide', 'true');
        }
      }
    }
  };

  useEffect(() => {
    setTaskColumns(columns);
  }, [columns, setTaskColumns]);

  // Handle direct navigation with active tab state
  const handleNavigate = (direction) => {
    if (direction === 'next' && activeTabIndex < taskColumns.length - 1) {
      setActiveTabIndex(activeTabIndex + 1);
      handleUserNavigated();
    } else if (direction === 'prev' && activeTabIndex > 0) {
      setActiveTabIndex(activeTabIndex - 1);
      handleUserNavigated();
    }
  };

  // Make sure columns update when active tab changes
  useEffect(() => {
    if (taskColumns && taskColumns.length > 0) {
      // Ensure active tab is within bounds
      if (activeTabIndex >= taskColumns.length) {
        setActiveTabIndex(taskColumns.length - 1);
      }
    }
  }, [taskColumns]);

  const getTaskCount = (columnId) => {
    const column = taskColumns?.find(col => col.id === columnId);
    return column?.tasks?.length || 0;
  };

  // Touch handlers for swipe navigation
  const handleTouchStart = (e) => {
    // Store the initial touch position for both X and Y
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsSwiping(false);
  };

  const handleTouchMove = (e) => {
    if (!touchStartX.current || !touchStartY.current) return;

    // Calculate both horizontal and vertical movement
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    const diffX = touchStartX.current - touchX;
    const diffY = Math.abs(touchStartY.current - touchY);
    
    // Only consider horizontal swipes if vertical movement is minimal
    // This prevents triggering swipes during vertical scrolling
    if (Math.abs(diffX) > 15 && diffY < SCROLL_TOLERANCE) {
      setIsSwiping(true);
      
      // Prevent default only if we're clearly doing a horizontal swipe
      // This allows normal scrolling behavior otherwise
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current || !touchStartY.current || !isSwiping) {
      // Reset touch tracking
      touchStartX.current = null;
      touchStartY.current = null;
      setIsSwiping(false);
      return;
    }
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = Math.abs(touchStartY.current - touchEndY);
    
    // If vertical movement is significant compared to horizontal, treat as scroll not swipe
    if (diffY > SCROLL_TOLERANCE) {
      // Reset touch tracking
      touchStartX.current = null;
      touchStartY.current = null;
      setIsSwiping(false);
      return;
    }
    
    // Process swipes with a higher threshold
    if (Math.abs(diffX) > SWIPE_THRESHOLD) {
      if (diffX > 0 && activeTabIndex < taskColumns.length - 1) {
        // Swiped left, go to next
        setActiveTabIndex(activeTabIndex + 1);
        handleUserNavigated();
      } else if (diffX < 0 && activeTabIndex > 0) {
        // Swiped right, go to previous
        setActiveTabIndex(activeTabIndex - 1);
        handleUserNavigated();
      }
    }
    
    // Reset touch tracking
    touchStartX.current = null;
    touchStartY.current = null;
    setIsSwiping(false);
  };

  // Render mobile view with swipe navigation
  const renderMobileView = () => {
    const currentColumn = taskColumns && taskColumns[activeTabIndex];
    const columnTitle = currentColumn?.title || '';
    const columnId = currentColumn?.id || '';
    const hasNoTasks = currentColumn?.tasks?.length === 0;

    return (
      <Box
        w="100%"
        h="100%"
        position="relative"
        ref={swipeContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        <VStack 
          spacing={0} 
          align="stretch" 
          w="100%"
          h="100%"
        >
          <Box 
            sx={mobileNavGlassStyle}
            mx={2}
            mb={2}
            mt={1}
            overflow="hidden"
          >
            <HStack spacing={3} py={2} px={3} w="100%" align="center" justify="space-between">
              <IconButton
                icon={<ChevronLeftIcon />}
                onClick={() => handleNavigate('prev')}
                isDisabled={activeTabIndex === 0}
                aria-label="Previous column"
                size="sm"
                colorScheme="purple"
                variant="ghost"
              />
              
              <Text 
                fontSize="md" 
                fontWeight="bold" 
                textAlign="center" 
                color="white"
                flex={1}
                noOfLines={1}
              >
                {columnTitle}
                <Badge ml={2} colorScheme="purple" fontSize="0.7em">
                  {getTaskCount(columnId)}
                </Badge>
              </Text>
              
              <IconButton
                icon={<ChevronRightIcon />}
                onClick={() => handleNavigate('next')}
                isDisabled={activeTabIndex === taskColumns?.length - 1}
                aria-label="Next column"
                size="sm"
                colorScheme="purple"
                variant="ghost"
              />
            </HStack>
          </Box>
          
          {/* Progress indicator */}
          <Progress 
            value={(activeTabIndex / (taskColumns.length - 1)) * 100} 
            size="xs" 
            colorScheme="purple" 
            bg="whiteAlpha.100" 
            mt={0}
            mb={1}
            mx={2}
            borderRadius="full"
          />
          
          {/* Mobile column view - taking up all remaining space */}
          <Box 
            px={2} 
            position="relative" 
            flex="1"
            display="flex"
            flexDirection="column"
            h="100%"
            minH="calc(100vh - 200px)"
          >
            <Box
              position="relative"
              zIndex={1}
              borderRadius="md"
              display="flex"
              flexDirection="column"
              flex="1"
              h="100%"
              sx={mobileGlassStyle}
              p={2}
            >
              {hasNoTasks ? (
                <Flex direction="column" h="100%" align="center" justify="flex-start" pt={4}>
                  <EmptyColumnState columnType={columnTitle} />
                  {/* Invisible touch area that extends to bottom */}
                  <Box flex="1" w="100%" minH="300px" />
                </Flex>
              ) : (
                <TaskColumn
                  title={columnTitle}
                  tasks={currentColumn?.tasks || []}
                  columnId={columnId}
                  projectName={projectName}
                  zIndex={1}
                  isMobile={true}
                  hideTitleInMobile={true}
                />
              )}
            </Box>
          </Box>
        </VStack>
        
        {/* User guidance for navigation - positioned lower and auto-dismissing */}
        {showSwipeGuide && (
          <Box 
            position="absolute" 
            top="60%" 
            left="50%" 
            transform="translate(-50%, -50%)"
            zIndex={10}
            style={infoPopupStyle}
            onClick={handleUserNavigated}
          >
            <InfoIcon color="purple.300" mb={2} boxSize="16px" />
            <Text color="gray.800" fontSize="sm" fontWeight="medium">
              Swipe left or right to navigate between columns
            </Text>
            <Text color="gray.600" fontSize="2xs" mt={1}>
              This message will disappear shortly
            </Text>
          </Box>
        )}
      </Box>
    );
  };

  // Desktop column view
  const renderDesktopView = () => {
    return (
      <Box
        width="100%"
        height="100%"
        pt={4}
        pb={0}
        mt="-2"
      >
        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 4 }}
          spacing={2}
          width="100%"
          height="100%"
        >
          {taskColumns &&
            taskColumns.map((column) => (
              <Box
                key={column.id}
                height={{ base: "auto", md: "80vh" }}
                minH="400px"
                borderRadius="xl"
                position="relative"
                sx={glassLayerStyle}
                display="flex"
                flexDirection="column"
                alignItems="center"
                p={2}
              >
                {column.tasks?.length === 0 ? (
                  <Flex direction="column" h="100%" p={2} w="100%" align="center">
                    <Heading size="md" mb={3} textAlign="center" color="white">
                      {column.title}
                    </Heading>
                    <EmptyColumnState columnType={column.title} />
                    <Box flex="1" w="100%" minH="200px" /> 
                  </Flex>
                ) : (
                  <TaskColumn
                    title={column.title}
                    tasks={column.tasks}
                    columnId={column.id}
                    projectName={projectName}
                    zIndex={1}
                    isMobile={false}
                  />
                )}
              </Box>
            ))}
        </SimpleGrid>
      </Box>
    );
  };

  return (
    <VStack w="100%" align="stretch" h="100%" spacing={0}>
      {/* Project title header bar - only show in desktop view */}
      {isDesktop && (
        <Box 
          bg="purple.300" 
          w="100%" 
          p={2}
          height="auto"
        >
          <Flex align="center" justify="space-between" h="100%">
            <Flex align="center" h="100%">
              {!sidebarVisible && (
                <Tooltip label="Show projects sidebar" placement="right" hasArrow>
                  <IconButton
                    aria-label="Show projects sidebar"
                    icon={<FaProjectDiagram size="16px" />}
                    size="sm"
                    variant="ghost"
                    colorScheme="blackAlpha"
                    mr={2}
                    onClick={toggleSidebar}
                    _hover={{ 
                      bg: "blackAlpha.200",
                      transform: "scale(1.1)"
                    }}
                    transition="all 0.2s"
                  />
                </Tooltip>
              )}
              <Text 
                fontSize="2xl"
                fontWeight="bold" 
                color="black"
                lineHeight="normal"
              >
                {projectName}
              </Text>
            </Flex>
          </Flex>
        </Box>
      )}
      
      <Box 
        flex="1" 
        width="100%"
        height={{ base: "auto", md: "calc(100vh - 120px)" }}
        overflow={{ base: "visible", md: "hidden" }}
      >
        {isMobile ? renderMobileView() : renderDesktopView()}
      </Box>
    </VStack>
  );
};

export default TaskBoard;
