import { Header as GrommetHeader, Anchor, Box, Text, Image } from "grommet";
import { useRouter } from "next/router";

import styles from "./header.module.css";

export default function Header(props) {
  const router = useRouter();
  const userId = props.user.data?.viewer?.user_id;

  function handleClickLogin() {
    if (userId) {
      router.push("/signout");
    } else {
      router.push("/signin");
    }
  }

  return (
    <GrommetHeader
      background="dark-2"
      pad={{ horizontal: "large", top: "medium", bottom: "small" }}
      height="xsmall"
    >
      <Box justify="end" direction="row" gap="medium">
        <Anchor href="/">
          <Image
            src="https://gif-master.s3.amazonaws.com/logo.png"
            className={styles.image}
          />
        </Anchor>
      </Box>
    </GrommetHeader>
  );
}
