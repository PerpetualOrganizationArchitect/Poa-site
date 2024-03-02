import { ChakraProvider, extendTheme, CSSReset } from "@chakra-ui/react";
import { IPFSprovider } from "@/context/ipfsContext";
import { Web3Provider } from "@/context/Web3Context";
import { DataBaseProvider } from "@/context/dataBaseContext";
import { GraphProvider } from "@/context/graphContext";


const theme = extendTheme({
  fonts: {
    heading: "'Roboto Mono', monospace", // Use Roboto Mono for headings
    body: "'Roboto Mono', monospace", // Use Roboto Mono for body text
  },
  styles: {
    global: {
      body: {
        bgGradient: "linear(to-r, orange.100, pink.100)", // Using Chakra UI's color tokens
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <GraphProvider>
      <Web3Provider>
      <IPFSprovider>
        <DataBaseProvider>
            <ChakraProvider theme={theme}>
              <Component {...pageProps} />
            </ChakraProvider>
        </DataBaseProvider>
        </IPFSprovider>
      </Web3Provider>
    </GraphProvider>
  );
}

export default MyApp;
