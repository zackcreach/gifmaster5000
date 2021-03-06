import { useState, useEffect } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { initializeApollo } from "../../apollo/client";
import {
  Main,
  Layer,
  Text,
  Grid,
  Box,
  InfiniteScroll,
  ResponsiveContext,
} from "grommet";
import { getErrorMessage } from "../../utils/form";

import GifForm from "../components/gifForm";
import GifCard from "../components/gifCard";
import GifSearch from "../components/gifSearch";
import { formatSearchString } from "../../utils/helpers";

export default function Home(props) {
  const [refreshGifs, refreshGifsResponse] = useLazyQuery(GifsQuery, {
    fetchPolicy: "network-only",
  });

  const [removeGif] = useMutation(RemoveGifMutation);
  const [item, setItem] = useState(null);
  const [gifs, setGifs] = useState(props.gifs);
  const [error, setError] = useState({});

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
      props.toggleModalUpload();
    }
  }, [item]);

  useEffect(() => {
    if (props.isUploadModalOpen === false) {
      setItem(null);
    }
  }, [props.isUploadModalOpen]);

  async function handleClickDelete(event) {
    const gif_id = event.target.id;
    const key = event.target.dataset?.key;

    try {
      // Remove image from file storage
      await fetch(`/api/image/delete?key=${key}`, { method: "POST" });

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
    <Main>
      <Box pad={{ top: "medium", bottom: "large" }}>
        <GifSearch
          refreshGifs={refreshGifs}
          setError={setError}
          search={props.search}
        />

        {error.message && <Text color="status-error">{error.message}</Text>}

        <ResponsiveContext.Consumer>
          {(size) => (
            <Grid columns="small" gap="small">
              <InfiniteScroll
                items={gifs}
                step={size.includes("small") ? 8 : 32}
                onMore={() => {
                  // TODO: Query more gifs (eventually)
                }}
              >
                {(gif) => (
                  <GifCard
                    user={props.user}
                    key={gif.gif_name}
                    handleClickDelete={handleClickDelete}
                    setItem={setItem}
                    publicHost={props.globals.publicHost}
                    {...gif}
                  />
                )}
              </InfiniteScroll>
            </Grid>
          )}
        </ResponsiveContext.Consumer>
      </Box>

      {props.isUploadModalOpen && (
        <Layer
          onClickOutside={props.toggleModalUpload}
          onEsc={props.toggleModalUpload}
          modal
        >
          <GifForm
            user={props.user}
            publicHost={props.globals.publicHost}
            grommetRef={props.grommetRef}
            availableTags={props.tags}
            toggleModalUpload={props.toggleModalUpload}
            refreshGifs={refreshGifs}
            item={item}
          />
        </Layer>
      )}
    </Main>
  );
}

const TagsQuery = gql`
  query TagsQuery($limit: Int, $offset: Int) {
    tags(input: { limit: $limit, offset: $offset }) {
      tag_id
      tag_name
    }
  }
`;

const GifsQuery = gql`
  query GifsQuery($search: String, $limit: Int, $offset: Int) {
    gifs(input: { search: $search, limit: $limit, offset: $offset }) {
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

export async function getServerSideProps(req) {
  const search = req.query?.search || "";
  const { query } = initializeApollo();

  const props = {
    gifs: [],
    tags: [],
    search,
  };

  try {
    const gifsResponse = await query({
      query: GifsQuery,
      variables: { search: formatSearchString(search) },
    });
    props.gifs = gifsResponse?.data?.gifs || [];

    const tagsResponse = await query({ query: TagsQuery });
    props.tags = tagsResponse?.data?.tags || [];
  } catch (error) {
    console.log(error);
    props.error = JSON.stringify(error);
  } finally {
    return {
      props,
    };
  }
}
