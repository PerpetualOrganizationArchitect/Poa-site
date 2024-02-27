import { Flex, Text, Button } from "@chakra-ui/react";
import Link from "next/link";

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

      <Link href="/about" passHref>
        <Button colorScheme="teal" variant="solid" mt={4}>
          Learn More
        </Button>
      </Link>
    </Flex>
  );
};

export default AboutPreview;
