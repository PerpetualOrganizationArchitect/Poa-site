import Organization from "./Organization";
import { organizations } from "./TempOrgData";
import { Flex, Text, Box } from "@chakra-ui/react";

const YourPerpetualOrganizations = () => {
  return (
    <>
      <Box textAlign="center" mb={4}>
        {" "}
        {/* Center text and add margin below */}
        <Text fontSize="2xl" fontWeight="bold" color="grey.600">
          Your Perpetual Organizations
        </Text>
      </Box>
      <Flex
        justifyContent="center"
        w="full"
        h="full"
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        overflowX="auto"
        gap={4}
        align="stretch"
      >
        {organizations.map((org, index) => (
          <Organization
            key={index}
            title={org.title}
            role={org.role}
            dateJoined={org.dateJoined}
            logoUrl={org.logoUrl}
            href={org.href}
          />
        ))}
      </Flex>
    </>
  );
};

export default YourPerpetualOrganizations;
