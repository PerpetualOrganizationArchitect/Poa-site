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

    descriptions.push(<Heading mb="4" size="lg">Voting Types</Heading>);

    const addVotingSystemDescription = (name, system, description) => {
        if (system) {
            descriptions.push(<Heading ml="2" size="md" mt="2">{name}</Heading>);
            descriptions.push(<Text mt="2" mb="2" ml="2">{description}</Text>);
            descriptions.push(<Text ml="2">Minimum Quorum: {system.quorum}% of total votes to pass</Text>);
            // Check if this system controls the treasury
            if (Treasury && Treasury.votingContract === system.id) {
                treasuryControl = name;
            }
        }
    };

    addVotingSystemDescription(
        "Hybrid Voting",
        HybridVoting,
        "Hybrid Voting combines elements of both direct and representative democracy. It allows members to vote directly on some issues while delegating other decisions to elected representatives."
    );
    addVotingSystemDescription(
        "Direct Democracy Voting",
        DirectDemocracyVoting,
        "Direct Democracy Voting enables all members to vote directly on every issue, ensuring that each member has a direct say in the decision-making process."
    );
    addVotingSystemDescription(
        "Participation Voting",
        ParticipationVoting,
        "Participation Voting is designed to encourage active involvement by requiring a minimum level of participation for votes to be valid, fostering engagement and accountability."
    );


    if (NFTMembership) {
        descriptions.push(<Heading mb="4" size="lg" mt="4">Member Roles</Heading>);
        descriptions.push(<Text ml="2">Executive member types can add tasks and create votes</Text>);
        descriptions.push(<Heading ml="2" size="md" mt="2">Member Types</Heading>);
        descriptions.push(<Text ml="2">{NFTMembership.memberTypeNames.join(', ')}</Text>);
        descriptions.push(<Heading ml="2" size="md" mt="2">Executive</Heading>);
        descriptions.push(<Text ml="2">{NFTMembership.executiveRoles.join(', ')}</Text>);
    }

    descriptions.push(<Heading size="lg" mb="4" mt="4">Treasury and DAO Upgrades</Heading>);
    const votingControlDescription = <Text ml="2">The treasury and upgradability is controlled by the {treasuryControl} System.</Text>;
    descriptions.push(votingControlDescription);


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
            <Navbar />
            <VStack spacing={4} align="center">
                <Heading mt="4" as="h1" size="xl" mb="2" fontWeight="bold">Perpetual Organization Constitution</Heading>
                <Box textColor={"white"} p="20px" width={"70%"} borderRadius="lg" overflow="hidden" bg="rgba(0, 0, 0, 0.85)">
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