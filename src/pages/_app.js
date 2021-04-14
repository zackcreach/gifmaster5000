import { ApolloProvider } from "@apollo/client";
import { useApollo } from "../../apollo/client";

import "../styles/base/globals.css";

import PageWrapper from "../components/pageWrapper";

export default function App(props) {
  const apolloClient = useApollo(props.pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <PageWrapper {...props} />
    </ApolloProvider>
  );
}
