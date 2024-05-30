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
      height="110px"
      display="flex"
      justifyContent="center"
      alignItems="center"
      zIndex="sticky"
    >
      <Image
        src="/images/high_res_poa.png"
        alt="Character"
        width={110}
        height={110}
      />
    </Box>
  );
};

export default Character;
