import React from 'react';
import { Box, Text, Icon, Flex, Tooltip } from '@chakra-ui/react';
import { useDrag } from 'react-dnd';
import { FaGripVertical, FaFolder, FaFolderOpen } from 'react-icons/fa';

const DraggableProject = ({ project, isSelected, onSelectProject, onDeleteProject }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'project',
    item: { name: project.name },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDeleteProject(item.name);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const opacity = isDragging ? 0.4 : 1;
  
  return (
    <Box
      ref={drag}
      onClick={() => onSelectProject(project.id)}
      width="100%"
      px={2}
      py={2}
      borderRadius="md"
      bg={isSelected 
        ? 'linear-gradient(135deg, rgba(79, 109, 245, 0.4) 0%, rgba(79, 109, 245, 0.2) 100%)' 
        : 'transparent'}
      border="1px solid"
      borderColor={isSelected ? "blue.400" : "transparent"}
      _hover={{ 
        bg: isSelected 
          ? 'linear-gradient(135deg, rgba(79, 109, 245, 0.5) 0%, rgba(79, 109, 245, 0.3) 100%)' 
          : 'whiteAlpha.100',
        borderColor: isSelected ? "blue.400" : "whiteAlpha.300"
      }}
      transition="all 0.2s ease"
      style={{ opacity }}
      cursor="pointer"
      position="relative"
      overflow="hidden"
    >
      <Flex align="center">
        <Icon 
          as={isSelected ? FaFolderOpen : FaFolder} 
          color={isSelected ? "blue.300" : "gray.400"} 
          mr={1.5} 
          boxSize={3.5}
          flexShrink={0}
        />
        <Tooltip 
          label={project.name} 
          placement="top" 
          openDelay={500}
          hasArrow
          bg="gray.700"
          isDisabled={project.name.length < 20}
        >
          <Text 
            color="white" 
            fontWeight={isSelected ? "bold" : "medium"}
            flex="1"
            isTruncated
            fontSize="sm"
          >
            {project.name}
          </Text>
        </Tooltip>
        
        {/* Drag handle */}
        <Icon 
          as={FaGripVertical} 
          color="whiteAlpha.500" 
          opacity={0.6} 
          boxSize={2.5}
          _hover={{ opacity: 1 }}
          ml={1}
          flexShrink={0}
        />
      </Flex>
      
      {/* Selected indicator line */}
      {isSelected && (
        <Box 
          position="absolute" 
          left={0} 
          top="10%" 
          height="80%" 
          width="3px" 
          bg="blue.400" 
          borderRadius="full"
        />
      )}
    </Box>
  );
};

export default DraggableProject;
