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
      <Header
        toggleModalUpload={toggleModalUpload}
        toggleModalUser={toggleModalUser}
        handleDragOver={handleDragOver}
        user={user}
      />

      <Box pad={{ horizontal: "large" }}>
        <Component
          user={user}
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
