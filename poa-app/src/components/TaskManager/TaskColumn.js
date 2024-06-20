import React, { useState, useEffect, useRef } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { Box, Heading, IconButton, Toast} from '@chakra-ui/react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';
import { useTaskBoard } from '../../context/TaskBoardContext';
import AddTaskModal from './AddTaskModal';
import { useWeb3Context } from '../../context/web3Context';
import { useDataBaseContext } from '../../context/dataBaseContext';
import { useGraphContext } from '@/context/graphContext';
import { useToast } from '@chakra-ui/react';

// ... inside TaskColumn component, before return statement
const glassLayerStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  zIndex: -1,
  borderRadius: 'inherit',
  backdropFilter: 'blur(60px)',
  backgroundColor: 'rgba(0, 0, 0, .3)',
};







const TaskColumn = ({ title, tasks, columnId, projectName }) => {
  const { moveTask, addTask, editTask } = useTaskBoard();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const {account, mintKUBIX, createTask } = useWeb3Context();
  const { taskManagerContractAddress, taskCount } = useGraphContext();
  const toast = useToast();

  let hasExecNFT= true;
  let hasMemberNFT= true;
  const { getUsernameByAddress } = useDataBaseContext();
  const hasMemberNFTRef = useRef(hasMemberNFT);
  const hasExecNFTRef = useRef(hasExecNFT);



  useEffect(() => {
    hasMemberNFTRef.current = hasMemberNFT;
  }, [hasMemberNFT]);

  useEffect(() => {
    hasExecNFTRef.current = hasExecNFT;
  }, [hasExecNFT]);

  
  const handleOpenAddTaskModal = () => {
    if (title === 'Open') {
      
      if (hasExecNFT) {
        setIsAddTaskModalOpen(true);
      } else {
         alert('You must be an executive to add task');
      }
      
    }
    };

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

        let newTask = {
          ...updatedTask,
          id: `0x${taskCount}-${taskManagerContractAddress}`,
          claimedBy: "",
          claimerUsername: "",
          submission: "",
          Payout: Payout
        };

        await createTask(taskManagerContractAddress,Payout,  updatedTask.description, projectName, updatedTask.estHours,  updatedTask.difficulty, "Open", updatedTask.name,);
        moveTask(newTask, 'open', 'open', 0, " ", 0);
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
          console.log("maybe this one")
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
          moveTask(draggedTask, item.columnId, columnId, newIndex, item.submission, claimedByValue);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }));
  
    const columnStyle = isOver ? { backgroundColor: 'rgba(0, 255, 0, 0.1)' } : {};
  
    return (
      <Box
      ref={drop}
      w="100%"
      h="100%"
      bg="transparent" 
      borderRadius="md"
      boxShadow="lg"
      style={{ ...columnStyle, position: 'relative' }} // Add position: 'relative'
      zIndex={1}
    >
      <div className="glass" style={glassLayerStyle} />
        <Heading size="md" mb={3} mt={0}ml={3}alignItems="center" color='white'>
          {title}
          {title === 'Open' && (
            <IconButton
              ml={8}
              icon={<AddIcon color="white" />} // Change color to white
              aria-label="Add task"
              onClick={handleOpenAddTaskModal}
              h="1.60rem" // Adjust height
              w="1.60rem" // Adjust width
              minW={0} // Set minimum width to 0
              bg="" // Set background color to black
              border= ".5px solid white"
              boxshadow="md"
            />

          )}
        </Heading>
        <Box
            h="calc(100% - 3rem)"
            borderRadius="md"
            bg="transparent"
            p={2} // Change p value
            style={columnStyle}
            overflowY="auto"
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
              />
            ))}
          </Box>

        {title === 'Open' && (
          <AddTaskModal
            isOpen={isAddTaskModalOpen}
            onClose={handleCloseAddTaskModal}
            onAddTask={handleAddTask}
          />
        )}
      </Box>
    );
  };
  
  export default TaskColumn;
  
 
