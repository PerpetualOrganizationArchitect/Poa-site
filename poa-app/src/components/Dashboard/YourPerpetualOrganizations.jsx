import Organization from "./Organization";
//import { organizations } from "./TempOrgData";
import { Flex, Text, Box, Button } from "@chakra-ui/react";
import Link from "next/link";

const YourPerpetualOrganizations = () => {
  const organizations = [];
  return (
    <>
      <Box textAlign="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold" color="grey.600">
          YOUR PERPETUAL ORGANIZATIONS
        </Text>
      </Box>
      {organizations.length === 0 ? (
        <Flex direction="column" textAlign="center" alignItems="center" p={4}>
          <Text fontSize="md" mb={4} color="gray.600">
            You aren't a part of any organizations yet. When you are, they'll
            appear here.
          </Text>
          <Text fontSize="lg" mb={4} color="gray.600">
            Would you like to create one?
          </Text>
          <Link href="/architect" passHref>
            <Button
              textColor="black"
              backgroundColor="lightblue"
              size="lg"
              colorScheme="blue"
              variant="outline"
              mt={4}
            >
              Create
            </Button>
          </Link>
        </Flex>
      ) : (
        <Flex
          justifyContent="center"
          w="full"
          h="full"
          p={4}
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
      )}
    </>
  );
};

export default YourPerpetualOrganizations;
