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
        <Button colorScheme="blue" variant="outline" mt={4}>
          learn more
        </Button>
      </Link>
    </Flex>
  );
};

export default AboutPreview;
