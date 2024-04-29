import Link from 'next/link';
import { getSortedPostsData } from '../../util/posts';
import { Text, Flex, VStack, Box, Divider } from '@chakra-ui/react';
import Layout from '@/components/Layout';

export default function Home({ allPostsData }) {
    console.log(allPostsData);
    return (
        <Layout>
        <Text align={"center"} mt="100px">Blog</Text>
        <Flex ml="5%">
            <Box>
            <VStack align={"flex-start"}>
                <Text fontWeight={"600"} fontSize={"22px"}>Articles</Text>
                <Divider color={"black"} />

            {allPostsData.map(({ id}) => (
                <Link href={`/blog/${id}` } style={{ textDecoration: 'none' }}>
                   <Text
                   
                    fontWeight="400"
                    fontSize="20px"
                    textDecoration="none"
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
