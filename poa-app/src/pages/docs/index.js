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
                    <VStack mt="1" align="flex-start">
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
                    ml="8%"
                    mt="100px"
                    bg="rgba(0, 0, 0, 0.75)"
                    p="4"
                    borderRadius="xl"
                    maxWidth="fit-content"
                    mr="9%"
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
                        <HStack mt="2">
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
                                
                                        height={[120,160, 220]}
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
