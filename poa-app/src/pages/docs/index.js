import Link from 'next/link';
import { getSortedPostsData } from '../../util/posts';
import { Text, Flex, VStack, Box, Divider, HStack } from '@chakra-ui/react';
import Layout from '@/components/Layout';

export default function Home({ allPostsData }) {
    console.log(allPostsData);
    return (
        <Layout>
            <Flex ml="6%">
                <Box mt="120px">
                    <VStack mt="2" align="flex-start">
                        <Text fontWeight="600" fontSize="22px">Articles</Text>
                        <Divider color="black" />
                        {allPostsData.map(({ id }) => (
                            <Link href={`/blog/${id}`} key={id} style={{ textDecoration: 'none' }}>
                                <Text
                                    fontWeight="400"
                                    fontSize="20px"
                                    _hover={{
                                        textDecoration: "none",
                                        transform: "scale(1.05)"
                                    }}
                                    transition="transform 0.2s"
                                    display="block"
                                    width="fit-content"
                                >
                                    {id.replace(/-/g, ' ')}
                                </Text>
                            </Link>
                        ))}
                    </VStack>
                </Box>
                <Box
                    ml="9%"
                    mt="120px"
                    bg="rgba(0, 0, 0, 0.75)"
                    p="4"
                    borderRadius="xl"
                    maxWidth="fit-content"
                    mr="10%"
                >
                    <VStack align="flex-start">
                        <Text
                            fontWeight="700"
                            fontSize="32px"
                            maxWidth="400px"
                            textColor="white"
                        >
                            Get Started with Poa
                        </Text>
                        <HStack mt="2">
                            <Link href="/create">
                                <Box
                                    _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }}
                                    mt="4"
                                    p="4"
                                    borderRadius="lg"
                                    bg="rgba(0, 0, 0, 0.65)"
                                >
                                    <Text fontWeight="600" textColor="white" fontSize="20px">
                                        How to Create a Perpetual Organization
                                    </Text>
                                </Box>
                            </Link>
                            <Link href="/join">
                                <Box
                                    _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }}
                                    mt="4"
                                    p="4"
                                    borderRadius="lg"
                                    bg="rgba(0, 0, 0, 0.65)"
                                >
                                    <Text fontWeight="600" textColor="white" fontSize="20px">
                                        What is a Perpetual Organization?
                                    </Text>
                                </Box>
                            </Link>
                            <Link href="/manage">
                                <Box
                                    _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }}
                                    mt="4"
                                    p="4"
                                    borderRadius="lg"
                                    bg="rgba(0, 0, 0, 0.65)"
                                >
                                    <Text fontWeight="600" textColor="white" fontSize="20px">
                                        How to Join a Perpetual Organization
                                    </Text>
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
                        <HStack mt="2">
                            <Link href="/create">
                                <Box
                                    maxW={"50%"}
                                    _hover={{ transform: "scale(1.03)", transition: "transform 0.3s" }}
                                    mt="4"
                                    p="4"
                                    borderRadius="lg"
                                    bg="rgba(0, 0, 0, 0.65)"
                                >
                                    <Text fontWeight="600" textColor="white" fontSize="18px">
                                        AlphaV1: The First Step Towards the Future of Decentralized Organizations
                                    </Text>
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
