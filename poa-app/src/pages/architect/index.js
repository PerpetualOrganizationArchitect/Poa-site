import React, { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import ArchitectInput from "@/components/Architect/ArchitectInput";
import MemberSpecificationModal from "@/components/Architect/MemberSpecificationModal";
import WeightModal from "@/components/Architect/WeightModal";
import LogoDropzoneModal from "@/components/Architect/LogoDropzoneModal";
import ConfirmationModal from "@/components/Architect/ConfirmationModal";
import DeployProgressLoader from "@/components/Architect/DeployProgressLoader";
import { motion } from "framer-motion";
import {
  Spinner,
  Center,
  Box,
  useToast,
  Button,
  useDisclosure,
  Text,
} from "@chakra-ui/react";
import Deployer from "@/components/Architect/TempDeployer";

import { useRouter } from "next/router";
import ConversationLog from "@/components/Architect/ConversationLog";
import Character from "@/components/Architect/Character";
import Selection from "@/components/Architect/Selection";

import {main} from "../../../scripts/realDeployment"
import { useMetaMask } from "@/components/Metamask";





const steps = {
  ASK_NAME: "ASK_NAME",
  ASK_DESCRIPTION: "ASK_DESCRIPTION",
  ASK_MEMBERSHIP_DEFAULT: "ASK_MEMBERSHIP_DEFAULT",
  ASK_MEMBERSHIP_CUSTOMIZE: "ASK_MEMBERSHIP_CUSTOMIZE",
  ASK_ADD_ANOTHER_ROLE: "ASK_ADD_ANOTHER_ROLE",
  ASK_VOTING: "ASK_VOTING",
  ASK_VOTING_WEIGHT: "ASK_VOTING_WEIGHT",
  ASK_QUAD_VOTING: "ASK_QUAD_VOTING",
  ASK_IF_LOGO_UPLOAD: "ASK_IF_LOGO_UPLOAD",
  ASK_LOGO_UPLOAD: "ASK_LOGO_UPLOAD",
};
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const votingOptions = [
  { label: "Direct Democracy", value: "direct_democracy" },
  { label: "Quadratic Voting", value: "quadratic" },
];

const membershipOptions = [
  { label: "Executives", value: "executives" },
  { label: "Uniform Membership", value: "uniform_membership" },
];

const logoUploadOptions = [
  { label: "Use Default Logo", value: "no" },
  { label: "Upload My Own", value: "yes" },
];
const defaultMembershipOptions = [
  {
    label: "Keep default",
    value: "default",
    action: () => {
      setOrgDetails({
        ...orgDetails,
        membershipTypeNames: ["member", "executive"],
      });
      setCurrentStep(steps.ASK_VOTING);

      setShowSelection(false);
    },
  },
  {
    label: "I'd like more customization",
    value: "customize",
    action: () => {
      setCurrentStep(steps.ASK_MEMBERSHIP_CUSTOMIZE);
      setShowSelection(false);
    },
  },
];

const ArchitectPage = () => {
  const {wallet} = useMetaMask();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isMemberSpecificationModalOpen, setIsMemberSpecificationModalOpen] =
    useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);

  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showSelection, setShowSelection] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const [options, setOptions] = useState([]);
  const [orgName, setOrgName] = useState(""); // Holds the organization name input by the user.
  const [currentStep, setCurrentStep] = useState(steps.ASK_NAME);
  const [siteCreated, setSiteCreated] = useState(false);
  const [showDeployer, setShowDeployer] = useState(false);

  // Refs and hooks for UI effects and navigation.
  const selectionRef = useRef(null);
  const [selectionHeight, setSelectionHeight] = useState(0); // State for managing the dynamic height of the selection component.
  const toast = useToast(); // Toast is used for showing alerts and messages to the user.
  const router = useRouter(); // useRouter hook from Next.js for handling client-side navigation.

  const [orgDetails, setOrgDetails] = useState({
    membershipTypeNames: ["Gold", "Silver", "Bronze", "Default", "Executive"], // Default membership types
    POname: "",
    quadraticVotingEnabled: false,
    democracyVoteWeight: 100,
    participationVoteWeight: 0,
    hybridVotingEnabled: false,
    participationVotingEnabled: false,
    logoURL: "",
    // description: "",
    votingControlType: "DirectDemocracy",
  });

  // Function for creating the organization site. This is where you would
  // include the logic for creating a new organization based on user input.
  const createOrgSite = () => {
    if (!orgName.trim()) {
      toast({
        title: "Organization name is required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    // Navigate to the new DAO route after creation.
    // const formattedOrgName = encodeURIComponent(
    //   orgName.trim().toLowerCase().replace(/\s+/g, "-")
    // );
    // setIsConfirmationModalOpen(false);
    // router.push(`/[userDAO]/home`, `/${formattedOrgName}/home`);
  };

  //   const handleConfirmation = () => {
  //     // This is where you would handle the API call to create the site
  //     // For now, we'll navigate to the new route
  //     const formattedOrgName = encodeURIComponent(
  //       orgName.trim().toLowerCase().replace(/\s+/g, "-")
  //     );
  //     router.push(`/${formattedOrgName}/home`);
  //   };

  const handleStartOver = () => {
    // Reset all state to initial values
    setUserInput("");
    setMessages([]);
    setShowSelection(false);

    setOptions([]);
    setOrgName("");
    setOrgDetails({
      membershipTypeNames: ["Gold", "Silver", "Bronze", "Default", "Executive"], // Default membership types
      POname: "",
      quadraticVotingEnabled: false,
      democracyVoteWeight: 100,
      participationVoteWeight: 0,
      hybridVotingEnabled: false,
      participationVotingEnabled: false,
      logoURL: "",
      // description: "",
      votingControlType: "DirectDemocracy",
    });
    setCurrentStep(steps.ASK_NAME);
    onClose(); // Close the confirmation modal
  };

  const handleConfirmation = () => {
    // This is where you would handle the API call to create the site
    // For now, we'll navigate to the new route
    const formattedOrgName = encodeURIComponent(
      orgName.trim().toLowerCase().replace(/\s+/g, "-")
    );
    router.push(`/${formattedOrgName}/home`);
  };

  const startOver = () => {
    // Reset all state to initial values
    setUserInput("");
    setMessages([]);
    setShowSelection(false);
    setOptions([]);
    setOrgName("");
    setOrgDetails({
      name: "",
      description: "",
      membershipType: "",
      votingType: "",
      // ... reset other details as needed
    });
    setCurrentStep(steps.ASK_NAME);
    onClose(); // Close the confirmation modal
  };

  useEffect(() => {
    // Update the selectionHeight state if the selectionRef is set and the component is visible
    if (showSelection && selectionRef.current) {
      const height = selectionRef.current.offsetHeight + 20; // Get the height of the Selection component
      setSelectionHeight(height); // Set the height state
    }
  }, [showSelection, options]);

  useEffect(() => {
    // Simulating a greeting message from "POA" on initial load
    const greetingMessage = {
      speaker: "POA",
      text: "Hello! I'm Poa, your perpetual organization architect.",
    };

    setMessages([...messages, greetingMessage]);
  }, []);

  // ------ membership customization handlers

  const handleSaveMemberRole = (roleName) => {
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      membershipTypeNames: [...prevDetails.membershipTypeNames, roleName],
    }));

    addMessage(`I just added the ${roleName} role to your organization.`);
    askToAddAnotherRole(roleName);
    setCurrentStep("ASK_ADD_ANOTHER_ROLE");
  };
  const askToAddAnotherRole = () => {
    addMessage(`Would you like to add another role?`);
    setOptions([
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ]);
    setShowSelection(true);
  };

  // ------- participation voting handler

  const enableParticipation = () => {
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      participationVotingEnabled: true,
    }));
  };

  const enableQuadraticVoting = () => {
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      quadraticVotingEnabled: true,
    }));
  };

  // ------ hybrid voting handlers

  const handleWeight = ({ participationWeight, democracyWeight }) => {
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      hybridVotingEnabled: true,
      democracyVoteWeight: democracyWeight,
      participationVoteWeight: participationWeight,
    }));

    setCurrentStep("ASK_QUAD_VOTING");
  };

  function appendRandomNumsToPOname() {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
    setOrgDetails((prevDetails) => ({
      ...prevDetails,
      POname: POname + "_" + randomSuffix,
    }));
    console.log("POname: ", orgDetails.POname);
    return;
  }

  const handleSaveAllSelections = async () => {
    // Append a random number to POname
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
    const updatedPOname = `${orgDetails.POname}_${randomSuffix}`;

    // Update orgDetails with the new POname
    const updatedOrgDetails = {
      ...orgDetails,
      POname: updatedPOname,
    };

    // Update state to reflect changes
    setOrgDetails(updatedOrgDetails);

    // Close any open modal and show deployment progress
    setIsConfirmationModalOpen(false);
    console.log("Saving: ", updatedOrgDetails);

    deploy(orgDetails);

    // Prepare to show the deployment modal
    setShowDeployer(true);
  };

  const deploy = async (orgDetails) => {
    console.log("Deploying...");
    console.log(orgDetails);
    try {
      main(
        orgDetails.membershipTypeNames,
        orgDetails.membershipTypeNames,
        orgDetails.POname,
        orgDetails.quadraticVotingEnabled,
        orgDetails.democracyVoteWeight,
        orgDetails.participationVoteWeight,
        orgDetails.hybridVotingEnabled,
        orgDetails.participationVotingEnabled,
        orgDetails.logoURL,
        orgDetails.votingControlType, 
        wallet
       );
      setTimeout(() => {
        setIsDeploying(true); // set deployment to true for demonstration
      }, 3000); // Simulates a deployment time of 3 seconds
    } catch (error) {
      toast({
        title: "Deployment failed.",
        description: "There was an error during the deployment process.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleSendClick = () => {
    if (!userInput.trim()) return;

    switch (currentStep) {
      case "ASK_NAME":
        setOrgDetails({ ...orgDetails, POname: userInput.trim() });
        setCurrentStep("ASK_DESCRIPTION");
        break;
      case "ASK_DESCRIPTION":
        // setOrgDetails({ ...orgDetails, description: userInput.trim() });
        setCurrentStep("ASK_MEMBERSHIP_DEFAULT");
        break;
    }

    setUserInput(""); // Clear the input after handling
    addMessage(userInput, "user"); // Show user input in the conversation log
  };

  useEffect(() => {
    switch (currentStep) {
      case "ASK_NAME":
        addMessage("Please give your organization's name.");
        break;
      case "ASK_DESCRIPTION":
        addMessage("Please describe your organization.");
        break;
      case "ASK_MEMBERSHIP_DEFAULT":
        addMessage(
          "The default membership structure has two roles: executives and members. Would you like to add more roles?"
        );
        setOptions([
          { label: "Keep default", value: "default" },
          { label: "Customize roles", value: "customize" },
        ]);
        setShowSelection(true);
        break;
      case "ASK_MEMBERSHIP_CUSTOMIZE":
        break;
      case "ASK_ADD_ANOTHER_ROLE":
        askToAddAnotherRole();
        setShowSelection(true);
        break;
      case "ASK_VOTING":
        addMessage("Please select a voting type.");
        setShowSelection(true);
        setOptions([
          { label: "Participation only", value: "participation" },
          { label: "Hybrid", value: "hybrid" },
        ]);
        break;

      case "ASK_HYBRID_WEIGHT":
        break;
      case "ASK_QUAD_VOTING":
        addMessage("Would you like to enable quadratic voting?");
        setShowSelection(true);
        setOptions([
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
        ]);

        break;
      case "ASK_IF_LOGO_UPLOAD":
        addMessage("Would you like to upload a logo?");
        setShowSelection(true);
        setOptions([
          { label: "Yes", value: "yes" },
          { label: "Later", value: "no" },
        ]);

      case "ASK_CONFIRMATION":
        break;
    }
  }, [currentStep]);

  const handleCloseWeightModal = () => {
    setIsWeightModalOpen(false); // This will close the WeightModal
    setCurrentStep("ASK_IF_LOGO_UPLOAD");
  };

  const pinLogoFile = () => {
    console.log("pinning incoming");
  };

  const handleOptionSelected = (value) => {
    // Handle option selection based on the current step
    setShowSelection(false); // Hide selection options after choosing
    if (currentStep === "ASK_MEMBERSHIP_DEFAULT") {
      if (value === "default") {
        setCurrentStep("ASK_VOTING");
      } else if (value === "customize") {
        // Open modal for custom membership setup
        // Assume setIsMemberSpecificationModalOpen exists to control the modal
        setIsMemberSpecificationModalOpen(true);
      }
    }

    if (
      currentStep === "ASK_ADD_ANOTHER_ROLE" ||
      currentStep === "ASK_MEMBERSHIP_CUSTOMIZE"
    ) {
      if (value === "yes") {
        setIsMemberSpecificationModalOpen(true);
      } else if (value === "no") {
        setCurrentStep("ASK_VOTING");
      }
    }

    if (currentStep === "ASK_VOTING") {
      if (value === "participation") {
        //setIsParticipationModalOpen(true);
        enableParticipation();
        setCurrentStep("ASK_QUAD_VOTING");
      } else if (value === "hybrid") {
        //hybrid should be part direct democracy, part participation
        setIsWeightModalOpen(true);
        setCurrentStep("ASK_HYBRID_WEIGHT");
      }
      if (currentStep === "ASK_HYBRID_WEIGHT") {
        setCurrentStep("ASK_QUAD_VOTING");
      }
    }
    if (currentStep === "ASK_QUAD_VOTING") {
      if (value === "yes") {
        enableQuadraticVoting();
      }
      setShowSelection(false);
      setCurrentStep("ASK_IF_LOGO_UPLOAD");
    }
    if (currentStep === "ASK_IF_LOGO_UPLOAD") {
      if (value === "yes") {
        setIsLogoModalOpen(true);
        setCurrentStep("ASK_LOGO_UPLOAD");
      } else if (value === "no") {
        setIsConfirmationModalOpen(true);
        setCurrentStep("ASK_CONFIRMATION");
      }
    }
  };

  const addMessage = (text, speaker = "system") => {
    setMessages((prevMessages) => [...prevMessages, { speaker, text }]);
  };

  return (
    <Layout isArchitectPage>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box mt ="10" position="fixed" top="0" left="0" right="0" zIndex="sticky">
          <motion.div variants={itemVariants}>
            <Character />
          </motion.div>
        </Box>

        <Box
          position="fixed"
          top="115px" 
          bottom="60px"
          overflowY="auto"
          width="full"
          pt="4"
          px="4"
        >
          <ConversationLog
            messages={messages}
            selectionHeight={selectionHeight}
          />

          <MemberSpecificationModal
            isOpen={isMemberSpecificationModalOpen}
            onSave={handleSaveMemberRole}
            onClose={() => setIsMemberSpecificationModalOpen(false)}
          />
          <WeightModal
            isOpen={isWeightModalOpen}
            onSave={handleWeight}
            onClose={handleCloseWeightModal}
          />
          {
            <ConfirmationModal
              isOpen={isConfirmationModalOpen}
              orgDetails={orgDetails}
              onClose={() => setIsConfirmationModalOpen(false)}
              onStartOver={handleStartOver}
              onSave={handleSaveAllSelections}
            />
          }
          <Deployer
            isOpen={showDeployer}
            onClose={() => setShowDeployer(false)}
            deploymentDetails={orgDetails}
          />

          <LogoDropzoneModal isOpen={isLogoModalOpen} onSave={pinLogoFile} />
          {isDeploying && (
            <Center>
              <Spinner size="xl" />
            </Center>
          )}
        </Box>

        {showSelection && options.length > 0 && (
          <Box
            position="fixed"
            bottom="60px" // ArchitectInput component height
            left="0"
            right="0"
            p="4"
            display="flex"
            alignItems="centerx"
            justifyContent="center"
            bg="purple.50"
            borderTop="2px solid"
            borderColor="gray.200"
            zIndex="sticky"
          >
            <Selection
              ref={selectionRef}
              options={options}
              onOptionSelected={handleOptionSelected}
            />
          </Box>
        )}

        <Box
          position="fixed"
          bottom="0"
          width="full"
          p={4}
          paddingRight={10}
          zIndex="sticky"
        >
          {orgName && (
            <Button
              position="absolute"
              top="4"
              right="4"
              colorScheme="teal"
              onClick={() => router.push(`/${orgName}/home`)}
            >
              Access site
            </Button>
          )}
          <Box
            position="fixed"
            bottom="0"
            width="full"
            p={4}
            paddingRight={10}
            zIndex="sticky"
          >
            <ArchitectInput
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onSubmit={handleSendClick}
              isDisabled={showSelection} // Pass showSelection as the isDisabled prop
            />
          </Box>
        </Box>
      </motion.div>
    </Layout>
  );
};

export default ArchitectPage;
