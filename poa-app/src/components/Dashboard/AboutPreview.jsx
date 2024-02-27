import { Flex, Text, Button } from "@chakra-ui/react";

const AboutPreview = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      w="full"
      h="full"
      p={4}
      borderWidth="1px"
      borderRadius="lg"
    >
      <Text mb={4} textAlign="center">
        Fully Yours. Forever.
      </Text>
      <Button colorScheme="teal" variant="solid">
        Learn More
      </Button>
    </Flex>
  );
};

export default AboutPreview;
