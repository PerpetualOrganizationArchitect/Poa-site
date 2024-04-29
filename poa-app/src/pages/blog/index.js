import Link from 'next/link';
import { getSortedPostsData } from '../../util/posts';
import { Text, Flex, VStack, Box, Divider, HStack} from '@chakra-ui/react';
import Layout from '@/components/Layout';






export default function Home({ allPostsData }) {
    console.log(allPostsData);
    return (
        <Layout>
        
        <Flex ml="6%">
        
            <Box mt="120px">
            <VStack mt="2" align={"flex-start"}>
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
            <Box ml="9%"  mt="120px"  bg="rgba(0, 0, 0, 0.1)" p="4" borderRadius={"xl"} maxWidth="fit-content"  mr="10%"  >
                
            <Text fontWeight={"700"} fontSize={"32px"} maxWidth={"400px"}  >Get Started with Poa</Text>
            <Text fontSize={"16px"} mt="4"  maxWidth={"400px"}  >Perpetual Organization Architect</Text>
          {/* box with transparent gray backgriund */}

            <HStack mt="4" >
            <Box
                mt="4"
                p="4"
                borderRadius="lg"
                bg="rgba(0, 0, 0, 0.1)"
                
            >
                <Text fontSize="20px">Create a new Perpetual Organization</Text>

            </Box>
            <Box
                mt="4"
                p="4"
                borderRadius="lg"
                bg="rgba(0, 0, 0, 0.1)"
               
            >
                <Text fontSize="20px">Join an existing Perpetual Organization</Text>

            </Box>
            <Box
                mt="4"
                p="4"
                borderRadius="lg"
                bg="rgba(0, 0, 0, 0.1)"
                
            >
                <Text fontSize="20px">Manage your Perpetual Organization</Text>

            </Box>
            </HStack>
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
