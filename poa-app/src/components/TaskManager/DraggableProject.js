import React from 'react';
import { Button, Text } from '@chakra-ui/react';
import { useDrag } from 'react-dnd';

const DraggableProject = ({ project, isSelected, onSelectProject, onDeleteProject }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'project',
    item: { id: project.id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDeleteProject(item.id);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const opacity = isDragging ? 0.4 : 1;
  return (
    <Button
      width="90%"
      mx="5%"
      ref={drag}
      onClick={() => onSelectProject(project.id)}
      bg={isSelected ? 'purple.300' : 'ghostwhite'}
      style={{ opacity }}
      _hover={{ bg: "#2d86fff7", boxShadow: "md", transform: "scale(1.05)"}}
    >
      <Text fontWeight="900">
      {project.name}
      </Text>
    </Button>
  );
};

export default DraggableProject;
