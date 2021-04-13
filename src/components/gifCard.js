import { Image, Box, Card, CardHeader, CardBody, CardFooter } from "grommet";
import { Close, Edit } from "grommet-icons";

import styles from "./gifCard.module.css";

export default function GifCard(props) {
  function handleClickEdit(event) {
    props.setItem({
      gif_id: props.gif_id,
      gif_name: props.gif_name,
      file: props.file,
      tags: props.tags,
    });
  }

  return (
    <Card
      key={props.gif_id}
      elevation="none"
      border={{ side: "all", size: "xsmall", color: "dark-2" }}
    >
      <CardHeader
        className={styles.header}
        pad={{ horizontal: "small", vertical: "xxsmall" }}
        background="dark-2"
      >
        <div
          className={styles.closeContainer}
          onClick={props.handleClickDelete}
          id={props.gif_id}
          data-filename={props.file?.filename}
        >
          <Close size="small" color="brand" />
        </div>

        <div className={styles.editContainer} onClick={handleClickEdit}>
          <Edit size="small" color="brand" />
        </div>
      </CardHeader>

      <CardBody>
        <Image src={props.file?.url} fit="cover" />
      </CardBody>
    </Card>
  );
}
