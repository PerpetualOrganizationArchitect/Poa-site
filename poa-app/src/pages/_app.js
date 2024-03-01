import { ChakraProvider, extendTheme, CSSReset } from "@chakra-ui/react";


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
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
