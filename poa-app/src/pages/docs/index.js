import Link from 'next/link';
import { getSortedPostsData } from '../../util/posts';
import { Text, Flex, VStack, Box, Divider, HStack, Image } from '@chakra-ui/react';
import Layout from '@/components/Layout';

export default function Home({ allPostsData }) {
    console.log(allPostsData);
    return (
        <Layout>
            <Flex ml="3%">
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
                        <Link href={`/blog/hybridVoting`} style={{ textDecoration: 'none' }}>
                            <Text  _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }} fontWeight="500" fontSize="15px">Hybrid Voting</Text>
                        </Link>
                        <Link href={`/docs/contributionVoting`} style={{ textDecoration: 'none' }}>
                            <Text  _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }} fontWeight="500" fontSize="15px">Contribution Based Voting</Text>
                        </Link>
                        <Link href={`/blog/ddVoting`} style={{ textDecoration: 'none' }}>
                            <Text  _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }} fontWeight="500" fontSize="15px">Direct Democracy Voting</Text>
                        </Link>
                        
                    </VStack>
                </Box>
                <Box
                    ml="2%"
                    mt="100px"
                    bg="rgba(0, 0, 0, 0.8)"
                    p="4"
                    borderRadius="xl"
                    maxWidth="fit-content"
                    mr="7%"
                >
                    <VStack align="flex-start">
                        <Text
                            fontWeight="700"
                            fontSize="32px"
                            maxWidth="400px"
                            textColor="white"
                        >
                            Learn about Poa
                        </Text>
                        <HStack >
                            <Link href="/create">
                            <Box
                                _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }}
                                mt="4"
                                p="4"
                                borderRadius="lg"
                                bg="rgba(0, 0, 0, 0.65)"
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Text fontWeight="600" textColor="white" fontSize="20px" >
                                    How to Create a Perpetual Organization
                                </Text>
                                <Image
                                    mt="1"
                                    src="/images/high_res_poa.png"
                                    alt="Poa Logo"
                                    height={[100,140, 180]}
                                />
                            </Box>
                            </Link>
                            <Link href="/join">
                                <Box
                                    _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }}
                                    mt="4"
                                    p="4"
                                    borderRadius="lg"
                                    bg="rgba(0, 0, 0, 0.65)"
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Text fontWeight="600" textColor="white" fontSize="20px">
                                        What is a Perpetual Organization?
                                    </Text>
                                    <Image
                                        src="/images/Po.webp"
                                        alt="Poa Logo"
                                        mt="1"
                                        height={[100,140, 180]}
                                    />
                                </Box>
                            </Link>
                            <Link href="/manage">
                                <Box
                                    _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }}
                                    mt="4"
                                    p="4"
                                    borderRadius="lg"
                                    bg="rgba(0, 0, 0, 0.65)"
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Text fontWeight="600" textColor="white" fontSize="20px">
                                        How to Join a Perpetual Organization
                                    </Text>
                                    <Image
                                        mt="1"
                                        src="/images/join.webp"
                                        alt="AlphaV1"
                                        height={[100,140, 180]}
                                    />
                                </Box>
                            </Link>
                        </HStack>
                        <Text  fontWeight="700"
                            fontSize="32px"
                            maxWidth="400px"
                            textColor="white"
                            mt="2"
                            >
                            Featured Articles
                        </Text>
                        <HStack >
                            <Link href="/docs/AlphaV1">
                                <Box
                                    maxW={"50%"}
                                    _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }}
                                    mt="4"
                                    p="4"
                                    borderRadius="lg"
                                    bg="rgba(0, 0, 0, 0.65)"
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Text fontWeight="600" textColor="white" fontSize="18px">
                                        AlphaV1: The First Step Towards the Future of Decentralized Organizations
                                    </Text>
                                    <Image
                                        mt="2"
                                        src="/images/alphaV1.webp"
                                        alt="AlphaV1"
                                
                                        height={[100,140, 180]}
                                    />
                                </Box>
                            </Link>
                        </HStack>
                    </VStack>
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
