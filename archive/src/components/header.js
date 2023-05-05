import { Header as GrommetHeader, Anchor, Box, Text, Image } from "grommet";

import styles from "./header.module.css";

export default function Header(props) {
  return (
    <GrommetHeader
      background="dark-2"
      pad={{ horizontal: "large", top: "medium", bottom: "small" }}
      height="xsmall"
      onDragOver={props.handleDragOver}
    >
      <Box justify="end" direction="row" gap="medium">
        <Anchor href="/">
          <Image
            src={`${props.publicHost}/logo.png`}
            className={styles.image}
          />
        </Anchor>
      </Box>
    </GrommetHeader>
  );
}
