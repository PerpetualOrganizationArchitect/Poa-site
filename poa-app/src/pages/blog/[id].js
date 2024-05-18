import { getAllPostIds, getPostData } from '../../util/posts';

import  Navigation from '@/components/Navigation';
import { useEffect, useState } from 'react';
import { Box, Heading, Text, Flex, Divider, extendTheme, ChakraProvider, useBreakpointValue, HStack } from '@chakra-ui/react';
import SideBar from '@/components/docs/SideBar';

const theme = extendTheme({
    styles: {
        global: {
            body: {
                bgGradient: "linear(to-r, orange.200, pink.200)",
                color: "#001443",
              },
            'h1, h2, h3, h4, h5, h6': {
                fontWeight: 'bold',
              },
              'h1': {
                fontSize: '2.25rem', // 36px
                marginTop: '1.5rem',
                marginBottom: '0.75rem',
              },
              'h2': {
                fontSize: '2rem', // 32px
                marginTop: '1.5rem',
                marginBottom: '0.75rem',
              },
              'h3': {
                fontSize: '1.75rem', // 28px
                marginTop: '1.5rem',
                marginBottom: '0.5rem',
              },
              'h4': {
                fontSize: '1.5rem', // 24px
                marginTop: '1.5rem',
                marginBottom: '0.5rem',
              },
              'h5': {
                fontSize: '1.25rem', // 20px
                marginTop: '1.5rem',
                marginBottom: '0.5rem',
              },
              'h6': {
                fontSize: '1rem', // 16px
                marginTop: '1.5rem',
                marginBottom: '0.5rem',
              },
              'p': {
                fontSize: '1.2rem',
                lineHeight: '1.75rem',
                marginBottom: '1rem',
              },
              'ul, ol': {
                marginLeft: '1.25rem',
                marginBottom: '1rem',
              },
              'li': {
                marginBottom: '0.25rem',
              },
              'a': {
                color: 'black.500',
                textDecoration: 'underline',
              },
              'blockquote': {
                paddingLeft: '1rem',
                borderLeft: '4px solid gray',
                margin: '1rem 0',
                color: 'gray.400',
              },
              'code': {
                fontFamily: 'monospace',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                padding: '0.2rem 0.5rem',
                backgroundColor: 'gray.700',
                borderRadius: '6px',
              },
              'pre': {
                fontFamily: 'monospace',
                overflowX: 'auto',
                padding: '1rem',
                backgroundColor: 'gray.700',
                borderRadius: '6px',
              },
              'table': {
                width: '100%',
                marginBottom: '1rem',
                borderCollapse: 'collapse',
              },
              'th, td': {
                border: '1px solid gray',
                padding: '0.5rem',
                textAlign: 'left',
              },
              'img': {
                maxWidth: '100%',
                height: 'auto',
              },
              '.katex-mathml': {
                display: 'none', 
            },
        },
    },
});



export default function Post({ postData }) {
  if (!postData) {
    console.log("No post data available");
    return <p>No Post Found</p>;
  }

  console.log(postData.contentHtml);

  const showSidebar = useBreakpointValue({ base: false, md: true });
  const [marginLeft, setMarginLeft] = useState('0px');

  useEffect(() => {
    const checkAndSetMargin = () => {
      const requiredMargin = 250;
      const availableSpace = window.innerWidth - 850-230;
      console.log(availableSpace);

      if (showSidebar && availableSpace < requiredMargin) {
        setMarginLeft('230px');
      } else {
        setMarginLeft('0px');
      }
    };

    // Check and set margin initially and on window resize
    checkAndSetMargin();
    window.addEventListener('resize', checkAndSetMargin);

    // Cleanup listener when the component unmounts
    return () => {
      window.removeEventListener('resize', checkAndSetMargin);
    };
  }, [showSidebar]);

  return (
    <ChakraProvider theme={theme}>
      <Navigation />
      <Flex position="relative" minHeight="110vh" width="100%">
        {showSidebar && (
          <Flex position="absolute" top="0" left="0" ml="3%" width="200px">
            <SideBar />
          </Flex>
        )}

        <Flex
          align="start"
          justify="center"
          width="100%"
          ml={marginLeft}
        >
          <Box
            mt="100px"
            mb="10"
            textColor="white"
            bg="#1A202C"
            pl="8"
            pr="8"
            maxW="850px"
            borderRadius="xl"
            width="100%"
          >
            <Box dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
          </Box>
        </Flex>
      </Flex>
    </ChakraProvider>
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
