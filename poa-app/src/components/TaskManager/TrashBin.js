import React from 'react';
import { Box, Text, Flex, Icon, useColorModeValue } from '@chakra-ui/react';
import { useDrop } from 'react-dnd';
import { FaTrashAlt } from 'react-icons/fa';

const TrashBin = ({onDeleteProject}) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'project',
    drop: () => ({ name: 'TrashBin' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;
  
  // Define styles based on interaction state
  const getBgColor = () => {
    if (isActive) return 'rgba(229, 62, 62, 0.4)'; // Red when active
    if (canDrop) return 'rgba(229, 62, 62, 0.2)'; // Lighter red when can drop
    return 'whiteAlpha.50'; // Default
  };
  
  const getIconColor = () => {
    if (isActive) return 'red.300';
    if (canDrop) return 'red.200';
    return 'gray.400';
  };

  return (
    <Box
      ref={drop}
      bg={getBgColor()}
      w="95%"
      mx="auto"
      p={2}
      borderRadius="md"
      borderWidth="1px"
      borderStyle="dashed"
      borderColor={isActive ? "red.400" : canDrop ? "red.300" : "transparent"}
      transition="all 0.2s ease"
      _hover={{ bg: 'rgba(229, 62, 62, 0.15)' }}
    >
      <Flex align="center" justify="center">
        <Icon 
          as={FaTrashAlt} 
          color={getIconColor()} 
          mr={2} 
          boxSize={3.5}
          animation={isActive ? "pulse 1.5s infinite" : "none"}
        />
        <Text 
          align="center" 
          color={isActive ? "red.200" : "gray.400"}
          fontSize="xs"
          fontWeight={isActive ? "medium" : "normal"}
        >
          {isActive 
            ? 'Release to delete' 
            : canDrop 
              ? 'Drop to delete' 
              : 'Drag here to delete'}
        </Text>
      </Flex>
    </Box>
  );
};

export default TrashBin;
