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
      p={4}
      borderWidth="1px"
      borderRadius="lg"
    >
      <Image
        src="/images/poa_character.png"
        alt="Character"
        width={115}
        height={115}
      />
      <Text>This is Poa.</Text>

      <Link href="/architect" passHref>
        <Button colorScheme="teal" variant="outline" mt={4}>
          Start Building
        </Button>
      </Link>
    </Flex>
  );
};

export default PoaPreview;
