import React, { useState, useEffect, useRef, use, forwardRef, useImperativeHandle } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { Box, Heading, IconButton, Toast, Flex } from '@chakra-ui/react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import { useTaskBoard } from '../../context/TaskBoardContext';
import AddTaskModal from './AddTaskModal';
import { useWeb3Context } from '../../context/web3Context';
import { useDataBaseContext } from '../../context/dataBaseContext';
import {usePOContext} from '@/context/POContext';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useProjectContext } from '@/context/ProjectContext';


const glassLayerStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  zIndex: -1,
  borderRadius: 'inherit',
  backdropFilter: 'blur(60px)',
  backgroundColor: 'rgba(0, 0, 0, .3)',
};




const TaskColumn = forwardRef(({ title, tasks, columnId, projectName, isMobile = false, isEmpty = false, hideTitleInMobile = false }, ref) => {
  const router = useRouter();
  const {userDAO} = router.query;
  const { moveTask, addTask, editTask } = useTaskBoard();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const {account, mintKUBIX, createTask } = useWeb3Context();
  const { taskManagerContractAddress,  } = usePOContext();
  const {taskCount, } = useProjectContext();
  const toast = useToast();

  let hasExecNFT= true;
  let hasMemberNFT= true;
  const { getUsernameByAddress } = useDataBaseContext();
  const hasMemberNFTRef = useRef(hasMemberNFT);
  const hasExecNFTRef = useRef(hasExecNFT);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    handleOpenAddTaskModal: () => {
      if (title === 'Open') {
        if (hasExecNFT) {
          setIsAddTaskModalOpen(true);
        } else {
          alert('You must be an executive to add task');
        }
      }
    }
  }));

  useEffect(() => {
    hasMemberNFTRef.current = hasMemberNFT;
  }, [hasMemberNFT]);

  useEffect(() => {
    hasExecNFTRef.current = hasExecNFT;
  }, [hasExecNFT]);

  
  const handleCloseAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
  };
  
  const handleAddTask =  async (updatedTask) => {
    
    const calculatePayout = (difficulty, estimatedHours) => {
  
      const difficulties = {
        easy: { base: 1, multiplier: 16.5 },
        medium: { base: 4, multiplier: 24 },
        hard: { base: 10, multiplier: 30 },
        veryHard: { base: 25, multiplier: 37.5 },
      };
      
      const { base, multiplier } = difficulties[difficulty];
      const total = Math.round(base + (multiplier * estimatedHours));
      return total;
  
    };
    if (title === 'Open') {
      let Payout= calculatePayout(updatedTask.difficulty, updatedTask.estHours);

      let hexTaskCount = taskCount.toString(16); 
      let newTaskId = `0x${hexTaskCount}-${taskManagerContractAddress}`;

      let newTask = {
        ...updatedTask,
        id: `${newTaskId}`,
        claimedBy: "",
        claimerUsername: "",
        submission: "",
        Payout: Payout,
        projectId: projectName + "-"+taskManagerContractAddress
      };
      moveTask(newTask, 'open', 'open', 0, " ", 0);
      await createTask(taskManagerContractAddress,Payout,  updatedTask.description, projectName, updatedTask.estHours,  updatedTask.difficulty, "Open", updatedTask.name,);
     
     
    }
  };
  
  

  const handleEditTask = async (updatedTask, taskIndex) => {
    updatedTask = {
      ...updatedTask,
      difficulty: updatedTask.difficulty, 
      estHours: updatedTask.estHours, 
    };
    
    await editTask(updatedTask, columnId, taskIndex, projectName);

    toast ({
      title: "Task edited.",
      description: "Your task was successfully edited.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: async(item) => {
      
      
      if (!hasMemberNFTRef.current && title != 'Completed') {
        alert('You must own an NFT to move tasks. Go to user to join');
        return;
      }
      else if (!hasExecNFTRef.current && title === 'Completed') {
        alert('You must be an Executive to review tasks.');
        return;
      }
      else if (title === 'Completed') {
        console.log("item.claimedBy: ", item.claimedBy)
        console.log("item.kubixPayout: ", item.kubixPayout)
        setTimeout(async() => {await mintKUBIX(item.claimedBy, item.kubixPayout, true)}, 2100);

      }

      if (item.columnId === 'completed') {
        alert('You cannot move tasks from the Completed column.');
        return;
      }

      if (item.columnId !== columnId) {
        const newIndex = tasks.length;
        console.log(item.claimerUsername)
        const claimedByValue = title === 'In Progress' ? account : item.claimedBy;
        const claimerUserValue = title === 'In Progress' ?  await getUsernameByAddress(account) : item.claimerUsername;
        console.log("claimerUserValue: ", claimerUserValue)
        const draggedTask = {
          ...item,
          id: item.id,
          name: item.name,
          description: item.description,
          difficulty: item.difficulty,
          estHours: item.estHours,
          claimedBy: claimedByValue,
          claimerUsername: claimerUserValue,
        };
        router.push({ pathname: `/tasks/`, query: { userDAO: account } }, undefined, { shallow: true });
        await moveTask(draggedTask, item.columnId, columnId, newIndex, item.submission, claimedByValue);
        toast({
          title: "Task moved.",
          description: "Your task was successfully moved.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const columnStyle = isOver ? { backgroundColor: 'rgba(0, 255, 0, 0.1)' } : {};

  // Mobile-specific column header style
  const mobileHeaderStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const handleOpenAddTaskModal = () => {
    if (title === 'Open') {
      if (hasExecNFT) {
        setIsAddTaskModalOpen(true);
      } else {
        alert('You must be an executive to add task');
      }
    }
  };

  return (
    <Box
      ref={drop}
      w="100%"
      h="100%"
      minH={isMobile ? "500px" : "auto"}
      bg="transparent" 
      borderRadius="xl"
      boxShadow={isMobile ? "none" : "lg"}
      style={{ ...columnStyle, position: 'relative' }}
      zIndex={1}
      display="flex"
      flexDirection="column"
    >
      <div className="glass" style={glassLayerStyle} />
      
      {(!isMobile || (isMobile && !hideTitleInMobile && !isEmpty)) && (
        <Heading size="md" mb={3} mt={0} ml={3} alignItems="center" color='white'>
          {title}
          {title === 'Open' && (
            <IconButton
              ml={8}
              icon={<AddIcon color="white" />}
              aria-label="Add task"
              onClick={handleOpenAddTaskModal}
              h="1.75rem"
              w="1.75rem"
              minW={0}
              bg="purple.500"
              _hover={{ bg: "purple.600" }}
              _active={{ bg: "purple.700" }}
              boxShadow="md"
              borderRadius="md"
            />
          )}
        </Heading>
      )}
      
      {(!isMobile || (isMobile && !isEmpty)) && (
        <Box
          h={isMobile ? "calc(100% - 3rem)" : "calc(100% - 3rem)"}
          borderRadius="md"
          bg="transparent"
          p={isMobile ? 1 : 2}
          style={columnStyle}
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
              background: 'rgba(0,0,0,0.1)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '24px',
            },
          }}
        >
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              id={task.id}
              name={task.name}
              description={task.description}
              difficulty={task.difficulty}
              estHours={task.estHours}
              submission={task.submission}
              claimedBy={task.claimedBy}
              Payout={task.Payout}
              claimerUsername={task.claimerUsername}
              columnId={columnId}
              projectId={task.projectId}
              onEditTask={(updatedTask) => handleEditTask(updatedTask, index)}
              isMobile={isMobile}
            />
          ))}
        </Box>
      )}

      {title === 'Open' && (
        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={handleCloseAddTaskModal}
          onAddTask={handleAddTask}
        />
      )}
    </Box>
  );
});

export default TaskColumn;
  
 
