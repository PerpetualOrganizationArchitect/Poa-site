import { getAllPostIds, getPostData } from '../../util/posts';

import  Layout  from '../../components/Layout';


import { Box, Heading, Text, Flex, Divider } from '@chakra-ui/react';



export default function Post({ postData }) {
    if (!postData) {
        console.log("No post data available");
        return <p>No Post Found</p>;
    }

    return (
        <Layout>
        <Flex
            minHeight="110vh"  
            width="100%"  
            align="flex-start" 
            justify="center" 
        >
            <Box mt="20" mb="10" textColor="white" bg="black" padding="4" maxW="800px" borderRadius="xl">
                <Heading  size="2xl" marginBottom="2">{postData.id}</Heading>
                <Divider marginBottom="4" />
                <Box dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </Box>
        </Flex>
        </Layout>
    );
}

export async function getStaticPaths() {
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id);

    return {
        props: {
            postData,
        },
    };
}
