import React from 'react';
import { Box, useDisclosure, Text, HStack } from '@chakra-ui/react';
import { useDrag } from 'react-dnd';
import TaskCardModal from './TaskCardModal';
import { useRouter } from 'next/router';

const TaskCard = ({ id, name, description, difficulty, estHours, index, columnId, submission,claimedBy,claimerUsername, onEditTask, moveTask,projectId, Payout }) => {
  const router = useRouter();
  const {userDAO} = router.query;

  const openTask = () => {
    console.log("projectId: ", projectId);
    // Using template literals to include `userDAO` in the pathname
    router.push({
      pathname: `/${userDAO}/tasks`,
      query: { task: id, projectId: projectId },
    }, undefined, { shallow: true });
  };




  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id, index, columnId, name, description,difficulty, estHours, claimedBy, claimerUsername, Payout, submission},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const cardStyle = isDragging ? { opacity: 0.5 } : {};

  const { isOpen, onOpen, onClose } = useDisclosure();

  const truncateDescription = (desc, maxLength) => {

    if (desc.length > maxLength) {
      return desc.substring(0, maxLength) + '...';
    }
    return desc;
  };

  return (
    <>
      <Box
        ref={drag}
        bg="ghostwhite"
        borderRadius='md'
        boxShadow='sm'
        p={2}
        mb={4}
        cursor="grab"
        style={cardStyle}
        onClick={openTask}
      >
        <Box fontWeight="900">{name}</Box>
        <Box fontSize="xs">{truncateDescription(description, 40)}</Box>
        {Payout && (
          <Box mt={2} fontWeight="500"><HStack><Text>Reward: </Text> <Text fontWeight="extrabold">{Payout}</Text></HStack></Box>
        )}
      </Box>
      <TaskCardModal
        isOpen={isOpen}
        onClose={onClose}
        task={{ id, name, description, difficulty, estHours,Payout, submission, claimedBy,claimerUsername}}
        columnId={columnId}
        onEditTask={onEditTask}
        moveTask={moveTask}
      />
    </>
  );
};

export default TaskCard;
