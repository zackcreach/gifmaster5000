import { Image, Box } from "grommet";
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
    <Box key={props.gif_id} style={{ position: "relative" }}>
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

      <Image
        src={props.file?.url}
        fit="cover"
        style={{ borderRadius: "5px" }}
      />
    </Box>
  );
}
