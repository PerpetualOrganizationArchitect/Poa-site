import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useDrop } from 'react-dnd';

const TrashBin = ({}) => {
  const [{ canDrop }, drop] = useDrop(() => ({
    accept: 'project',
    drop: () => ({ name: 'TrashBin' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop;
  const backgroundColor = isActive ? 'red.500' : "transparent";

  return (
    <Box
      ref={drop}
      bg={backgroundColor}
      w="90%"
      ml="5%"
      h="50px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="md"
    >
      
      <Text  color="lightgray">
      {isActive ? 'Release here to delete' : 'Drag a project here to delete'}
      </Text>
    </Box>
  );
};

export default TrashBin;
