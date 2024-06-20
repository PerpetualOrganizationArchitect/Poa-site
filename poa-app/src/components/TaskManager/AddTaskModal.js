import React, { use, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  VStack,
  Select,
  Textarea,
  useToast,
} from '@chakra-ui/react';


const AddTaskModal = ({ isOpen, onClose, onAddTask }) => {



  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [estHours, setEstHours] = useState(.5);

  const [loading,setLoading] = useState(false)

  const toast = useToast();

  const handleSubmit = () => {

    const handleAddTask = async () => {
      setLoading(true);
      await onAddTask({ name, description, difficulty, estHours });

      // Show a toast notification when a task is successfully added
      toast({
        title: "Task added.",
        description: "Your task was successfully added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setLoading(false);
      setDescription('');
      setName('');
    };

    handleAddTask();
    setDifficulty('easy');
    setEstHours(.5);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl id="task-name">
              <FormLabel>Task Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl id="task-description">
              <FormLabel>Description</FormLabel>
              <Textarea
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl id="task-difficulty">
              <FormLabel>Difficulty</FormLabel>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="veryHard">Very Hard</option>
              </Select>
            </FormControl>
            <FormControl id="task-estimated-hours">
              <FormLabel>Estimated Hours</FormLabel>
              <Input
                type="number"
                min="0.5"
                step="0.5"
                value={estHours}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (isNaN(val)) {
                    setEstHours(0.5);
                  } else {
                    setEstHours(val);
                  }
                }}
                onBlur={(e) => {
                  const val = parseFloat(e.target.value);
                  if (val <= 0.5) {
                    setEstHours(0.5);
                  } else {
                    setEstHours(Math.round(val * 2) / 2);
                  }
                }}
              />
            </FormControl>

          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}
          isLoading={loading}
          loadingText="Adding Task">
            Add Task
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTaskModal;

