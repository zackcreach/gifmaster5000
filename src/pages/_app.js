import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../../apollo/client";
import { grommet, Grommet } from "grommet";
import { deepMerge } from "grommet/utils";

import "../styles/base/globals.css";

const theme = deepMerge(grommet, {
  defaultMode: "dark",
  global: {
    colors: {
      brand: "accent-1",
    },
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
    },
  },
});

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Grommet theme={theme}>
        <Component {...pageProps} />
      </Grommet>
    </ApolloProvider>
  );
}
