import React from "react";
import { 
  Tabs, 
  TabList, 
  Tab, 
  TabPanels,
  Box
} from "@chakra-ui/react";

const glassLayerStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(20px)",
  backgroundColor: "rgba(0, 0, 0, .8)",
  boxShadow: "inset 0 0 15px rgba(148, 115, 220, 0.15)",
  border: "1px solid rgba(148, 115, 220, 0.2)",
};

const VotingTabs = ({ 
  selectedTab, 
  handleTabsChange, 
  PTVoteType, 
  children 
}) => {
  return (
    <Tabs
      index={selectedTab}
      isFitted
      variant="soft-rounded"
      onChange={handleTabsChange}
      mb={6}
    >
      <TabList
        alignItems="center"
        justifyContent="center"
        borderRadius="3xl"
        boxShadow="lg"
        p={6}
        w="100%"
        mx="auto"
        maxW="1440px"
        bg="transparent"
        position="relative"
        display="flex"
        zIndex={0}
        color="rgba(333, 333, 333, 1)"
        spacing={6}
      >
        <Box 
          className="glass" 
          style={glassLayerStyle} 
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          borderRadius="inherit"
          zIndex={-1}
        />
        <Tab
          fontSize="2xl"
          fontWeight="extrabold"
          color="rgba(333, 333, 333, 1)"
          _selected={{ 
            backgroundColor: "rgba(148, 115, 220, 0.6)", 
            color: "white",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(148, 115, 220, 0.4)"
          }}
          _hover={{
            backgroundColor: "rgba(148, 115, 220, 0.3)"
          }}
          borderRadius="xl"
          py={4}
          transition="all 0.3s ease"
        >
          Direct Democracy
        </Tab>
        <Tab
          fontSize="2xl"
          fontWeight="extrabold"
          color="rgba(333, 333, 333, 1)"
          _selected={{ 
            backgroundColor: "rgba(148, 115, 220, 0.6)", 
            color: "white",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(148, 115, 220, 0.4)"
          }}
          _hover={{
            backgroundColor: "rgba(148, 115, 220, 0.3)"
          }}
          borderRadius="xl"
          py={4}
          transition="all 0.3s ease"
        >
          {PTVoteType}
        </Tab>
      </TabList>

      <TabPanels>
        {children}
      </TabPanels>
    </Tabs>
  );
};

export default VotingTabs; 