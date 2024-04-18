import { Box, Text, Image, Button, Flex } from "@chakra-ui/react";
import NextImage from "next/image";
import Link from "next/link";

const PoaPreview = () => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      w="full"
      h="full"
      p={2}
      textAlign={"center"}
      m="5"
    >
      <Image
        src="/images/poa_character.png"
        alt="Character"
        width={115}
        height={115}
      />
      <Text fontSize="lg">This is Poa</Text>
      <Text fontSize="xl" mt="4" fontWeight={"600"}>
        The Perpetual Organization Architect
      </Text>

      <Link href="/architect" passHref>
        <Button
          textColor="black"
          backgroundColor="lightblue"
          size="lg"
          colorScheme="blue"
          variant="outline"
          mt={4}
        >
          Start Building
        </Button>
      </Link>
    </Flex>
  );
};

export default PoaPreview;
