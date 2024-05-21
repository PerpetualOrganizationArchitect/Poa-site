import React, { useState } from 'react';
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
  ModalFooter,
  ModalOverlay,
  Select,
} from '@chakra-ui/react';

const EditTaskModal = ({ isOpen, onClose, onEditTask, onDeleteTask, task }) => {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description);
  
  const [difficulty, setDifficulty] = useState(task.difficulty);
  const [estHours, setEstimatedHours] = useState(task.estHours);
 

  const handleEditTask = () => {
    
    onEditTask({ ...task, name, description, difficulty, estHours });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
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
          <FormControl mt={4}>
            <FormLabel>Estimated Hours</FormLabel>
            <Input
                type="number"
                min="0.5"
                step="0.5"
                value={estHours}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (isNaN(val)) {
                    setEstimatedHours(0.5);
                  } else {
                    setEstimatedHours(val);
                  }
                }}
                onBlur={(e) => {
                  const val = parseFloat(e.target.value);
                  if (val <= 0.5) {
                    setEstimatedHours(0.5);
                  } else {
                    setEstimatedHours(Math.round(val * 2) / 2);
                  }
                }}
              />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr ="auto" onClick={() => onDeleteTask(task.id)}>
            Delete
          </Button>
          <Button colorScheme="teal" onClick={handleEditTask}>
            Save Changes
          </Button>

        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditTaskModal;
