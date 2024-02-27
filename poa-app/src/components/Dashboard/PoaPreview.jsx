import { Box, Text, Image, Button, LinkOverlay } from "@chakra-ui/react";

const PoaPreview = () => {
  return (
    <Box
      w="full" // Takes the full width of the parent
      h="full" // Takes the full height of the parent
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
    >
      <Text>Poa Preview</Text>
      <Button colorScheme="teal" variant="outline" mt={4}>
        Try Poa
      </Button>
    </Box>
  );
};

export default PoaPreview;
