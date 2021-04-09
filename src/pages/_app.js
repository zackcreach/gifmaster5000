import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../../apollo/client";
import { Grommet } from "grommet";

import "../styles/base/globals.css";

const theme = {
  global: {
    colors: {
      brand: "#0F00CD",
      focus: "#13D2F2",
    },
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
    },
  },
};

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
