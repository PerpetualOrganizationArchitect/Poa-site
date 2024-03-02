import { ChakraProvider, extendTheme, CSSReset } from "@chakra-ui/react";
import { IPFSprovider } from "@/context/ipfsContext";
import { Web3Provider } from "@/context/Web3Context";
import { DataBaseProvider } from "@/context/dataBaseContext";


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
    <Web3Provider>
      <DataBaseProvider>
        <IPFSprovider>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </IPFSprovider>
      </DataBaseProvider>
    </Web3Provider>
  );
}

export default MyApp;
