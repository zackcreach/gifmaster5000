import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { initializeApollo } from "../../apollo/client";
import { Layer, Text, Grid, Box, ResponsiveContext } from "grommet";
import { getErrorMessage } from "../../lib/form";

import Header from "../components/header";
import GifForm from "../components/gifForm";
import GifCard from "../components/gifCard";

export default function Home(props) {
  const [refreshGifs, refreshGifsResponse] = useLazyQuery(GifsQuery, {
    fetchPolicy: "network-only",
  });

  const [removeGif] = useMutation(RemoveGifMutation);

  const size = useContext(ResponsiveContext);
  const [item, setItem] = useState(null);
  const [gifs, setGifs] = useState(props.gifs);
  const [error, setError] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (refreshGifsResponse.called === false) {
      return;
    }

    if (refreshGifsResponse.error) {
      setError({ message: getErrorMessage(refreshGifsResponse.error) });
    } else if (refreshGifsResponse.data) {
      const gifs = refreshGifsResponse.data?.gifs || [];

      setGifs(gifs);
    }
  }, [refreshGifsResponse]);

  useEffect(() => {
    if (item != null) {
      handleClickLayer();
    }
  }, [item]);

  useEffect(() => {
    if (isModalOpen === false) {
      setItem(null);
    }
  }, [isModalOpen]);

  function handleClickLayer() {
    setIsModalOpen((prevState) => !prevState);
  }

  async function handleClickDelete(event) {
    const id = event.target.id;
    const filename = event.target.dataset?.filename;

    try {
      // Remove image from file storage
      await fetch(`/api/image/delete?filename=${filename}`, { method: "POST" });

      // Delete record from db
      const response = await removeGif({
        variables: { id },
      });

      const success = response?.data?.removeGif?.success;
      if (success === true) {
        refreshGifs();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>Gif Master 5000</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header handleClickLayer={handleClickLayer} />

      <main>
        {error.message && <Text color="status-error">{error.message}</Text>}

        <Box pad="large" background="light-2">
          <Grid columns={size !== "small" ? "small" : "100%"} gap="small">
            {gifs.map((gif) => (
              <GifCard
                key={gif.name}
                handleClickDelete={handleClickDelete}
                setItem={setItem}
                {...gif}
              />
            ))}
          </Grid>
        </Box>

        {isModalOpen && (
          <Layer
            onClickOutside={handleClickLayer}
            onEsc={handleClickLayer}
            modal
          >
            <GifForm
              handleClickLayer={handleClickLayer}
              refreshGifs={refreshGifs}
              item={item}
            />
          </Layer>
        )}
      </main>
    </>
  );
}

const GifsQuery = gql`
  query GifsQuery {
    gifs {
      id
      file
      name
      tags
    }
  }
`;

const RemoveGifMutation = gql`
  mutation RemoveGifMutation($id: String!) {
    removeGif(input: { id: $id }) {
      success
    }
  }
`;

export async function getServerSideProps() {
  const apolloClient = initializeApollo();

  const props = { gifs: [] };

  try {
    const response = await apolloClient.query({
      query: GifsQuery,
    });

    props.gifs = response?.data?.gifs || [];
  } catch (error) {
    props.error = JSON.stringify(error);
  } finally {
    return {
      props,
    };
  }
}
