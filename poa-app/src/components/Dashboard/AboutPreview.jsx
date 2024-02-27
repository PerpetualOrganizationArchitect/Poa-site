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
        Our mission is to simplify the creation of and participation in fully
        community owned organizations by leveraging AI for onboarding and
        decentralized technologies for the infrastructure. Full decentralization
        is our priority. We want to ensure that the created Perpetual
        Organizations can’t be stopped or changed by anyone but the community
        members.
      </Text>
      <Button colorScheme="teal" variant="solid">
        Learn More
      </Button>
    </Flex>
  );
};

export default AboutPreview;
