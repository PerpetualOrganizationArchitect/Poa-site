import React, { useEffect, useState } from "react";
import Navbar from "@/templateComponents/studentOrgDAO/NavBar";
import { useGraphContext } from "@/context/graphContext";
import Link from "next/link";
import { Flex, VStack, Box, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

function generatePODetails(poData) {
    const { HybridVoting = null, DirectDemocracyVoting = null, ParticipationVoting = null, NFTMembership = null, Treasury = null } = poData.perpetualOrganization;
    let descriptions = [];
    if (HybridVoting) {
        descriptions.push(`Hybrid Voting System (ID: ${HybridVoting.id}) requires a quorum of ${HybridVoting.quorum}% of total votes.`);
    }
    if (DirectDemocracyVoting) {
        descriptions.push(`Direct Democracy Voting System (ID: ${DirectDemocracyVoting.id}) requires a quorum of ${DirectDemocracyVoting.quorum}% of total votes.`);
    }
    if (ParticipationVoting) {
        descriptions.push(`Participation Voting System (ID: ${ParticipationVoting.id}) requires a quorum of ${ParticipationVoting.quorum}% of total votes.`);
    }
    if (NFTMembership) {
        descriptions.push(`Executive Roles: ${NFTMembership.executiveRoles.join(', ')}.`);
        descriptions.push(`Member Types: ${NFTMembership.memberTypeNames.join(', ')}.`);
    }
    if (Treasury) {
        descriptions.push(`The treasury is controlled by the voting contract at address ${Treasury.votingContract}.`);
    }
    return descriptions.join("\n");
}

const ConstitutionPage = () => {
    const { fetchRules } = useGraphContext();
    const router = useRouter();
    const { userDAO } = router.query;

    // Manage description as a state
    const [description, setDescription] = useState("Loading...");

    useEffect(() => {
        // Define an async function inside useEffect
        const fetchData = async () => {
            let poData = await fetchRules(userDAO);
            console.log("poData", poData);
            setDescription(generatePODetails(poData));
        };
        // Call the function
        fetchData();
    }, [userDAO]); // Dependency array to re-run the effect when userDAO changes

    return (
        <>
        <Navbar/>

                <Text fontSize="xl" fontWeight="bold">Perpetual Organization Constitution</Text>
                <Box>
                    <Text>{description}</Text>
                </Box>
                <Box>
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
                </Box>
        </>
  
    );
};

export default ConstitutionPage;
