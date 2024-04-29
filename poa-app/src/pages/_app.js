import { ChakraProvider, extendTheme, CSSReset } from "@chakra-ui/react";
import { IPFSprovider } from "@/context/ipfsContext";
import { Web3Provider } from "@/context/web3Context";
import { DataBaseProvider } from "@/context/dataBaseContext";
import { GraphProvider } from "@/context/graphContext";
import { DashboardProvider } from "@/context/dashboardContext";
const theme = extendTheme({
  fonts: {
    heading: "'Roboto Mono', monospace", // Use Roboto Mono for headings
    body: "'Roboto Mono', monospace", // Use Roboto Mono for body text
  },
  styles: {
    global: {
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
        fontSize: '1rem',
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
        backgroundColor: 'gray.500',
        borderRadius: '6px',
      },
      'pre': {
        fontFamily: 'monospace',
        overflowX: 'auto',
        padding: '1rem',
        backgroundColor: 'gray.500',
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
      body: {
        bgGradient: "linear(to-r, orange.200, pink.200)",
        color: "#001443",
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (

    <IPFSprovider>
      <DashboardProvider>
      <GraphProvider>
        <Web3Provider>
          <DataBaseProvider>
            <ChakraProvider theme={theme}>
              <Component {...pageProps} />
            </ChakraProvider>
          </DataBaseProvider>
        </Web3Provider>
      </GraphProvider>
      </DashboardProvider>
    </IPFSprovider>
  );
}

export default MyApp;
