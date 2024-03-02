import React from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Layout from "../../components/Layout";
import AboutPreview from "@/components/Dashboard/AboutPreview";
import YourPerpetualOrganizations from "@/components/Dashboard/YourPerpetualOrganizations";
import PoaPreview from "@/components/Dashboard/PoaPreview";

// Convert Chakra UI components to motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const DashboardPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger the animations of children
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
        <VStack spacing={6} w="full" h="full" justify="center">
          <MotionBox w="full" flex="1" p={3} variants={itemVariants}>
            <AboutPreview />
          </MotionBox>

          <MotionFlex
            w="full"
            flex="1"
            direction={{ base: "column", md: "row" }}
            p={3}
            variants={itemVariants}
          >
            <MotionBox
              w={{ base: "full", md: "50%" }}
              h="full"
              p={3}
              variants={itemVariants}
            >
              <YourPerpetualOrganizations />
            </MotionBox>

            <MotionBox
              w={{ base: "full", md: "50%" }}
              h="full"
              p={3}
              variants={itemVariants}
            >
              <PoaPreview />
            </MotionBox>
          </MotionFlex>
        </VStack>
      </MotionBox>
    </Layout>
  );
};

export default DashboardPage;
