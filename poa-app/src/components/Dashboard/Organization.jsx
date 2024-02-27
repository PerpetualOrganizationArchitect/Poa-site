// components/Organization.jsx
import {
  Box,
  Image,
  LinkBox,
  Text,
  LinkOverlay,
  VStack,
} from "@chakra-ui/react";

const Organization = ({ title, role, dateJoined, logoUrl, href }) => {
  return (
    <LinkBox
      borderWidth="1px"
      borderColor="gray.300" // Adjusted for a neutral look
      p={2}
      rounded="md"
      _hover={{ shadow: "md" }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      w="200px" // Square dimensions
      h="200px"
      overflow="hidden" // Ensures content does not overflow the square
    >
      <Image
        src={logoUrl}
        alt={`${title} logo`}
        boxSize="60px"
        objectFit="contain"
      />
      <VStack spacing={1} mt={2} align="center" flexGrow={1}>
        <LinkOverlay href={href} isExternal>
          <Text fontSize="xs" fontWeight="bold" noOfLines={1}>
            {title}
          </Text>
        </LinkOverlay>
        <Text fontSize="xs" noOfLines={1}>
          Role: {role}
        </Text>

        <Text fontSize="xs" noOfLines={1}>
          Joined {dateJoined}
        </Text>
      </VStack>
    </LinkBox>
  );
};

export default Organization;
