//react component gets poll data from votingcontext and displays ongoing polls in cards

import React, { useState, useEffect, useContext } from 'react';


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


const OngoingPolls = ({OngoingPolls}) => {



    //randomize polls
    const randomPolls = OngoingPolls.sort(() => Math.random() - Math.random()).slice(0, 3);

    // duplicate poll 2 times 
    //const randomPolls = OngoingPolls.sort(() => Math.random() - Math.random()).slice(0, 3).concat(OngoingPolls.sort(() => Math.random() - Math.random()).slice(0, 3)).concat(OngoingPolls.sort(() => Math.random() - Math.random()).slice(0, 3));


    return (
            <HStack ml={0} mr={8} spacing="3.5%" >
                        {randomPolls.map((poll) => (
                            
                            <Box
                                _hover={{ transform: 'scale(1.07)' }}
                                key={poll.id}
                                bg="transparent"
                                borderRadius="2xl"
                                p={4}
                                position="relative"
                                w="31%"
                            >
                                
                                <div style={glassLayerStyle}/>
                                
                                <Link2  href={`/voting/?poll=${poll.id}`}>
                                <VStack textColor="white"  spacing={3}>

                                    <Heading pt={2} ml={4} fontWeight="extrabold" mt={2} size="sm">{poll.name}</Heading>
                                    
                                    <Box pl="4" mt="2"><CountDown duration={poll?.expirationTimestamp- Math.floor(Date.now() / 1000)}/></Box>
                                </VStack>
                                </Link2>
                                
                            </Box>
                        

                        ))}
            </HStack>
    );

}

export default OngoingPolls;