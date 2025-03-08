import React from 'react';
import { Box, useDisclosure, Text, HStack, Badge, Flex, Spacer, useBreakpointValue, Avatar, Tooltip, Icon } from '@chakra-ui/react';
import { useDrag } from 'react-dnd';
import TaskCardModal from './TaskCardModal';
import { useRouter } from 'next/router';
import { TimeIcon, StarIcon, CheckIcon, InfoIcon } from '@chakra-ui/icons';

const TaskCard = ({ id, name, description, difficulty, estHours, index, columnId, submission, claimedBy, claimerUsername, onEditTask, moveTask, projectId, Payout, isMobile }) => {
  const router = useRouter();
  const { userDAO } = router.query;
  const isCardMobile = useBreakpointValue({ base: true, md: false }) || isMobile;

  const openTask = () => {
    const safeProjectId = encodeURIComponent(decodeURIComponent(projectId));
    router.push({
      pathname: `/tasks/`,
      query: { userDAO: userDAO, task: id, projectId: safeProjectId },
    }, undefined, { shallow: true });
  };

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id, index, columnId, name, description, difficulty, estHours, claimedBy, claimerUsername, Payout, submission },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const { isOpen, onOpen, onClose } = useDisclosure();

  const truncateDescription = (desc, maxLength) => {
    if (desc.length > maxLength) {
      return desc.substring(0, maxLength) + '...';
    }
    return desc;
  };

  // Define the color for the difficulty badge
  const difficultyColorScheme = {
    easy: 'green',
    medium: 'yellow',
    hard: 'orange',
    veryhard: 'red'
  };
  
  // Difficulty scores for better visualization
  const difficultyScore = {
    easy: 1,
    medium: 2,
    hard: 3,
    veryhard: 4
  };
  
  // Get user initials for avatars
  const getUserInitials = (username) => {
    if (!username) return "?";
    return username.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Enhanced mobile card style with better visual hierarchy
  const mobileCardStyle = {
    background: 'rgba(255, 255, 255, 0.98)',
    borderRadius: '12px',
    boxShadow: isDragging 
      ? '0 10px 25px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(128, 90, 213, 0.4)' 
      : '0 4px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    padding: '14px',
    marginBottom: '14px',
    transition: 'all 0.25s ease',
    transform: isDragging ? 'scale(0.98) rotate(-1deg)' : 'scale(1) rotate(0)',
    opacity: isDragging ? 0.9 : 1,
    borderLeft: difficulty ? `4px solid ${getDifficultyColor(difficulty)}` : undefined,
  };

  // Desktop card style (with subtle improvements)
  const desktopCardStyle = {
    background: 'ghostwhite',
    borderRadius: 'md',
    boxShadow: 'sm',
    padding: '8px',
    marginBottom: '16px',
    cursor: 'grab',
    opacity: isDragging ? 0.7 : 1,
    transition: 'all 0.2s ease',
    transform: isDragging ? 'rotate(-1deg)' : 'rotate(0)',
    _hover: {
      boxShadow: 'md',
    },
    borderLeft: difficulty ? `3px solid ${getDifficultyColor(difficulty)}` : undefined,
  };

  // Helper for difficulty colors
  function getDifficultyColor(diff) {
    const colorMap = {
      easy: '#68D391', // green.300
      medium: '#F6E05E', // yellow.300
      hard: '#F6AD55', // orange.300
      veryhard: '#FC8181' // red.300
    };
    return colorMap[diff.toLowerCase().replace(" ", "")] || '#CBD5E0';
  }

  // Badge styles with consistent design
  const badgeStyle = {
    fontSize: isCardMobile ? '0.65rem' : '0.6rem',
    fontWeight: 'medium',
    px: isCardMobile ? 2 : 1.5,
    py: isCardMobile ? 1 : 0.5,
    borderRadius: 'full',
    textTransform: 'capitalize'
  };

  // Enhanced card for better readability
  return (
    <>
      <Box
        ref={drag}
        sx={isCardMobile ? mobileCardStyle : desktopCardStyle}
        onClick={openTask}
        role="group"
      >
        {/* Task title with better typography */}
        <Text 
          fontWeight="700" 
          fontSize={isCardMobile ? "0.95rem" : "0.85rem"}
          color="#2D3748" // gray.700
          mb={isCardMobile ? 2 : 1.5}
          noOfLines={2}
          lineHeight="tight"
          letterSpacing="tight"
          _groupHover={{ color: "purple.700" }}
        >
          {name}
        </Text>
        
        {/* Improved description section */}
        <Text 
          fontSize={isCardMobile ? "0.8rem" : "0.75rem"}
          color="#4A5568" // gray.600
          mb={isCardMobile ? 3 : 2}
          noOfLines={2}
          lineHeight="1.4"
        >
          {truncateDescription(description, isCardMobile ? 80 : 50)}
        </Text>
        
        {/* Info and tags with better layout */}
        <Flex direction="column" gap={2}>
          {/* Difficulty and time indicators */}
          <Flex align="center" justify="space-between">
            {difficulty && (
              <Flex align="center">
                <HStack spacing={1}>
                  {[...Array(difficultyScore[difficulty.toLowerCase().replace(" ", "")] || 1)].map((_, i) => (
                    <Box 
                      key={i} 
                      w={1.5} 
                      h={1.5} 
                      borderRadius="full" 
                      bg={getDifficultyColor(difficulty)}
                    />
                  ))}
                </HStack>
                <Text fontSize="xs" color="gray.500" ml={1.5} fontWeight="medium">
                  {difficulty}
                </Text>
              </Flex>
            )}
            
            <HStack spacing={1} align="center">
              <TimeIcon boxSize={3} color="gray.400" />
              <Text fontSize="xs" color="gray.500" fontWeight="medium">
                {estHours} hr{estHours !== 1 ? 's' : ''}
              </Text>
            </HStack>
          </Flex>
          
          {/* Reward and assigned user */}
          <Flex justify="space-between" align="center" mt={1}>
            {Payout && (
              <Tooltip label="Reward for completing this task" placement="top">
                <Flex align="center" bg="purple.50" px={2} py={0.5} borderRadius="full">
                  <StarIcon boxSize={3} mr={1} color="purple.500" />
                  <Text fontWeight="bold" color="purple.700" fontSize="xs">
                    {Payout}
                  </Text>
                </Flex>
              </Tooltip>
            )}
            
            {claimerUsername && (
              <Tooltip label={`Assigned to: ${claimerUsername}`} placement="top">
                <Avatar 
                  size="xs" 
                  name={claimerUsername} 
                  getInitials={getUserInitials}
                  bg="purple.500"
                  color="white"
                />
              </Tooltip>
            )}
            
            {columnId === 'completed' && (
              <Badge colorScheme="green" {...badgeStyle}>
                <CheckIcon mr={1} boxSize={2} />
                Completed
              </Badge>
            )}
          </Flex>
        </Flex>
      </Box>
      
      <TaskCardModal
        isOpen={isOpen}
        onClose={onClose}
        task={{ id, name, description, difficulty, estHours, Payout, submission, claimedBy, claimerUsername, projectId }}
        columnId={columnId}
        onEditTask={onEditTask}
        moveTask={moveTask}
      />
    </>
  );
};

export default TaskCard;
