import Link from 'next/link';
import { getSortedPostsData } from '../../util/posts';
import { Text, Flex, VStack, Box, Divider, HStack, Image } from '@chakra-ui/react';
import Layout from '@/components/Layout';
import SideBar from '@/components/docs/SideBar';

export default function Home({ allPostsData }) {
    console.log(allPostsData);
    return (
        <Layout>
            <Flex ml="3%">
                <SideBar />
                <Box
                    ml="2%"
                    mt="100px"
                    bg="rgba(0, 0, 0, 0.8)"
                    p="4"
                    borderRadius="xl"
                    maxWidth="fit-content"
                    mr="5%"
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
                            <Link href="/docs/create">
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
                                    maxHeight={[90, 130, 170]}
                                    width="auto"
                                />
                            </Box>
                            </Link>
                            <Link href="/docs/perpetualOrganization">
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
                                        maxHeight={[100, 140, 180]}
                                        width="auto"
                                    />
                                </Box>
                            </Link>
                            <Link href="/docs/join">
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
                                        maxHeight={[100, 140, 180]}
                                        width="auto"
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
                                        maxHeight={[100, 140, 180]}
                                        width="auto"
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
