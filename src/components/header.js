import { Header as GrommetHeader, Anchor, Box, Text } from "grommet";
import { useRouter } from "next/router";

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
      pad="large"
      height="xsmall"
      border={{ color: "brand", side: "top", size: "medium" }}
    >
      <Anchor href="/">
        <Text size="xxlarge" weight={500}>
          Gif Master 5000
        </Text>
      </Anchor>

      <Box justify="end" direction="row" gap="medium">
        {userId && <Anchor label="Upload" onClick={props.toggleModalUpload} />}
        <Anchor
          label={userId ? "Sign out" : "Login"}
          onClick={handleClickLogin}
        />
      </Box>
    </GrommetHeader>
  );
}
