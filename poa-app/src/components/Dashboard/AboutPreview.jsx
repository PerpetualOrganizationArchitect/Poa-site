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
      textAlign={"center"}
      mt="3"
    >
      <Text fontSize="3xl" fontWeight="bold" mb={4} textAlign="center">
        Own Your Organizations
      </Text>
      <Text fontSize="lg" pl="5" pr="5" mb={2} textAlign={"center"}>
        Poa helps you create organizations that are fully owned by the community
        itself - not investors, buisnesses, or even Poa.
      </Text>
      <Text fontSize="lg" pl="5" pr="5" mb={2} textAlign={"center"}>
        Once you deploy your Perpetual Organization, the only thing that can
        stop or change it is a community vote.
      </Text>{" "}
      <Link href="/about" passHref>
        <Button size="lg" colorScheme={"navy"} variant="outline" mt={2}>
          Learn More
        </Button>
      </Link>
    </Flex>
  );
};

export default AboutPreview;
