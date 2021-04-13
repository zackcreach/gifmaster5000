import Head from "next/head";
import { useState, useContext, useEffect } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { initializeApollo } from "../../apollo/client";
import { Main, Layer, Text, Grid, Box, ResponsiveContext } from "grommet";
import { getErrorMessage } from "../../utils/form";

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
      toggleModal();
    }
  }, [item]);

  useEffect(() => {
    if (isModalOpen === false) {
      setItem(null);
    }
  }, [isModalOpen]);

  function toggleModal() {
    setIsModalOpen((prevState) => !prevState);
  }

  async function handleClickDelete(event) {
    const gif_id = event.target.id;
    const filename = event.target.dataset?.filename;

    try {
      // Remove image from file storage
      await fetch(`/api/image/delete?filename=${filename}`, { method: "POST" });

      // Delete record from db
      const response = await removeGif({
        variables: { gif_id },
      });

      if (response?.data?.removeGif?.gif?.gif_id != null) {
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

      <Main background="dark-1" style={{ minHeight: "100vh" }}>
        <Header toggleModal={toggleModal} />
        {error.message && <Text color="status-error">{error.message}</Text>}

        <Grid
          columns={size !== "small" ? "small" : "100%"}
          gap="small"
          pad="large"
        >
          {gifs.map((gif) => (
            <GifCard
              key={gif.gif_name}
              handleClickDelete={handleClickDelete}
              setItem={setItem}
              {...gif}
            />
          ))}
        </Grid>

        {isModalOpen && (
          <Layer onClickOutside={toggleModal} onEsc={toggleModal} modal>
            <GifForm
              availableTags={props.tags}
              toggleModal={toggleModal}
              refreshGifs={refreshGifs}
              item={item}
            />
          </Layer>
        )}
      </Main>
    </>
  );
}

const TagsQuery = gql`
  query TagsQuery {
    tags {
      tag_id
      tag_name
    }
  }
`;

const GifsQuery = gql`
  query GifsQuery {
    gifs {
      gif_id
      gif_name
      file
      tags {
        tag_id
        tag_name
        created_ts
        updated_ts
      }
    }
  }
`;

const RemoveGifMutation = gql`
  mutation RemoveGifMutation($gif_id: ID!) {
    removeGif(input: { gif_id: $gif_id }) {
      gif {
        gif_id
      }
    }
  }
`;

export async function getServerSideProps() {
  const apolloClient = initializeApollo();

  const props = { gifs: [], tags: [] };

  try {
    const gifsResponse = await apolloClient.query({ query: GifsQuery });
    props.gifs = gifsResponse?.data?.gifs || [];

    const tagsResponse = await apolloClient.query({ query: TagsQuery });
    props.tags = tagsResponse?.data?.tags || [];
  } catch (error) {
    props.error = JSON.stringify(error);
  } finally {
    return {
      props,
    };
  }
}
