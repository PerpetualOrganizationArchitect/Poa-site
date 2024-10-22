import React from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import AboutPreview from "@/components/profileHub/AboutPreview";
import YourPerpetualOrganizations from "@/components/profileHub/YourPerpetualOrganizations";
import PoaPreview from "@/components/profileHub/PoaPreview";


const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const profileHubPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, 
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  return (
    <Layout>
      <MotionBox
        pt="4rem"
        w="full"
        overflowY="auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <VStack
          mt="6"
          spacing={6}
          w="full"
          h="full"
          justify="center"
          align="center"
        >
          <MotionFlex
            w="full"
            flex="1"
            direction={{ base: "column", md: "row" }}
            p={3}
            variants={itemVariants}
            align="center" // Ensure alignment is centered for all sizes
          >
            <MotionBox
              w={{ base: "full", md: "40%" }}
              h="full"
              p={3}
              variants={itemVariants}
            >
              <PoaPreview />
            </MotionBox>
            <MotionBox
              w={{ base: "full", md: "60%" }}
              h="full"
              p={3}
              px={{ base: 0, md: 6 }} // Responsive horizontal padding
              variants={itemVariants}
            >
              <AboutPreview />
            </MotionBox>
          </MotionFlex>
        </VStack>
        <MotionBox w="full" flex="1" p={3} variants={itemVariants}>
          <YourPerpetualOrganizations />
        </MotionBox>
      </MotionBox>
    </Layout>
  );
};

export default profileHubPage;
