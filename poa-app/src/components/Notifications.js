import React from 'react';
import { Box, Icon, Text, CloseButton, VStack, keyframes } from '@chakra-ui/react';
import { useNotificationContext } from '@/context/NotificationContext';
import { FiLoader, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Notification = () => {
  const { notifications, removeNotification } = useNotificationContext();

  return (
    <VStack
      spacing={3}
      position="fixed"
      bottom="20px"
      right="20px"
      width="300px"
      zIndex="1000"
    >
      {notifications.map(({ id, message, status }) => (
        <Box
          key={id}
          display="flex"
          alignItems="center"
          bg="white"
          borderWidth="1px"
          borderRadius="md"
          p={3}
          w="100%"
          boxShadow="md"
          borderLeftWidth="5px"
          borderColor={
            status === 'loading'
              ? 'blue.500'
              : status === 'success'
              ? 'green.500'
              : 'red.500'
          }
        >
          <Icon
            as={
              status === 'loading'
                ? FiLoader
                : status === 'success'
                ? FiCheckCircle
                : FiXCircle
            }
            mr={3}
            fontSize="20px"
            color={
              status === 'loading'
                ? 'blue.500'
                : status === 'success'
                ? 'green.500'
                : 'red.500'
            }
            
            animation={status === 'loading' ? `${spin} 2s linear infinite` : undefined}
          />
          <Text flex="1">{message}</Text>
          {status === 'error' && (
            <CloseButton onClick={() => removeNotification(id)} />
          )}
        </Box>
      ))}
    </VStack>
  );
};

export default Notification;
