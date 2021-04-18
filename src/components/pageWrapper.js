import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { gql, useQuery } from "@apollo/client";
import { grommet, Grommet, Box } from "grommet";
import { deepMerge } from "grommet/utils";
import { useRouter } from "next/router";

import Header from "../components/header";

export default function PageWrapper({ Component, pageProps }) {
  const grommetRef = useRef();
  const router = useRouter();
  const user = useQuery(UserQuery, { notifyOnNetworkStatusChange: true });
  const userId = user.data?.viewer?.user_id;
  const publicHost = pageProps.globals.publicHost;
  const title = "Gif Master 5000";
  const description = "Because giphy is garbage";

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  useEffect(() => {
    user.refetch();
  }, [router.pathname]);

  function toggleModalUpload() {
    setIsUploadModalOpen((prevState) => !prevState);
  }

  function toggleModalUser() {
    setIsUserModalOpen((prevState) => !prevState);
  }

  function handleDragOver(event) {
    event.preventDefault();

    if (userId) {
      setIsUploadModalOpen(true);
    }
  }

  return (
    <Grommet theme={theme} full background="dark-1">
      <Head>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="og:title" content={title} />
        <meta name="og:type" content="website" />
        <meta name="og:url" content="https://www.gifmaster5000.com" />
        <meta name="og:image" content={`${publicHost}/favicon.png`} />
        <meta name="og:site_name" content={title} />
        <meta name="og:description" content={description} />
        <link rel="apple-touch-icon" href={`${publicHost}/favicon.png`} />{" "}
        <link
          sizes="72x72"
          rel="apple-touch-icon"
          href={`${publicHost}/favicon.png`}
        />{" "}
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href={`${publicHost}/favicon.png`}
        />{" "}
        <link
          rel="apple-touch-startup-image"
          href={`${publicHost}/favicon.png`}
        />
        <link rel="icon" href={`${publicHost}/favicon.ico`} />
      </Head>

      <Header
        toggleModalUpload={toggleModalUpload}
        toggleModalUser={toggleModalUser}
        handleDragOver={handleDragOver}
        publicHost={publicHost}
        user={user}
      />

      <Box pad={{ horizontal: "large" }}>
        <Component
          user={user}
          publicHost={publicHost}
          toggleModalUpload={toggleModalUpload}
          setIsUploadModalOpen={setIsUploadModalOpen}
          isUploadModalOpen={isUploadModalOpen}
          grommetRef={grommetRef}
          {...pageProps}
        />
      </Box>

      {isUserModalOpen && (
        <Layer onClickOutside={toggleModalUser} onEsc={toggleModalUser} modal>
          <UserForm user={props.user} />
        </Layer>
      )}
    </Grommet>
  );
}

const UserQuery = gql`
  query UserQuery {
    viewer {
      user_id
      email
    }
  }
`;

const theme = deepMerge(grommet, {
  global: {
    colors: {
      brand: "darkorange",
      focus: "orange",
      control: {
        dark: "linear-gradient(0, orange, darkorange)",
      },
    },
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
    },
  },
  button: {
    border: {
      radius: 0,
    },
  },
  tag: {
    border: {
      radius: 0,
    },
  },
  anchor: {
    color: "darkorange",
  },
  fileInput: {
    dragOver: {
      background: "dark-2",
      border: {
        color: "focus",
      },
    },
  },
});
