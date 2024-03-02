import { useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTaskBoard } from '../../context/TaskBoardContext';
import TaskColumn from './TaskColumn';

const glassLayerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '3xl',
  backdropFilter: 'blur(20px)',
  backgroundColor: 'rgba(0, 0, 0, .3)',
};

const TaskBoard = ({ columns, projectName }) => {
  const { taskColumns, setTaskColumns } = useTaskBoard();
  useEffect(() => {
    setTaskColumns(columns);
  }, [columns, setTaskColumns]);

  return (
    <DndProvider backend={HTML5Backend}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        w="100%"
        h="85vh"
        overflowX="hidden"
        overflowY="hidden"
        wrap={{ base: 'nowrap', md: 'nowrap' }}
        mt={2}
      >
        {taskColumns &&
          taskColumns.map((column) => (
            <Box
              key={column.id}
              flex="1 1 100%"
              mx={{ base: 0, md: 1 }}
              p={3}
              borderRadius="3xl"
              position="relative"
              sx={glassLayerStyle}
            >
              <TaskColumn
                title={column.title}
                tasks={column.tasks}
                columnId={column.id}
                projectName={projectName}
                zIndex={1}
              />
            </Box>
          ))}
      </Flex>
    </DndProvider>
  );
};

export default TaskBoard;
