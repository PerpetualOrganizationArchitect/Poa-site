import { Box, Text, Button } from "@chakra-ui/react";

const AboutPreview = () => {
  return (
    <Box
      w="full" // Takes the full width of the parent
      h="50%" // Takes up 50% of the vertical space
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      overflowY="auto" // Allows scrolling if the text is too long
    >
      <Text mb={4}>
        {/* Add your desired text here */}
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.
        Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies
        sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius
        a, semper congue, euismod non, mi.
      </Text>
      <Button colorScheme="teal" variant="solid">
        Learn More
      </Button>
    </Box>
  );
};

export default AboutPreview;
