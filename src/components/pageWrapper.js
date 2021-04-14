import { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { grommet, Grommet, Box } from "grommet";
import { deepMerge } from "grommet/utils";
import { useRouter } from "next/router";

import Header from "../components/header";

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

export default function PageWrapper({ Component, pageProps }) {
  const router = useRouter();
  const user = useQuery(UserQuery, { notifyOnNetworkStatusChange: true });
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

  return (
    <Grommet theme={theme}>
      <Header
        toggleModalUpload={toggleModalUpload}
        toggleModalUser={toggleModalUser}
        user={user}
      />

      <Box background="dark-1" style={{ minHeight: "100vh" }}>
        <Component
          user={user}
          toggleModalUpload={toggleModalUpload}
          setIsUploadModalOpen={setIsUploadModalOpen}
          isUploadModalOpen={isUploadModalOpen}
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
