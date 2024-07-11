import React from 'react';
import CountDown from '../../templateComponents/studentOrgDAO/voting/countDown';
import {
    Box,
    HStack,
    Heading,
    Text,
    VStack,
} from '@chakra-ui/react';
import Link2 from 'next/link';

const glassLayerStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
    borderRadius: 'inherit',
    backdropFilter: 'blur(50px)',
    backgroundColor: 'rgba(0, 0, 0, .9)',
};

const UserProposals = ({ userProposals }) => {
    // Check if user proposals exist
    const userProposalsExist = userProposals && userProposals.length > 0;
    if (!userProposalsExist) {
        return <Text mt="4" ml="7">No proposals available</Text>;
    }

    function calculateRemainingTime(expirationTimestamp) {
        // Current timestamp in seconds
        const currentTimestamp = Math.floor(Date.now() / 1000);
        // Calculate the duration
        const duration = expirationTimestamp - currentTimestamp;
        return duration;
    }

    return (
        <HStack ml={0} mr={8} spacing="3.5%">
            {userProposals.map((proposal) => (
                <Box
                    _hover={{ transform: 'scale(1.07)' }}
                    key={proposal.id}
                    bg="transparent"
                    borderRadius="2xl"
                    p={2}
                    position="relative"
                    w="31%"
                    mt="-4"
                >
                    <div style={glassLayerStyle} />
                    <Link2 href={`/voting/?proposal=${proposal.id}`}>
                        <VStack textColor="white" spacing={3}>
                            <Heading ml={4} fontWeight="extrabold" mt={2} size="sm">
                                {proposal.name}
                            </Heading>
                            <Box pl="4" mt="2">
                                <CountDown duration={calculateRemainingTime(proposal.expirationTimestamp)} />
                            </Box>
                        </VStack>
                    </Link2>
                </Box>
            ))}
        </HStack>
    );
};

export default UserProposals;
