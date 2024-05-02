import Link from 'next/link';
import { getSortedPostsData } from '../../util/posts';
import { Text, Flex, VStack, Box, Divider, Heading, HStack } from '@chakra-ui/react';
import Layout from '@/components/Layout';

export default function Home({ allPostsData }) {
    return (
        <Layout>
            <Flex  ml="4%">
                <Box mb="40px" mt="120px">
                    <VStack  spacing={4} align="flex-start">
                        {/* Get Started Section */}
                        <Heading size="lg">Get Started</Heading>
                        <Divider color="black" />
                        {["PerpetualOrganization", "CreateAPerpetualOrganization", "JoinAPerpetualOrganization"].map((slug, index) => (
                            <Link key={index} href={`/blog/${slug}`} passHref>
                                <Text 
                                    fontWeight="400"
                                    fontSize="14px"
                                    _hover={{
                                        textDecoration: "none",
                                        transform: "scale(1.05)"
                                    }}
                                    transition="transform 0.2s"
                                    display="block"
                                    width="fit-content"
                                >
                                    {slug.replace(/([A-Z])/g, ' $1').trim()}
                                </Text>
                            </Link>
                        ))}
                        
                        {/* Voting Section */}
                        <Heading size="lg" mt={8}>Voting</Heading>
                        <Divider color="black" />
                        {["VotingOptions", "HybridVoting", "DirectDemocracy", "ContributionBasedVoting", "QuadraticVoting"].map((slug, index) => (
                            <Link key={index} href={`/blog/${slug}`} passHref>
                                <Text 
                                    fontWeight="400"
                                    fontSize="14px"
                                    _hover={{
                                        textDecoration: "none",
                                        transform: "scale(1.05)"
                                    }}
                                    transition="transform 0.2s"
                                    display="block"
                                    width="fit-content"
                                >
                                    {slug.replace(/([A-Z])/g, ' $1').trim()}
                                </Text>
                            </Link>
                        ))}

                        {/* Tasks and Rewards Section */}
                        <Heading size="lg" mt={8}>Tasks and Rewards</Heading>
                        <Divider color="black" />
                        {["RewardsOverview", "TaskManager", "RewardRubric", "ClaimingAndSubmittingTasks"].map((slug, index) => (
                            <Link key={index} href={`/blog/${slug}`} passHref>
                                <Text
                                    fontWeight="400"
                                    fontSize="14px"
                                    _hover={{
                                        textDecoration: "none",
                                        transform: "scale(1.05)"
                                    }}
                                    transition="transform 0.2s"
                                    display="block"
                                    width="fit-content"
                                >
                                    {slug.replace(/([A-Z])/g, ' $1').trim()}
                                </Text>
                            </Link>
                        ))}
                    </VStack>
                    
                </Box>
                <Box ml="5%"  mt="120px"  bg="rgba(0, 0, 0, 0.75)" p="4" borderRadius={"xl"} maxWidth="fit-content"  mr="3%" textColor={"white"}  >
                
            <Text fontWeight={"700"} fontSize={"32px"} maxWidth={"400px"}  >Learn About Poa</Text>
          {/* box with transparent gray backgriund */}

            <HStack mt="4" justifyContent="space-evenly" >
            <Link href="/blog/PerpetualOrganization" passHref>
            <Box
                mt="4"
                p="4"
                borderRadius="lg"
                bg="rgba(0, 0, 0, 0.6)"
                minH={"150px"}
                _hover={{
                    textDecoration: "none",
                    transform: "scale(1.03)"
                }}
                
            >
                <Text fontWeight={"500"} fontSize="20px">What is a Perpetual Organization?</Text>

            </Box>
            </Link>
            <Link href="/blog/CreateAPerpetualOrganization" passHref>
            <Box
                mt="4"
                p="4"
                borderRadius="lg"
                bg="rgba(0, 0, 0, 0.6)"
                minH={"150px"}
                _hover={{
                    textDecoration: "none",
                    transform: "scale(1.03)"
                }}
               
            >
                <Text fontWeight={"500"} fontSize="20px">How to Create a new Perpetual Organization</Text>

            </Box>
            </Link>
            <Link href="/blog/JoinAPerpetualOrganization" passHref>
            <Box
                mt="4"
                p="4"
                borderRadius="lg"
                bg="rgba(0, 0, 0, 0.6)"
                minH={"150px"}
                _hover={{
                    textDecoration: "none",
                    transform: "scale(1.03)"
                }}
                
                
            >
                <Text fontWeight={"500"} fontSize="20px">How to Join an existing Perpetual Organization</Text>

            </Box>
            </Link>


            </HStack>
            <Text fontWeight={"700"} fontSize={"32px"} maxWidth={"400px"} mt="8">New Blog Posts</Text>
            </Box>

            </Flex>
        </Layout>
    );
}

export async function getStaticProps() {
    const allPostsData = await getSortedPostsData();
    return {
        props: {
            allPostsData,
        },
    };
}
