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
    >
      <Text  fontSize="2xl" fontWeight="bold" mb={2} textAlign="center">
        Fully Yours. Forever.
      </Text>
      <Text fontSize="lg" mb={4} ml="25%" mr="25%" textAlign={"left"}>
        Poa is commited to making Organizations that are Fully Owned by the Community itself, not investors, buisnesses, or even Poa. Once you deploy your Perpetual Organization we can't stop it or change it even if we wanted to. Only a Community Vote can. That's why we call them Perpetual.
      </Text>
      <Link href="/about" passHref>
        <Button size="lg" colorScheme="blue" variant="outline" mt={2}>
          Learn More
        </Button>
      </Link>
    </Flex>
  );
};

export default AboutPreview;
