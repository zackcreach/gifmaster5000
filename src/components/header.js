import {
  Header as GrommetHeader,
  Anchor,
  Box,
  ResponsiveContext,
  Menu,
  Text,
} from "grommet";
import { Grommet as GrommetIcon, Menu as MenuIcon } from "grommet-icons";

export default function Header(props) {
  return (
    <GrommetHeader
      background="dark-2"
      pad="large"
      height="xsmall"
      border={{ color: "brand", side: "top", size: "small" }}
    >
      <Anchor href="/">
        <Text size="xxlarge">Gif Master 5000</Text>
      </Anchor>

      <ResponsiveContext.Consumer>
        {(size) =>
          size === "small" ? (
            <Box justify="end">
              <Menu
                a11yTitle="Navigation Menu"
                dropProps={{ align: { top: "bottom", right: "right" } }}
                icon={<MenuIcon color="brand" />}
                items={[
                  {
                    label: <Box pad="small">Upload</Box>,
                    onClick: props.toggleModal,
                  },
                ]}
              />
            </Box>
          ) : (
            <Box justify="end" direction="row" gap="medium">
              <Anchor label="Upload" onClick={props.toggleModal} />
            </Box>
          )
        }
      </ResponsiveContext.Consumer>
    </GrommetHeader>
  );
}
