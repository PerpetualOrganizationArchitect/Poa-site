// Character.jsx
import { Box, Image } from "@chakra-ui/react";

const Character = () => {
  return (
    <Box
      position="fixed"
      width="100%"
      top="0"
      left="0"
      right="0"
      height = "auto"
      display="flex"
      justifyContent="center"
      alignItems="center"
      zIndex="sticky"
    >
      <Image
        src="/images/high_res_poa.png"
        alt="Character"
        width={[70,110]}
        height={[70,110]}
      />
    </Box>
  );
};

export default Character;
