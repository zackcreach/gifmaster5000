import { Image, Box, Card, CardHeader, CardBody, CardFooter } from "grommet";
import { Close, Edit } from "grommet-icons";

import styles from "./gifCard.module.css";

export default function GifCard(props) {
  const userId = props.user.data?.viewer?.user_id;

  function handleClickEdit(event) {
    props.setItem({
      gif_id: props.gif_id,
      gif_name: props.gif_name,
      file: props.file,
      tags: props.tags,
    });
  }

  return (
    <Card key={props.gif_id} elevation="none" round={false}>
      {userId && (
        <CardHeader
          className={styles.header}
          pad={{ top: "xxsmall", horizontal: "small", bottom: "xsmall" }}
          background="dark-2"
        >
          <div
            className={styles.closeContainer}
            onClick={props.handleClickDelete}
            id={props.gif_id}
            data-filename={props.file?.filename}
          >
            <Close size="small" color="white" />
          </div>

          <div className={styles.editContainer} onClick={handleClickEdit}>
            <Edit size="small" color="white" />
          </div>
        </CardHeader>
      )}

      <CardBody>
        <Image src={props.file?.url} fit="cover" />
      </CardBody>
    </Card>
  );
}
