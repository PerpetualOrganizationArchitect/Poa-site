// Usage in a parent component
import Organization from "./Organization";
import { organizations } from "./TempOrgData";
import { Box } from "@chakra-ui/react";

const YourPerpetualOrganizations = () => {
  return (
    <Box
      w="full" // Takes the full width of the parent
      h="full" // Takes the full height of the parent
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
    >
      {organizations.map((org, index) => (
        <Organization
          key={index}
          title={org.title}
          membership={org.membership}
          status={org.status}
          dateJoined={org.dateJoined}
          logoUrl={org.logoUrl}
          href={org.href}
        />
      ))}
    </Box>
  );
};

export default YourPerpetualOrganizations;
