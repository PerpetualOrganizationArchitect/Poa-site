import React, { useEffect, useState } from "react";
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";
import { useGraphContext } from "@/context/graphContext";
import Link from "next/link";
import { Flex, VStack, Box, Text, Button, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";

function generatePODetails(poData) {
    const {
        HybridVoting = null,
        DirectDemocracyVoting = null,
        ParticipationVoting = null,
        NFTMembership = null,
        Treasury = null
    } = poData.perpetualOrganization;

    let descriptions = [];
    let treasuryControl = "an unidentified voting system";

    descriptions.push(<Heading size="lg" >Voting Types</Heading>);

    const addVotingSystemDescription = (name, system) => {
        if (system) {
            descriptions.push(<Heading size="md" mt="2">{name}</Heading>);
            descriptions.push(<Text>Description: Requires a quorum of {system.quorum}% of total votes.</Text>);
            // Check if this system controls the treasury
            if (Treasury && Treasury.votingContract === system.id) {
                treasuryControl = name;
            }
        }
    };

    addVotingSystemDescription("Hybrid Voting", HybridVoting);
    addVotingSystemDescription("Direct Democracy Voting", DirectDemocracyVoting);
    addVotingSystemDescription("Participation Voting", ParticipationVoting);

    descriptions.push(<Heading size="lg" mt="4">Treasury</Heading>);
    const votingControlDescription = <Text>The treasury is controlled by the {treasuryControl} System.</Text>;
    descriptions.push(votingControlDescription);

    if (NFTMembership) {
        descriptions.push(<Heading size="lg" mt="4">Roles</Heading>);
        descriptions.push(<Heading size="md" mt="2">Executive Roles</Heading>);
        descriptions.push(<Text>{NFTMembership.executiveRoles.join(', ')}</Text>);
        descriptions.push(<Heading size="md" mt="2">Member Types</Heading>);
        descriptions.push(<Text>{NFTMembership.memberTypeNames.join(', ')}</Text>);
    }

    return descriptions;
}



const ConstitutionPage = () => {
    const { fetchRules } = useGraphContext();
    const router = useRouter();
    const { userDAO } = router.query;

    // Manage description as a state
    const [descriptionElements, setDescriptionElements] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            let poData = await fetchRules(userDAO);
            setDescriptionElements(generatePODetails(poData));
        };
        if (userDAO) {
            fetchData();
        }
    }, [userDAO]);

    return (
        <>
            <Navbar/>
            <VStack spacing={4} align="center">
                <Heading mt="2" as="h1" size="xl" fontWeight="bold">Perpetual Organization Constitution</Heading>
                <Box textColor={"white"} p="20px"  borderRadius="lg" overflow="hidden" bg="rgba(0, 0, 0, 0.85)">
                    {descriptionElements}
                </Box>
                <Link href={`/user/?userDAO=${userDAO}`} passHref>
                    <Button
                        bgGradient="linear(to-r, teal.300, green.300)"
                        color="white"
                        _hover={{
                            bgGradient: "linear(to-r, teal.600, green.600)",
                        }}
                        _active={{
                            bgGradient: "linear(to-r, teal.700, green.700)",
                        }}
                        borderRadius="full"
                        px="6"
                        py="2"
                        fontSize="lg"
                        fontWeight="bold"
                        textColor="black"
                    >
                        Dashboard
                    </Button>
                </Link>
            </VStack>
        </>
    );
};

export default ConstitutionPage;
