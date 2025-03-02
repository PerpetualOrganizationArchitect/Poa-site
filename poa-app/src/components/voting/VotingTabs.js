import React from "react";
import { 
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel 
} from "@chakra-ui/react";

const glassLayerStyle = {
  position: "absolute",
  height: "100%",
  width: "100%",
  zIndex: -1,
  borderRadius: "inherit",
  backdropFilter: "blur(20px)",
  backgroundColor: "rgba(0, 0, 0, .8)",
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
        bg="transparent"
        position="relative"
        display="flex"
        zIndex={0}
        color="rgba(333, 333, 333, 1)"
      >
        <div className="glass" style={glassLayerStyle} />
        <Tab
          fontSize="2xl"
          fontWeight="extrabold"
          color="rgba(333, 333, 333, 1)"
          _selected={{ backgroundColor: "ghostwhite", color: "black" }}
        >
          Direct Democracy
        </Tab>
        <Tab
          fontSize="2xl"
          fontWeight="extrabold"
          color="rgba(333, 333, 333, 1)"
          _selected={{ backgroundColor: "ghostwhite", color: "black" }}
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