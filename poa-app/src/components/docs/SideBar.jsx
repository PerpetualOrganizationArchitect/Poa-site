import React from 'react';
import { Box, VStack, Text, Divider, Link } from '@chakra-ui/react';

const SideBar = () => {
    return (
        <Box mt="120px">
            <VStack mt="1" align="flex-start" gap="3">
                <Text fontWeight="700" fontSize="20px">Get Started</Text>
                <Divider color="black" />
                <Link href={`/docs/create`} style={{ textDecoration: 'none' }}>
                    <Text  _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }} fontWeight="500" fontSize="15px">Creating a Perpetual Organization</Text>
                </Link>
                <Link href={`/docs/perpetualOrganization`} style={{ textDecoration: 'none' }}>
                    <Text  _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }}  fontWeight="500" fontSize="15px">What is a Perpetual Organization?</Text>
                </Link>
                <Link href={`/docs/join`} style={{ textDecoration: 'none' }}>
                    <Text  _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }} fontWeight="500" fontSize="15px">Joining a Perpetual Organization</Text>
                </Link>

                <Text fontWeight="700" fontSize="20px">Voting</Text>
                <Divider color="black" />
                <Link href={`/docs/hybridVoting`} style={{ textDecoration: 'none' }}>
                    <Text  _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }} fontWeight="500" fontSize="15px">Hybrid Voting</Text>
                </Link>
                <Link href={`/docs/contributionVoting`} style={{ textDecoration: 'none' }}>
                    <Text  _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }} fontWeight="500" fontSize="15px">Contribution Based Voting</Text>
                </Link>
                <Link href={`/docs/directDemocracy`} style={{ textDecoration: 'none' }}>
                    <Text  _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }} fontWeight="500" fontSize="15px">Direct Democracy Voting</Text>
                </Link>
            </VStack>
        </Box>
    );
}

export default SideBar;