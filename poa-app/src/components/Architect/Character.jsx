// Character.jsx
import Image from "next/image";
import { Box } from "@chakra-ui/react";

const Character = () => {
  return (
    <Box
      position="fixed"
      width="100%"
      top="0"
      left="0"
      right="0"
      height="115px"
      zIndex="sticky"
    >
      <Box position="absolute" left="50%" transform="translateX(-50%)">
        <Image
          src="/images/poa_character.png"
          alt="Character"
          width={115}
          height={115}
        />
      </Box>
    </Box>
  );
};

export default Character;
