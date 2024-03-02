import React, { useState, useEffect } from "react";
import { Box, Progress, Text } from "@chakra-ui/react";

const deploymentSteps = [
  { label: "NFT Membership", message: "Deploying NFT Membership contract..." },
  { label: "NFT Membership", message: "NFT Membership contract deployed!" },
  {
    label: "DD Token",
    message: "Deploying Direct Democracy Token contract...",
  },
  { label: "DD Token", message: "Direct Democracy Token contract deployed!" },
  { label: "PT Token", message: "Deploying Participation Token contract..." },
  { label: "PT Token", message: "Participation Token contract deployed!" },
  { label: "Treasury", message: "Deploying Treasury contract..." },
  { label: "Treasury", message: "Treasury contract deployed!" },
  {
    label: "Participation Voting",
    message: "Deploying Participation Voting contract...",
  },
  {
    label: "Participation Voting",
    message: "Participation Voting contract deployed!",
  },
  { label: "Hybrid Voting", message: "Deploying Hybrid Voting contract..." },
  { label: "Hybrid Voting", message: "Hybrid Voting contract deployed!" },
  {
    label: "Direct Democracy Voting",
    message: "Deploying Direct Democracy Voting contract...",
  },
  {
    label: "Direct Democracy Voting",
    message: "Direct Democracy Voting contract deployed!",
  },
  { label: "Task Manager", message: "Deploying Task Manager contract..." },
  { label: "Task Manager", message: "Task Manager contract deployed!" },
  { label: "Registry", message: "Deploying Registry contract..." },
  { label: "Registry", message: "Registry contract deployed!" },
  {
    label: "Setting Task Manager",
    message: "Setting Task Manager in PT Token contract...",
  },
  {
    label: "Setting Task Manager",
    message: "Task Manager set in PT Token contract!",
  },
  {
    label: "Setting Voting Contract",
    message: "Setting Voting Contract in Treasury contract...",
  },
  {
    label: "Setting Voting Contract",
    message: "Voting Contract set in Treasury contract!",
  },
  { label: "Finalizing", message: "Finalizing deployment..." },
  {
    label: "Complete",
    message: "All contracts deployed and configured successfully!",
  },
];

const DeployProgressLoader = ({ deploymentSteps, currentStepIndex }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Assuming that steps are equally divided into 100%
      setProgress((prevProgress) => {
        const stepProgress = 100 / steps.length;
        const nextProgress = prevProgress + stepProgress;
        return nextProgress > 100 ? 100 : nextProgress;
      });
    }, 1000); // Update progress every second

    return () => clearInterval(interval);
  }, [steps.length]);

  const currentStep = steps[currentStepIndex] || {};

  return (
    <Box width="100%" p={4}>
      <Progress value={progress} hasStripe isAnimated colorScheme="teal" />
      <Text fontSize="md" mt={2}>
        {currentStep.message}
      </Text>
    </Box>
  );
};

export default DeployProgressLoader;
